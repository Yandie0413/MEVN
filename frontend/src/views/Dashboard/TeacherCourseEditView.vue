<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useCourseStore } from '@/stores/courseStore';
import type { Course, Chapter, QuizQuestion } from '@/stores/courseStore';
import { useI18nStore } from '@/stores/i18nStore';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const i18n = useI18nStore();

const id = computed(() => route.params.id as string);
const isNew = computed(() => id.value === 'new');

const course = ref<Course | null>(null);
const loadingCourse = ref(false);
const saving = ref(false);
const savingChapter = ref(false);

const bgOptions = ['bg-edu-lavender', 'bg-edu-sky', 'bg-edu-green', 'bg-edu-orange', 'bg-edu-rose'];

const form = reactive({
  title: '', titleEn: '', category: '', categoryEn: '',
  description: '', descriptionEn: '', level: 'Niveau débutant', levelEn: 'Beginner level',
  bgColor: 'bg-edu-lavender', iconColor: '#7c3aed', rating: 4.8, published: true
});

onMounted(async () => {
  if (!isNew.value) {
    loadingCourse.value = true;
    try {
      const { data } = await api.get<Course>(`/courses/${id.value}`);
      course.value = data;
      Object.assign(form, {
        title: data.title, titleEn: data.titleEn || '', category: data.category, categoryEn: data.categoryEn || '',
        description: data.description, descriptionEn: data.descriptionEn || '',
        level: data.level, levelEn: data.levelEn || '',
        bgColor: data.bgColor, iconColor: data.iconColor, rating: data.rating, published: data.published ?? true
      });
    } finally {
      loadingCourse.value = false;
    }
  }
});

async function saveCourse() {
  if (!form.title || !form.category || !form.description) return;
  saving.value = true;
  try {
    if (isNew.value) {
      const created = await courseStore.createCourse({ ...form });
      router.replace(`/dashboard/enseignement/${created.id}`);
    } else {
      const updated = await courseStore.updateCourseMeta(id.value, { ...form });
      course.value = updated;
    }
  } finally {
    saving.value = false;
  }
}

// === Chapters ===
const showChapterForm = ref(false);
const editingChapterId = ref<string | null>(null);

const chapterForm = reactive({
  title: '', titleEn: '', type: 'text' as Chapter['type'], duration: '10 min',
  content: '', contentEn: '', videoUrl: '',
  quizQuestions: [] as QuizQuestion[]
});

function chapterIcon(type: string) {
  if (type === 'video') return VideoCameraIcon;
  if (type === 'quiz') return QuestionMarkCircleIcon;
  return DocumentTextIcon;
}

function resetChapterForm() {
  chapterForm.title = '';
  chapterForm.titleEn = '';
  chapterForm.type = 'text';
  chapterForm.duration = '10 min';
  chapterForm.content = '';
  chapterForm.contentEn = '';
  chapterForm.videoUrl = '';
  chapterForm.quizQuestions = [];
  editingChapterId.value = null;
}

function openNewChapter() {
  resetChapterForm();
  showChapterForm.value = true;
}

function openEditChapter(ch: Chapter) {
  editingChapterId.value = ch.id;
  chapterForm.title = ch.title;
  chapterForm.titleEn = ch.titleEn || '';
  chapterForm.type = ch.type;
  chapterForm.duration = ch.duration;
  chapterForm.content = ch.content || '';
  chapterForm.contentEn = ch.contentEn || '';
  chapterForm.videoUrl = ch.videoUrl || '';
  chapterForm.quizQuestions = ch.quizQuestions ? JSON.parse(JSON.stringify(ch.quizQuestions)) : [];
  showChapterForm.value = true;
}

function closeChapterForm() {
  showChapterForm.value = false;
  resetChapterForm();
}

function addQuestion() {
  chapterForm.quizQuestions.push({
    id: '', text: '', textEn: '', explanation: '', explanationEn: '',
    options: [
      { id: '', text: '', textEn: '', isCorrect: true },
      { id: '', text: '', textEn: '', isCorrect: false }
    ]
  });
}

function removeQuestion(idx: number) {
  chapterForm.quizQuestions.splice(idx, 1);
}

function addOption(qIdx: number) {
  chapterForm.quizQuestions[qIdx].options.push({ id: '', text: '', textEn: '', isCorrect: false });
}

function removeOption(qIdx: number, oIdx: number) {
  chapterForm.quizQuestions[qIdx].options.splice(oIdx, 1);
}

function setCorrect(qIdx: number, oIdx: number) {
  chapterForm.quizQuestions[qIdx].options.forEach((o, i) => { o.isCorrect = i === oIdx; });
}

async function saveChapter() {
  if (!chapterForm.title) return;
  const payload: Partial<Chapter> = {
    title: chapterForm.title,
    titleEn: chapterForm.titleEn,
    type: chapterForm.type,
    duration: chapterForm.duration
  };
  if (chapterForm.type === 'quiz') {
    payload.quizQuestions = chapterForm.quizQuestions;
  } else {
    payload.content = chapterForm.content;
    payload.contentEn = chapterForm.contentEn;
    if (chapterForm.type === 'video') payload.videoUrl = chapterForm.videoUrl;
  }

  savingChapter.value = true;
  try {
    let updated: Course;
    if (editingChapterId.value) {
      updated = await courseStore.updateChapterApi(id.value, editingChapterId.value, payload);
    } else {
      updated = await courseStore.addChapterApi(id.value, payload);
    }
    course.value = updated;
    closeChapterForm();
  } finally {
    savingChapter.value = false;
  }
}

async function removeChapter(chapterId: string) {
  const ok = window.confirm(i18n.isFrench ? 'Supprimer ce chapitre ?' : 'Delete this chapter?');
  if (!ok) return;
  const updated = await courseStore.deleteChapterApi(id.value, chapterId);
  course.value = updated;
}
</script>

<template>
  <div class="flex flex-col pb-10">
    <button @click="router.push('/dashboard/enseignement')" class="flex items-center gap-2 text-sm font-bold text-edu-navy dark:text-white hover:text-purple-600 dark:hover:text-edu-lime transition-colors mb-6 w-fit">
      <ArrowLeftIcon class="w-4 h-4" /> {{ i18n.isFrench ? 'Retour à mes cours' : 'Back to my courses' }}
    </button>

    <h1 class="text-3xl font-extrabold text-edu-text-main dark:text-white mb-8">
      {{ isNew ? (i18n.isFrench ? 'Nouveau cours' : 'New course') : (i18n.isFrench ? 'Modifier le cours' : 'Edit course') }}
    </h1>

    <!-- Course meta form -->
    <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 md:p-8 shadow-soft dark:shadow-gray-900/50 mb-8">
      <h2 class="font-extrabold text-edu-text-main dark:text-white text-lg mb-6">{{ i18n.isFrench ? 'Informations générales' : 'General information' }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Titre (FR)' : 'Title (FR)' }} *</label>
          <input v-model="form.title" type="text" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Titre (EN)' : 'Title (EN)' }}</label>
          <input v-model="form.titleEn" type="text" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Catégorie (FR)' : 'Category (FR)' }} *</label>
          <input v-model="form.category" type="text" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Catégorie (EN)' : 'Category (EN)' }}</label>
          <input v-model="form.categoryEn" type="text" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Description (FR)' : 'Description (FR)' }} *</label>
          <textarea v-model="form.description" rows="3" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 resize-none"></textarea>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Description (EN)' : 'Description (EN)' }}</label>
          <textarea v-model="form.descriptionEn" rows="3" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 resize-none"></textarea>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Niveau (FR)' : 'Level (FR)' }}</label>
          <input v-model="form.level" type="text" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Niveau (EN)' : 'Level (EN)' }}</label>
          <input v-model="form.levelEn" type="text" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Note' : 'Rating' }}</label>
          <input v-model.number="form.rating" type="number" min="0" max="5" step="0.1" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Couleur d\'accent' : 'Accent color' }}</label>
          <input v-model="form.iconColor" type="color" class="border border-gray-200 dark:border-gray-700 rounded-xl h-10 w-full bg-white dark:bg-gray-900" />
        </div>
      </div>
      <div class="flex flex-col gap-1.5 mb-6">
        <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Bannière' : 'Banner' }}</label>
        <div class="flex gap-3">
          <button
            v-for="opt in bgOptions"
            :key="opt"
            type="button"
            @click="form.bgColor = opt"
            class="w-10 h-10 rounded-xl border-2"
            :class="[opt, form.bgColor === opt ? 'border-edu-navy dark:border-edu-lime' : 'border-transparent']"
          ></button>
        </div>
      </div>
      <label class="flex items-center gap-2.5 mb-6 cursor-pointer w-fit">
        <input v-model="form.published" type="checkbox" class="w-4 h-4 accent-edu-navy dark:accent-edu-lime rounded" />
        <span class="text-sm font-semibold text-edu-text-main dark:text-white">{{ i18n.isFrench ? 'Cours publié (visible par les étudiants)' : 'Course published (visible to students)' }}</span>
      </label>

      <button
        @click="saveCourse"
        :disabled="saving || !form.title || !form.category || !form.description"
        class="bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold px-6 py-3 rounded-2xl text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ saving ? i18n.t('common.loading') : (isNew ? (i18n.isFrench ? 'Créer le cours' : 'Create course') : i18n.t('common.save')) }}
      </button>
    </div>

    <!-- Chapters -->
    <div v-if="!isNew && course" class="bg-white dark:bg-gray-800 rounded-[24px] p-6 md:p-8 shadow-soft dark:shadow-gray-900/50">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-extrabold text-edu-text-main dark:text-white text-lg">{{ i18n.t('course.chapters') }} ({{ course.chapters.length }})</h2>
        <button
          @click="openNewChapter"
          class="bg-edu-lime text-edu-navy font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#c5e64d] transition-colors"
        >
          <PlusIcon class="w-3.5 h-3.5" /> {{ i18n.isFrench ? 'Ajouter un chapitre' : 'Add chapter' }}
        </button>
      </div>

      <div class="flex flex-col gap-3 mb-2">
        <div
          v-for="ch in course.chapters"
          :key="ch.id"
          class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-700"
        >
          <div class="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-edu-navy dark:text-edu-lime">
            <component :is="chapterIcon(ch.type)" class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-edu-text-main dark:text-white text-sm truncate">{{ ch.title }}</p>
            <p class="text-[11px] text-edu-text-muted dark:text-gray-400 capitalize">{{ ch.type }} · {{ ch.duration }}<span v-if="ch.type === 'quiz'"> · {{ ch.quizQuestions?.length || 0 }} {{ i18n.isFrench ? 'questions' : 'questions' }}</span></p>
          </div>
          <button @click="openEditChapter(ch)" class="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-700 text-edu-navy dark:text-white flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <PencilSquareIcon class="w-4 h-4" />
          </button>
          <button @click="removeChapter(ch.id)" class="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
        <p v-if="course.chapters.length === 0" class="text-sm text-edu-text-muted dark:text-gray-400 text-center py-8">
          {{ i18n.isFrench ? 'Aucun chapitre. Ajoute-en un pour commencer.' : 'No chapters yet. Add one to get started.' }}
        </p>
      </div>
    </div>

    <p v-else-if="!isNew && loadingCourse" class="text-center py-10 text-edu-text-muted dark:text-gray-400">{{ i18n.t('common.loading') }}</p>

    <!-- Chapter form modal -->
    <Teleport to="body">
      <div v-if="showChapterForm" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="closeChapterForm">
        <div class="bg-white dark:bg-gray-800 rounded-[28px] p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-extrabold text-edu-text-main dark:text-white text-lg">
              {{ editingChapterId ? (i18n.isFrench ? 'Modifier le chapitre' : 'Edit chapter') : (i18n.isFrench ? 'Nouveau chapitre' : 'New chapter') }}
            </h3>
            <button @click="closeChapterForm" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Titre (FR)' : 'Title (FR)' }} *</label>
              <input v-model="chapterForm.title" type="text" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Titre (EN)' : 'Title (EN)' }}</label>
              <input v-model="chapterForm.titleEn" type="text" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Type' : 'Type' }}</label>
              <select v-model="chapterForm.type" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60">
                <option value="text">{{ i18n.isFrench ? 'Texte' : 'Text' }}</option>
                <option value="video">{{ i18n.isFrench ? 'Vidéo' : 'Video' }}</option>
                <option value="markdown">Markdown</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Durée' : 'Duration' }}</label>
              <input v-model="chapterForm.duration" type="text" placeholder="10 min" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
            </div>
          </div>

          <!-- Text / Video content -->
          <div v-if="chapterForm.type !== 'quiz'" class="flex flex-col gap-4 mb-4">
            <div v-if="chapterForm.type === 'video'" class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">URL {{ i18n.isFrench ? 'de la vidéo (embed)' : 'video (embed)' }}</label>
              <input v-model="chapterForm.videoUrl" type="text" placeholder="https://www.youtube.com/embed/..." class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Contenu (FR)' : 'Content (FR)' }}</label>
              <textarea v-model="chapterForm.content" rows="5" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 resize-none"></textarea>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Contenu (EN)' : 'Content (EN)' }}</label>
              <textarea v-model="chapterForm.contentEn" rows="5" class="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 resize-none"></textarea>
            </div>
          </div>

          <!-- Quiz builder -->
          <div v-else class="flex flex-col gap-5 mb-4">
            <div
              v-for="(q, qIdx) in chapterForm.quizQuestions"
              :key="qIdx"
              class="border border-gray-200 dark:border-gray-700 rounded-2xl p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Question' : 'Question' }} {{ qIdx + 1 }}</span>
                <button @click="removeQuestion(qIdx)" class="text-rose-500 hover:text-rose-600">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input v-model="q.text" type="text" :placeholder="i18n.isFrench ? 'Question (FR)' : 'Question (FR)'" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
                <input v-model="q.textEn" type="text" :placeholder="i18n.isFrench ? 'Question (EN)' : 'Question (EN)'" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
              </div>
              <div class="flex flex-col gap-2 mb-3">
                <div v-for="(o, oIdx) in q.options" :key="oIdx" class="flex items-center gap-2">
                  <button type="button" @click="setCorrect(qIdx, oIdx)" class="flex-shrink-0">
                    <CheckCircleIcon class="w-5 h-5" :class="o.isCorrect ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600'" />
                  </button>
                  <input v-model="o.text" type="text" :placeholder="(i18n.isFrench ? 'Option' : 'Option') + ' ' + (oIdx + 1) + ' (FR)'" class="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
                  <input v-model="o.textEn" type="text" :placeholder="(i18n.isFrench ? 'Option' : 'Option') + ' ' + (oIdx + 1) + ' (EN)'" class="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
                  <button v-if="q.options.length > 2" @click="removeOption(qIdx, oIdx)" class="text-gray-400 hover:text-rose-500">
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
                <button @click="addOption(qIdx)" class="text-xs font-bold text-edu-navy dark:text-edu-lime hover:underline w-fit">
                  + {{ i18n.isFrench ? 'Ajouter une option' : 'Add option' }}
                </button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input v-model="q.explanation" type="text" :placeholder="i18n.isFrench ? 'Explication (FR)' : 'Explanation (FR)'" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
                <input v-model="q.explanationEn" type="text" :placeholder="i18n.isFrench ? 'Explication (EN)' : 'Explanation (EN)'" class="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-900 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60" />
              </div>
            </div>
            <button @click="addQuestion" class="bg-gray-50 dark:bg-gray-700 text-edu-navy dark:text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <PlusIcon class="w-4 h-4" /> {{ i18n.isFrench ? 'Ajouter une question' : 'Add question' }}
            </button>
          </div>

          <button
            @click="saveChapter"
            :disabled="savingChapter || !chapterForm.title"
            class="w-full bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold py-3.5 rounded-2xl text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ savingChapter ? i18n.t('common.loading') : i18n.t('common.save') }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
