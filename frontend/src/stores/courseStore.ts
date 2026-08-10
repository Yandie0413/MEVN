import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

export interface QuizOption {
  id: string;
  text: string;
  textEn?: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  textEn?: string;
  options: QuizOption[];
  explanation: string;
  explanationEn?: string;
}

export interface Chapter {
  id: string;
  title: string;
  titleEn?: string;
  type: 'video' | 'text' | 'quiz' | 'markdown';
  duration: string;
  completed: boolean;
  content?: string;
  contentEn?: string;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
  order?: number;
}

export interface Course {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  rating: number;
  students: number;
  progress: number;
  chapters: Chapter[];
  bgColor: string;
  iconColor: string;
  xp: number;
  level: string;
  levelEn?: string;
  teacher?: string;
  published?: boolean;
  enrolled?: boolean;
  isOwner?: boolean;
}

export interface QuizSubmitResult {
  score: number;
  correctCount: number;
  total: number;
  results: { questionId: string; submittedOptionId: string | null; correctOptionId: string | null; isCorrect: boolean; explanation: string }[];
  progression: { completedChapters: string[]; progressPercent: number; xpEarned: number };
  certificate: { id: string; code: string; score: number } | null;
}

export const useCourseStore = defineStore('course', () => {
  // Locale tracking
  const locale = ref<'fr' | 'en'>('fr');

  function setLocale(newLocale: 'fr' | 'en') {
    locale.value = newLocale;
  }

  function getTitle(item: { title: string; titleEn?: string }): string {
    return locale.value === 'en' && item.titleEn ? item.titleEn : item.title;
  }

  function getChapterTitle(chapter: { title: string; titleEn?: string }): string {
    return locale.value === 'en' && chapter.titleEn ? chapter.titleEn : chapter.title;
  }

  function getQuestionText(q: { text: string; textEn?: string }): string {
    return locale.value === 'en' && q.textEn ? q.textEn : q.text;
  }

  function getOptionText(opt: { text: string; textEn?: string }): string {
    return locale.value === 'en' && opt.textEn ? opt.textEn : opt.text;
  }

  function getExplanation(q: { explanation: string; explanationEn?: string }): string {
    return locale.value === 'en' && q.explanationEn ? q.explanationEn : q.explanation;
  }

  function getCourseCategory(course: { category: string; categoryEn?: string }): string {
    return locale.value === 'en' && course.categoryEn ? course.categoryEn : course.category;
  }

  function getCourseDescription(course: { description: string; descriptionEn?: string }): string {
    return locale.value === 'en' && course.descriptionEn ? course.descriptionEn : course.description;
  }

  function getChapterContent(chapter: { content?: string; contentEn?: string }): string {
    if (locale.value === 'en' && chapter.contentEn) {
      return chapter.contentEn;
    }
    return chapter.content || '';
  }

  function getCourseLevel(course: { level: string; levelEn?: string }): string {
    return locale.value === 'en' && course.levelEn ? course.levelEn : course.level;
  }

  function getLocalizedCourse(course: Course): Course {
    return {
      ...course,
      title: getTitle(course),
      category: getCourseCategory(course),
      description: getCourseDescription(course),
      level: getCourseLevel(course),
      chapters: course.chapters.map((ch) => ({
        ...ch,
        title: getChapterTitle(ch),
        content: getChapterContent(ch),
        quizQuestions: ch.quizQuestions?.map((q) => ({
          ...q,
          text: getQuestionText(q),
          options: q.options?.map((opt) => ({
            ...opt,
            text: getOptionText(opt)
          })),
          explanation: getExplanation(q)
        }))
      }))
    };
  }

  // === STATE ===
  const courses = ref<Course[]>([]);
  const currentCourseId = ref<string | null>(null);
  const activeChapterId = ref<string | null>(null);
  const quizScores = ref<Record<string, number>>({});
  const loading = ref(false);
  const loaded = ref(false);

  // === API ACTIONS ===
  async function fetchCourses(force = false) {
    if (loaded.value && !force) return;
    loading.value = true;
    try {
      const { data } = await api.get<Course[]>('/courses');
      courses.value = data;
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  function upsertCourse(course: Course) {
    const idx = courses.value.findIndex((c) => c.id === course.id);
    if (idx !== -1) {
      courses.value[idx] = course;
    } else {
      courses.value.push(course);
    }
  }

  async function fetchCourseDetail(courseId: string) {
    const { data } = await api.get<Course>(`/courses/${courseId}`);
    upsertCourse(data);
    return data;
  }

  async function setCourseActive(courseId: string) {
    currentCourseId.value = courseId;
    activeChapterId.value = null; // Reset when changing course
    if (courses.value.length === 0) {
      await fetchCourses();
    }
    try {
      await fetchCourseDetail(courseId);
    } catch (e) {
      // Le cours reste tel que chargé par fetchCourses() si le détail échoue
    }

    const authStore = useAuthStore();
    const course = courses.value.find((c) => c.id === courseId);
    if (authStore.isAuthenticated && !authStore.isTeacher && course && !course.enrolled) {
      try {
        await api.post(`/courses/${courseId}/enroll`);
        course.enrolled = true;
      } catch (e) {
        // Non bloquant : l'inscription se refera implicitement à la première progression
      }
    }
  }

  function setActiveChapter(chapterId: string) {
    activeChapterId.value = chapterId;
  }

  // === GETTERS ===
  const currentCourse = computed(() => {
    const course = courses.value.find(c => c.id === currentCourseId.value) || null;
    if (!course) return null;
    return getLocalizedCourse(course);
  });

  const activeChapter = computed(() => {
    return currentCourse.value?.chapters.find(c => c.id === activeChapterId.value) || null;
  });

  const progressPercentage = computed(() => currentCourse.value?.progress ?? 0);

  const isCourseFullyCompleted = computed(() => progressPercentage.value === 100);

  // === PROGRESSION ACTIONS ===
  function applyProgressionUpdate(courseId: string, progression: { completedChapters: string[]; progressPercent: number }) {
    const course = courses.value.find(c => c.id === courseId);
    if (!course) return;
    const completedIds = new Set(progression.completedChapters);
    course.chapters.forEach(ch => {
      ch.completed = completedIds.has(ch.id);
    });
    course.progress = progression.progressPercent;
    course.enrolled = true;
  }

  async function markChapterCompleted(chapterId: string) {
    if (!currentCourseId.value) return;
    const { data } = await api.post(`/courses/${currentCourseId.value}/chapters/${chapterId}/complete`);
    applyProgressionUpdate(currentCourseId.value, data.progression);
    return data.certificate as QuizSubmitResult['certificate'];
  }

  async function submitQuiz(chapterId: string, answers: { questionId: string; optionId: string }[]) {
    if (!currentCourseId.value) return null;
    const { data } = await api.post<QuizSubmitResult>(
      `/courses/${currentCourseId.value}/chapters/${chapterId}/quiz/submit`,
      { answers }
    );
    quizScores.value[chapterId] = data.score;
    applyProgressionUpdate(currentCourseId.value, data.progression);
    return data;
  }

  // === TEACHER ACTIONS (gestion de cours) ===
  const teachingCourses = ref<Course[]>([]);
  const teachingLoading = ref(false);

  async function fetchMyTeachingCourses() {
    teachingLoading.value = true;
    try {
      const { data } = await api.get<Course[]>('/courses/mine/teaching');
      teachingCourses.value = data;
    } finally {
      teachingLoading.value = false;
    }
  }

  function upsertTeachingCourse(course: Course) {
    const idx = teachingCourses.value.findIndex((c) => c.id === course.id);
    if (idx !== -1) teachingCourses.value[idx] = course;
    else teachingCourses.value.unshift(course);
  }

  async function createCourse(payload: Partial<Course>) {
    const { data } = await api.post<Course>('/courses', payload);
    upsertTeachingCourse(data);
    return data;
  }

  async function updateCourseMeta(courseId: string, payload: Partial<Course>) {
    const { data } = await api.put<Course>(`/courses/${courseId}`, payload);
    upsertTeachingCourse(data);
    return data;
  }

  async function deleteCourseById(courseId: string) {
    await api.delete(`/courses/${courseId}`);
    teachingCourses.value = teachingCourses.value.filter((c) => c.id !== courseId);
  }

  async function addChapterApi(courseId: string, payload: Partial<Chapter>) {
    const { data } = await api.post<Course>(`/courses/${courseId}/chapters`, payload);
    upsertTeachingCourse(data);
    return data;
  }

  async function updateChapterApi(courseId: string, chapterId: string, payload: Partial<Chapter>) {
    const { data } = await api.put<Course>(`/courses/${courseId}/chapters/${chapterId}`, payload);
    upsertTeachingCourse(data);
    return data;
  }

  async function deleteChapterApi(courseId: string, chapterId: string) {
    const { data } = await api.delete<Course>(`/courses/${courseId}/chapters/${chapterId}`);
    upsertTeachingCourse(data);
    return data;
  }

  return {
    locale,
    courses,
    loading,
    loaded,
    currentCourseId,
    currentCourse,
    activeChapterId,
    activeChapter,
    quizScores,
    progressPercentage,
    isCourseFullyCompleted,
    setLocale,
    fetchCourses,
    fetchCourseDetail,
    setCourseActive,
    setActiveChapter,
    markChapterCompleted,
    submitQuiz,
    teachingCourses,
    teachingLoading,
    fetchMyTeachingCourses,
    createCourse,
    updateCourseMeta,
    deleteCourseById,
    addChapterApi,
    updateChapterApi,
    deleteChapterApi
  };
});
