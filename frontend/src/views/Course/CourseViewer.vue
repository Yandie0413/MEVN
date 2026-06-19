<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore';
import { useI18nStore } from '@/stores/i18nStore';
import ChapterContent from '@/components/course/ChapterContent.vue';
import QuizViewer from '@/components/quiz/QuizViewer.vue';
import {
  StarIcon,
  UserGroupIcon,
  TrophyIcon,
  AcademicCapIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  BellIcon,
  FireIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/solid';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const i18n = useI18nStore();

const viewMode = ref<'overview' | 'lesson'>('overview');

onMounted(() => {
  const courseId = route.params.id as string;
  courseStore.setCourseActive(courseId);
  courseStore.setLocale(i18n.locale);
  viewMode.value = 'overview';
});

watch(() => i18n.locale, (newLocale) => {
  courseStore.setLocale(newLocale);
});

const currentCourse = computed(() => courseStore.currentCourse);
const activeChapter = computed(() => courseStore.activeChapter);
const progressPercentage = computed(() => courseStore.progressPercentage);
const isCourseFullyCompleted = computed(() => courseStore.isCourseFullyCompleted);

const completedChaptersCount = computed(() => {
  if (!currentCourse.value) return 0;
  return currentCourse.value.chapters.filter(c => c.completed).length;
});

// Navigate back to overview page
function goBackToOverview() {
  viewMode.value = 'overview';
}

// Start or resume course
function startOrResumeCourse() {
  if (!currentCourse.value) return;
  
  // Find first uncompleted chapter
  const firstUncompleted = currentCourse.value.chapters.find(c => !c.completed);
  const chapterIdToStart = firstUncompleted ? firstUncompleted.id : currentCourse.value.chapters[0].id;
  
  courseStore.setActiveChapter(chapterIdToStart);
  viewMode.value = 'lesson';
}

// Start quiz directly
function startQuizDirectly() {
  if (!currentCourse.value) return;
  
  // Find the quiz chapter
  const quizChapter = currentCourse.value.chapters.find(c => c.type === 'quiz');
  if (quizChapter) {
    courseStore.setActiveChapter(quizChapter.id);
    viewMode.value = 'lesson';
  }
}

// Select a specific chapter from list
function selectChapter(chapterId: string) {
  courseStore.setActiveChapter(chapterId);
  viewMode.value = 'lesson';
}

// When a lesson or video is completed, automatically move to next chapter
function handleLessonCompleted(chapterId: string) {
  if (!currentCourse.value) return;
  const currentIndex = currentCourse.value.chapters.findIndex(c => c.id === chapterId);
  if (currentIndex !== -1 && currentIndex < currentCourse.value.chapters.length - 1) {
    // Select next chapter
    const nextChapter = currentCourse.value.chapters[currentIndex + 1];
    courseStore.setActiveChapter(nextChapter.id);
  } else {
    // Completed last chapter, go back to overview
    viewMode.value = 'overview';
  }
}

// Determine chapter status
function getChapterStatus(chapter: any, index: number): string {
  if (chapter.completed) return i18n.t('course.completed');
  
  if (currentCourse.value) {
    const firstUncompleted = currentCourse.value.chapters.find(c => !c.completed);
    if (firstUncompleted && firstUncompleted.id === chapter.id) {
      return i18n.t('course.inProgress');
    }
  }
  return i18n.t('course.toDo');
}

// Navigation helpers
function goToCertificates() {
  router.push('/dashboard/certificats');
}
</script>

<template>
  <div class="min-h-screen bg-edu-bg font-sans pb-12" v-if="currentCourse">
    
    <!-- TOP BAR (Matches Image 2 top bar) -->
    <header class="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
      <div class="w-[450px] bg-white h-12 rounded-full flex items-center px-5 shadow-soft">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 mr-3" />
        <input type="text" placeholder="Cherche un cours, un sujet..." class="bg-transparent border-none outline-none text-sm w-full text-edu-text-main placeholder-gray-400 font-medium" />
      </div>
      <div class="flex items-center gap-4">
        <button class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft text-gray-500 hover:text-edu-navy transition-colors">
          <BellIcon class="w-5 h-5" />
        </button>
        <div class="h-12 bg-white rounded-full flex items-center px-5 shadow-soft gap-2 font-bold text-sm text-edu-text-main">
          <FireIcon class="w-5 h-5 text-orange-500" />
          <span>7 <span class="text-gray-400 font-medium">jours</span></span>
        </div>
      </div>
    </header>

    <!-- BACK TO DASHBOARD BUTTON (visible in both modes) -->
    <div class="max-w-7xl mx-auto px-6 mb-4 flex items-center">
      <button 
        @click="viewMode === 'overview' ? router.push('/dashboard/mes-cours') : goBackToOverview()" 
        class="flex items-center gap-2 text-sm font-bold text-edu-navy hover:text-purple-600 transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        <span>{{ viewMode === 'overview' ? 'Retour aux cours' : 'Retour au cours' }}</span>
      </button>
    </div>

    <!-- VIEW MODE: OVERVIEW (Image 1 Layout) -->
    <div class="max-w-7xl mx-auto px-6" v-if="viewMode === 'overview'">
      <!-- Hero Course Banner -->
      <div class="bg-white rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-soft mb-8 border border-gray-100/50"
           :class="currentCourse.bgColor">
        <!-- Text content -->
        <div class="z-10 max-w-2xl text-edu-navy">
          <!-- Category Tag -->
          <span class="inline-block bg-white/80 text-edu-text-main text-xs font-extrabold px-4 py-2 rounded-full mb-5 tracking-wide shadow-sm">
            {{ currentCourse.category }}
          </span>
          <!-- Title -->
          <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {{ currentCourse.title }}
          </h1>
          <!-- Subtitle -->
          <p class="text-sm md:text-base text-edu-navy/80 font-medium mb-6 max-w-xl leading-relaxed">
            {{ currentCourse.description }}
          </p>
          <!-- Metadata row -->
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs md:text-sm font-extrabold text-edu-navy/90 mb-8">
            <span class="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-xl">
              <StarIcon class="w-4 h-4 text-yellow-500" /> {{ currentCourse.rating }}
            </span>
            <span class="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-xl">
              <UserGroupIcon class="w-4 h-4" /> {{ currentCourse.students.toLocaleString() }} élèves
            </span>
            <span class="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-xl">
              <TrophyIcon class="w-4 h-4" /> {{ currentCourse.xp }} XP
            </span>
            <span class="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-xl">
              <AcademicCapIcon class="w-4 h-4" /> {{ currentCourse.level }}
            </span>
          </div>
          <!-- Buttons -->
          <div class="flex items-center gap-4">
            <button 
              @click="startOrResumeCourse"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] shadow-sm"
            >
              <PlayIcon class="w-4 h-4" /> {{ progressPercentage > 0 ? 'Continuer le cours' : 'Commencer le cours' }}
            </button>
            <button 
              @click="startQuizDirectly"
              class="bg-white text-edu-text-main border border-gray-200 font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] shadow-sm"
            >
              <TrophyIcon class="w-4 h-4 text-yellow-500" /> Faire le quiz
            </button>
          </div>
        </div>

        <!-- Dynamic Course Banner Graphic (SVG) -->
        <div class="w-full md:w-auto mt-8 md:mt-0 z-10 flex items-center justify-center">
          <!-- Abacus for Maths Magiques -->
          <div v-if="currentCourse.title === 'Maths Magiques'" class="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
            <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="220" height="160" rx="8" fill="#475569" stroke="#334155" stroke-width="6"/>
              <rect x="18" y="18" width="204" height="144" rx="4" fill="#64748B"/>
              <rect x="10" y="55" width="220" height="12" fill="#334155"/>
              <rect x="40" y="20" width="4" height="140" fill="#94A3B8"/>
              <rect x="80" y="20" width="4" height="140" fill="#94A3B8"/>
              <rect x="120" y="20" width="4" height="140" fill="#94A3B8"/>
              <rect x="160" y="20" width="4" height="140" fill="#94A3B8"/>
              <rect x="200" y="20" width="4" height="140" fill="#94A3B8"/>
              <rect x="30" y="25" width="24" height="12" rx="4" fill="#F43F5E"/>
              <rect x="70" y="40" width="24" height="12" rx="4" fill="#0EA5E9"/>
              <rect x="110" y="25" width="24" height="12" rx="4" fill="#10B981"/>
              <rect x="150" y="40" width="24" height="12" rx="4" fill="#F59E0B"/>
              <rect x="190" y="25" width="24" height="12" rx="4" fill="#8B5CF6"/>
              <rect x="30" y="70" width="24" height="12" rx="4" fill="#F43F5E"/>
              <rect x="30" y="84" width="24" height="12" rx="4" fill="#F43F5E"/>
              <rect x="30" y="98" width="24" height="12" rx="4" fill="#F43F5E"/>
              <rect x="30" y="140" width="24" height="12" rx="4" fill="#F43F5E"/>
              <rect x="70" y="70" width="24" height="12" rx="4" fill="#0EA5E9"/>
              <rect x="70" y="84" width="24" height="12" rx="4" fill="#0EA5E9"/>
              <rect x="70" y="126" width="24" height="12" rx="4" fill="#0EA5E9"/>
              <rect x="70" y="140" width="24" height="12" rx="4" fill="#0EA5E9"/>
              <rect x="110" y="70" width="24" height="12" rx="4" fill="#10B981"/>
              <rect x="110" y="84" width="24" height="12" rx="4" fill="#10B981"/>
              <rect x="110" y="98" width="24" height="12" rx="4" fill="#10B981"/>
              <rect x="110" y="112" width="24" height="12" rx="4" fill="#10B981"/>
              <rect x="150" y="70" width="24" height="12" rx="4" fill="#F59E0B"/>
              <rect x="150" y="112" width="24" height="12" rx="4" fill="#F59E0B"/>
              <rect x="150" y="126" width="24" height="12" rx="4" fill="#F59E0B"/>
              <rect x="150" y="140" width="24" height="12" rx="4" fill="#F59E0B"/>
              <rect x="190" y="98" width="24" height="12" rx="4" fill="#8B5CF6"/>
              <rect x="190" y="112" width="24" height="12" rx="4" fill="#8B5CF6"/>
              <rect x="190" y="126" width="24" height="12" rx="4" fill="#8B5CF6"/>
              <rect x="190" y="140" width="24" height="12" rx="4" fill="#8B5CF6"/>
            </svg>
          </div>
          <!-- Space for L'Univers Fascinant -->
          <div v-else-if="currentCourse.title === 'L\'Univers Fascinant'" class="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
            <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="120" cy="90" rx="100" ry="40" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.3"/>
              <ellipse cx="120" cy="90" rx="70" ry="28" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.3"/>
              <circle cx="120" cy="90" r="24" fill="url(#sunGrad)"/>
              <circle cx="50" cy="80" r="8" fill="#38bdf8"/>
              <circle cx="170" cy="105" r="12" fill="#fb923c"/>
              <g transform="translate(160, 40) rotate(-35)">
                <path d="M0, -20 L8, 0 L-8, 0 Z" fill="#f43f5e"/>
                <rect x="-4" y="0" width="8" height="10" fill="#e2e8f0"/>
                <path d="M-8, 5 L-12, 10 L-4, 10 Z" fill="#64748b"/>
                <path d="M8, 5 L12, 10 L4, 10 Z" fill="#64748b"/>
                <path d="M-3, 10 L0, 18 L3, 10 Z" fill="#f59e0b"/>
              </g>
              <circle cx="30" cy="40" r="1.5" fill="#fff" opacity="0.8"/>
              <circle cx="80" cy="30" r="2" fill="#fff" opacity="0.5"/>
              <circle cx="210" cy="140" r="1" fill="#fff" opacity="0.9"/>
              <defs>
                <radialGradient id="sunGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(120 90) scale(24)">
                  <stop offset="0%" stop-color="#fef08a"/>
                  <stop offset="70%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#ea580c"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
          <!-- Languages for Anglais Aventure -->
          <div v-else-if="currentCourse.title === 'Anglais Aventure'" class="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
            <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 40 C30 20, 110 20, 110 40 C110 60, 70 60, 50 75 C53 65, 30 60, 30 40 Z" fill="#34d399" opacity="0.8"/>
              <text x="70" y="45" fill="#064e3b" font-size="14" font-weight="bold" text-anchor="middle">Hello!</text>
              <path d="M210 110 C210 90, 130 90, 130 110 C130 130, 170 130, 190 145 C187 135, 210 130, 210 110 Z" fill="#38bdf8" opacity="0.8"/>
              <text x="170" y="115" fill="#0c4a6e" font-size="14" font-weight="bold" text-anchor="middle">Welcome!</text>
              <rect x="95" y="80" width="30" height="90" fill="#0f172a" opacity="0.15"/>
              <path d="M90 80 L110 50 L130 80 Z" fill="#0f172a" opacity="0.2"/>
            </svg>
          </div>
          <!-- Pyramids for Histoire Vivante -->
          <div v-else-if="currentCourse.title === 'Histoire Vivante'" class="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
            <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="170" cy="50" r="16" fill="#f97316" opacity="0.6"/>
              <path d="M20 150 L90 60 L160 150 Z" fill="#f59e0b" opacity="0.8"/>
              <path d="M90 60 L160 150 L130 150 Z" fill="#d97706" opacity="0.8"/>
              <path d="M120 150 L160 100 L200 150 Z" fill="#f59e0b" opacity="0.6"/>
              <path d="M160 100 L200 150 L180 150 Z" fill="#d97706" opacity="0.6"/>
              <line x1="10" y1="150" x2="230" y2="150" stroke="#b45309" stroke-width="4"/>
            </svg>
          </div>
          <!-- Code Editor for Code Créatif -->
          <div v-else-if="currentCourse.title === 'Code Créatif'" class="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
            <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="200" height="140" rx="8" fill="#1e293b" stroke="#475569" stroke-width="3"/>
              <rect x="20" y="20" width="200" height="24" rx="8" fill="#0f172a"/>
              <circle cx="34" cy="32" r="4" fill="#f43f5e"/>
              <circle cx="46" cy="32" r="4" fill="#eab308"/>
              <circle cx="58" cy="32" r="4" fill="#22c55e"/>
              <text x="35" y="65" fill="#a855f7" font-family="monospace" font-size="12" font-weight="bold">const</text>
              <text x="80" y="65" fill="#38bdf8" font-family="monospace" font-size="12">game</text>
              <text x="115" y="65" fill="#f43f5e" font-family="monospace" font-size="12">=</text>
              <text x="130" y="65" fill="#eab308" font-family="monospace" font-size="12">() =></text>
              <text x="170" y="65" fill="#fff" font-family="monospace" font-size="12">{</text>
              <text x="50" y="90" fill="#22c55e" font-family="monospace" font-size="12">score.value++</text>
              <text x="35" y="140" fill="#fff" font-family="monospace" font-size="12">}</text>
            </svg>
          </div>
          <!-- Palette for L'Art en Couleurs -->
          <div v-else class="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
            <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 90 C40 40, 190 30, 200 90 C210 140, 110 160, 70 140 C50 130, 30 110, 40 90 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="4"/>
              <circle cx="70" cy="65" r="12" fill="#f43f5e"/>
              <circle cx="110" cy="55" r="12" fill="#3b82f6"/>
              <circle cx="150" cy="65" r="12" fill="#22c55e"/>
              <circle cx="175" cy="95" r="12" fill="#eab308"/>
              <circle cx="75" cy="115" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Main Overview Content (Left: Chapters, Right: Progress & Certificate) -->
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Left Panel: Chapitres -->
        <div class="flex-[2] min-w-0">
          <h2 class="text-2xl font-extrabold text-edu-text-main mb-6">Chapitres</h2>
          
          <div class="flex flex-col gap-4">
            <!-- Chapter cards -->
            <div 
              v-for="(chapter, index) in currentCourse.chapters" 
              :key="chapter.id"
              @click="selectChapter(chapter.id)"
              class="bg-white rounded-3xl p-5 border border-gray-100/60 shadow-soft flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all duration-200"
            >
              <!-- Icon/Status badge (matches Image 1) -->
              <div class="flex-shrink-0">
                <!-- Completed: Green check circle -->
                <div v-if="chapter.completed" class="w-11 h-11 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100">
                  <CheckCircleIcon class="w-6 h-6" />
                </div>
                <!-- In progress: Blue/Indigo play circle -->
                <div v-else-if="getChapterStatus(chapter, index) === 'En cours'" class="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-100">
                  <PlayIcon class="w-5 h-5 ml-0.5" />
                </div>
                <!-- To do: Empty circle outline -->
                <div v-else class="w-11 h-11 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400">
                  <div class="w-2.5 h-2.5 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              <!-- Title & Meta info -->
              <div class="flex-1 min-w-0">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Chapitre {{ index + 1 }}</span>
                <h3 class="font-extrabold text-edu-text-main text-base mb-1 truncate">{{ chapter.title }}</h3>
                <div class="flex items-center gap-3 text-xs text-edu-text-muted font-medium">
                  <span class="flex items-center gap-1"><ClockIcon class="w-3.5 h-3.5 text-gray-400" /> {{ chapter.duration }}</span>
                  <span class="capitalize">{{ chapter.type }}</span>
                </div>
              </div>

              <!-- Status Text Badge -->
              <div class="flex-shrink-0 text-right">
                <span 
                  class="text-[11px] font-bold px-3 py-1.5 rounded-full inline-block"
                  :class="[
                    chapter.completed ? 'bg-emerald-100 text-emerald-700' : '',
                    getChapterStatus(chapter, index) === 'En cours' ? 'bg-indigo-100 text-indigo-700' : '',
                    getChapterStatus(chapter, index) === 'À faire' ? 'bg-gray-100 text-gray-500' : ''
                  ]"
                >
                  {{ getChapterStatus(chapter, index) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Ta progression & Récompense -->
        <div class="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-6">
          
          <!-- Progression card -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100/50 dark:border-gray-700/50 shadow-soft dark:shadow-gray-900/50">
            <h3 class="font-extrabold text-edu-text-main dark:text-white text-lg mb-4">{{ i18n.t('dashboard.progression') }}</h3>
            
            <div class="flex items-baseline gap-1 mb-3">
              <span class="text-4xl font-black text-edu-text-main">{{ progressPercentage }}</span>
              <span class="text-lg font-bold text-edu-text-muted">%</span>
            </div>

            <!-- Gradient Progress Bar -->
            <div class="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div class="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-indigo-600" 
                   :style="{ width: `${progressPercentage}%` }"></div>
            </div>

            <p class="text-xs text-edu-text-muted dark:text-gray-400 font-medium">
              {{ completedChaptersCount }} / {{ currentCourse.chapters.length }} {{ i18n.t('course.chaptersCompleted') }}
            </p>
          </div>

          <!-- Reward / Certificate card -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100/50 dark:border-gray-700/50 shadow-soft dark:shadow-gray-900/50">
            <h3 class="font-extrabold text-edu-text-main dark:text-white text-lg mb-4">{{ i18n.t('course.reward') }}</h3>
            
            <div class="bg-[#ffedd5] dark:bg-amber-900/30 rounded-2xl p-5 text-center flex flex-col items-center border border-amber-100/30 dark:border-amber-800/30">
              <div class="w-16 h-16 bg-amber-400 text-white rounded-full flex items-center justify-center mb-4 shadow-sm border-2 border-white">
                <TrophyIcon class="w-9 h-9" />
              </div>
              <h4 class="font-extrabold text-[#78350f] dark:text-amber-100 text-base mb-1">
                {{ isCourseFullyCompleted ? i18n.t('course.certificateUnlocked') : i18n.t('course.officialCert') }}
              </h4>
              <p class="text-xs text-amber-800/80 dark:text-amber-200/80 font-semibold leading-relaxed mb-4 max-w-[200px]">
                {{ isCourseFullyCompleted ? i18n.t('course.congratsSkills') : i18n.t('course.toUnlock') }}
              </p>
              
              <button 
                @click="goToCertificates"
                class="w-full bg-[#b45309] dark:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs hover:bg-[#92400e] dark:hover:bg-amber-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                :class="!isCourseFullyCompleted ? 'opacity-50 cursor-not-allowed' : ''"
                :disabled="!isCourseFullyCompleted"
              >
                <CheckBadgeIcon class="w-4 h-4" />
                <span>{{ isCourseFullyCompleted ? i18n.t('course.viewMyCert') : i18n.t('course.locked') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW MODE: LESSON (Chapters Sidebar + Content) -->
    <div class="max-w-7xl mx-auto px-6" v-else-if="viewMode === 'lesson'">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar chapter navigation (Left side) -->
        <div class="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100/50 dark:border-gray-700/50 shadow-soft dark:shadow-gray-900/50">
            <button @click="goBackToOverview" class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-edu-text-main dark:text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-6 shadow-sm">
              <ArrowLeftIcon class="w-3.5 h-3.5" /> {{ i18n.t('course.backToOverview') }}
            </button>
            
            <h4 class="font-black text-edu-text-main dark:text-white text-sm mb-2 truncate">{{ currentCourse.title }}</h4>
            
            <!-- Overall progress -->
            <div class="flex justify-between items-center text-xs font-bold text-edu-text-muted dark:text-gray-400 mb-2">
              <span>{{ i18n.t('dashboard.progression') }}</span>
              <span>{{ progressPercentage }}%</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div class="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500" :style="{ width: `${progressPercentage}%` }"></div>
            </div>

            <!-- Chapter buttons list -->
            <div class="flex flex-col gap-2">
              <button 
                v-for="(chapter, index) in currentCourse.chapters" 
                :key="chapter.id"
                @click="courseStore.setActiveChapter(chapter.id)"
                class="w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all duration-200 flex items-start gap-3 focus:outline-none"
                :class="[
                  activeChapter?.id === chapter.id 
                    ? 'border-indigo-500 bg-indigo-50/50 text-[#4f46e5]' 
                    : 'border-transparent bg-transparent text-edu-text-muted hover:bg-gray-50 hover:text-edu-text-main'
                ]"
              >
                <!-- Status icon inside sidebar -->
                <span class="flex-shrink-0 mt-0.5">
                  <CheckCircleIcon class="w-4 h-4 text-emerald-500" v-if="chapter.completed" />
                  <PlayIcon class="w-4 h-4 text-indigo-500" v-else-if="activeChapter?.id === chapter.id" />
                  <div class="w-4 h-4 rounded-full border border-gray-400" v-else></div>
                </span>
                <span class="flex-1 truncate">
                  {{ index + 1 }}. {{ chapter.title }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Panel (Right side) -->
        <div class="flex-1 min-w-0">
          <div class="bg-transparent" v-if="activeChapter">
            <Transition name="fade" mode="out-in">
              <div :key="activeChapter.id" class="w-full">
                <!-- If Quiz type chapter -->
                <QuizViewer 
                  v-if="activeChapter.type === 'quiz'" 
                  :chapterId="activeChapter.id"
                  @exit-quiz="goBackToOverview"
                  @quiz-completed="(score) => {
                    if (score >= 50) {
                      // Optional: handle quiz success
                    }
                  }"
                />
                <!-- Video / Text chapters -->
                <ChapterContent 
                  v-else 
                  :chapter="activeChapter"
                  @lesson-completed="handleLessonCompleted"
                />
              </div>
            </Transition>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
