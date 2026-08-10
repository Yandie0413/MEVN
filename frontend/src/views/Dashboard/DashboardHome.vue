<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import {
  MagnifyingGlassIcon,
  FireIcon,
  SparklesIcon, 
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  PlayIcon,
  BuildingLibraryIcon,
  CalculatorIcon,
  LanguageIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/vue/24/solid';
import { computeBadges } from '@/utils/badges';

const router = useRouter();
const courseStore = useCourseStore();
const authStore = useAuthStore();
const i18n = useI18nStore();

// Slice first 4 courses for the grid
const activeCourses = computed(() => {
  return courseStore.courses.slice(0, 4);
});

const searchTerm = ref('');
function submitSearch() {
  if (!searchTerm.value.trim()) return;
  router.push({ path: '/dashboard/mes-cours', query: { q: searchTerm.value.trim() } });
}

function getCourseIcon(title: string) {
  switch (title) {
    case 'Maths Magiques': return CalculatorIcon;
    case "L'Univers Fascinant": return RocketLaunchIcon;
    case 'Anglais Aventure': return LanguageIcon;
    case 'Histoire Vivante': return BuildingLibraryIcon;
    default: return BookOpenIcon;
  }
}

function startCourse(courseId: string) {
  courseStore.setCourseActive(courseId);
  router.push(`/course/${courseId}`);
}

const stats = computed(() => {
  let quizCount = 0;
  courseStore.courses.forEach(c => {
    c.chapters.forEach(ch => {
      if (ch.type === 'quiz' && ch.completed) {
        quizCount++;
      }
    });
  });

  return [
    { value: authStore.stats.coursesFollowed, label: i18n.t('dashboard.coursesFollowed'), icon: BookOpenIcon, bg: 'bg-edu-green', color: 'text-green-600' },
    { value: quizCount, label: i18n.t('dashboard.quizzesCompleted'), icon: TrophyIcon, bg: 'bg-edu-orange', color: 'text-orange-500' },
    { value: authStore.stats.certificatesCount, label: i18n.t('dashboard.certificatesCount'), icon: CheckBadgeIcon, bg: 'bg-edu-rose', color: 'text-rose-500' },
    { value: authStore.level, label: i18n.t('dashboard.level'), icon: AcademicCapIcon, bg: 'bg-edu-lavender', color: 'text-purple-600' }
  ];
});

const badges = computed(() => computeBadges(courseStore.courses, authStore.stats, authStore.level, {
  firstStep: i18n.t('dashboard.badgeFirstStep'), firstStepDesc: i18n.isFrench ? 'Termine ton premier chapitre' : 'Complete your first chapter',
  marathon: i18n.t('dashboard.badgeMarathon'), marathonDesc: i18n.isFrench ? '7 jours d\'affilée' : '7 days in a row',
  quizMaster: i18n.t('dashboard.badgeQuizMaster'), quizMasterDesc: i18n.isFrench ? '3 quiz réussis' : '3 quizzes passed',
  polyglot: i18n.t('dashboard.badgePolyglot'), polyglotDesc: i18n.isFrench ? 'Termine un cours de langue' : 'Complete a language course',
  scientist: i18n.t('dashboard.badgeScientist'), scientistDesc: i18n.isFrench ? 'Termine un cours de sciences' : 'Complete a science course',
  legend: i18n.t('dashboard.badgeLegend'), legendDesc: i18n.isFrench ? 'Atteins le niveau 5' : 'Reach level 5'
}));

// Activité dérivée de la progression réelle (pas de log d'événements dédié côté backend)
const recentActivity = computed(() => {
  return courseStore.courses
    .filter(c => c.progress > 0)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4)
    .map(c => ({
      id: c.id,
      title: c.title,
      completed: c.progress === 100,
      progress: c.progress
    }));
});
</script>

<template>
  <div class="flex flex-col">

    <!-- Top Bar -->
    <header class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <div class="w-full sm:w-[450px] bg-white dark:bg-gray-800 h-12 rounded-full flex items-center px-5 shadow-soft">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
        <input v-model="searchTerm" @keyup.enter="submitSearch" type="text" :placeholder="i18n.t('dashboard.search')" class="bg-transparent border-none outline-none text-sm w-full text-edu-text-main dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium" />
      </div>
      <div class="flex items-center gap-4">
        <div class="h-12 bg-white dark:bg-gray-800 rounded-full flex items-center px-5 shadow-soft gap-2 font-bold text-sm text-edu-text-main dark:text-white flex-shrink-0">
          <FireIcon class="w-5 h-5 text-orange-500" />
          <span>{{ authStore.stats.streakDays }} <span class="text-gray-400 dark:text-gray-500 font-medium">{{ i18n.t('dashboard.streak') }}</span></span>
        </div>
      </div>
    </header>

    <!-- Hero Banner -->
    <div class="bg-white dark:bg-gray-800 rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-soft mb-8 border border-gray-100/50 dark:border-gray-700/50">
      <div class="z-10 max-w-xl">
        <div class="inline-flex items-center gap-2 bg-edu-lavender dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[11px] font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide">
          <SparklesIcon class="w-4 h-4" />
          {{ i18n.t('dashboard.hello') }} {{ authStore.user?.name }} !
        </div>
        <h1 class="text-3xl md:text-[40px] font-extrabold text-edu-text-main dark:text-white leading-[1.1] mb-5 tracking-tight">
          {{ i18n.t('dashboard.readyToLearn') }} <br/> {{ i18n.t('dashboard.somethingAwesome') }} <span class="text-purple-600 dark:text-purple-400">{{ i18n.t('dashboard.awesome') }}</span> <br/> {{ i18n.t('dashboard.today') }}
        </h1>
        <p class="text-edu-text-muted dark:text-gray-400 text-sm mb-8">
          {{ i18n.t('dashboard.earnedXP') }} <strong class="text-edu-text-main dark:text-white font-bold">{{ authStore.stats.totalXp }} XP</strong> {{ i18n.t('dashboard.xpThisSeason') }}
        </p>
        <div class="flex items-center gap-4">
          <button @click="router.push('/dashboard/mes-cours')" class="bg-edu-lime dark:bg-lime-400 text-edu-navy dark:text-edu-navy font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 hover:bg-[#c5e64d] dark:hover:bg-lime-300 transition-all duration-200 hover:scale-[1.02] shadow-sm">
            <BookOpenIcon class="w-5 h-5" /> {{ i18n.t('dashboard.exploreCourses') }}
          </button>
          <button v-if="activeCourses[0]" @click="startCourse(activeCourses[0].id)" class="bg-white dark:bg-gray-700 text-edu-text-main dark:text-white border border-gray-200 dark:border-gray-600 font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-[1.02] shadow-sm">
            <PlayIcon class="w-5 h-5" /> {{ i18n.t('dashboard.resumeCourse') }} « {{ activeCourses[0].title }} »
          </button>
        </div>
      </div>
      <div class="hidden md:flex absolute right-0 top-0 bottom-0 w-[40%] items-center justify-end">
        <div class="relative w-full h-full">
          <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] scale-150 transform translate-x-12">
            <AcademicCapIcon class="w-full h-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-soft dark:shadow-gray-900/50 flex flex-col">
        <div class="w-12 h-12 rounded-full flex items-center justify-center mb-5" :class="[stat.bg, stat.color]">
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
        <span class="text-3xl font-extrabold text-edu-text-main dark:text-white mb-1">{{ stat.value }}</span>
        <span class="text-xs text-edu-text-muted dark:text-gray-400 font-medium">{{ stat.label }}</span>
      </div>
    </div>

    <!-- Bottom Layout -->
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Courses Grid -->
      <div class="flex-[2] flex flex-col min-w-0">
        <div class="flex justify-between items-end mb-6 px-1">
          <div>
            <h2 class="text-2xl font-extrabold text-edu-text-main dark:text-white mb-1">{{ i18n.t('dashboard.continueWhere') }}</h2>
            <p class="text-sm text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Reprends là où tu t\'es arrêté(e)' : 'Pick up where you left off' }}</p>
          </div>
          <RouterLink to="/dashboard/mes-cours" class="text-sm font-semibold text-edu-navy dark:text-edu-lime hover:text-purple-600 dark:hover:text-lime-400 transition-colors no-underline">{{ i18n.t('mescours.seeAll') }}</RouterLink>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
          <!-- Cards -->
          <div 
            v-for="course in activeCourses" 
            :key="course.id" 
            class="bg-white dark:bg-gray-800 rounded-[24px] p-5 shadow-soft dark:shadow-gray-900/50 flex flex-col cursor-pointer hover:shadow-md transition-all"
            @click="startCourse(course.id)"
          >
            <div class="h-36 rounded-2xl mb-5 relative overflow-hidden flex items-center justify-center" :class="course.bgColor">
              <span class="absolute top-4 left-4 bg-white/90 dark:bg-gray-700/90 text-edu-text-main dark:text-white text-[10px] font-bold px-3 py-1.5 rounded-full">{{ course.category }}</span>
              <div class="absolute right-4 bottom-4 w-16 h-12 rounded-xl flex items-center justify-center opacity-80 shadow-sm" :style="{ backgroundColor: course.iconColor }">
                <component :is="getCourseIcon(course.title)" class="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 class="font-bold text-edu-text-main dark:text-white text-base mb-1">{{ course.title }}</h3>
            <p class="text-[11px] text-edu-text-muted dark:text-gray-400 leading-relaxed mb-5 line-clamp-2">{{ course.description }}</p>
            <div class="flex items-center gap-3 text-[11px] text-edu-text-muted dark:text-gray-400 font-medium mb-5">
              <span class="flex items-center text-yellow-500 gap-1"><StarIcon class="w-3 h-3" /> {{ course.rating }}</span>
              <span class="flex items-center gap-1"><UserGroupIcon class="w-3 h-3"/> {{ course.students }}</span>
            </div>
            <div class="flex justify-between text-[11px] font-bold text-edu-text-muted dark:text-gray-400 mb-2">
              <span>{{ i18n.t('dashboard.progression') }}</span>
              <span class="text-edu-text-main dark:text-white">{{ course.progress }}%</span>
            </div>
            <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-5">
              <div class="h-full bg-edu-lime rounded-full" :style="{ width: `${course.progress}%` }"></div>
            </div>
            <div class="flex justify-between items-center mt-auto">
              <span class="text-[11px] text-edu-text-muted dark:text-gray-400 font-medium">{{ course.chapters.length }} {{ i18n.t('dashboard.chapters') }}</span>
              <button class="bg-edu-lime dark:bg-lime-400 text-edu-navy dark:text-edu-navy text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-[#c5e64d] dark:hover:bg-lime-300 transition-colors">
                <PlayIcon class="w-3 h-3" /> {{ i18n.t('dashboard.continue') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panels -->
      <div class="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-8 pb-4">
        
        <!-- Badges -->
        <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-extrabold text-edu-text-main dark:text-white">{{ i18n.t('dashboard.badges') }}</h2>
            <RouterLink to="/dashboard/profil" class="text-[11px] font-semibold text-edu-navy dark:text-edu-lime hover:text-purple-600 dark:hover:text-lime-400 no-underline">{{ i18n.t('dashboard.seeAll') }}</RouterLink>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="badge in badges"
              :key="badge.id"
              class="flex flex-col items-center p-3 rounded-2xl transition-colors"
              :class="badge.unlocked ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700/50 opacity-50 grayscale'"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm"
                :style="{ background: badge.bg, color: badge.color }"
              >
                <component :is="badge.icon" class="w-5 h-5" />
              </div>
              <span class="text-[9px] font-bold text-edu-text-main dark:text-white text-center">{{ badge.label }}</span>
            </div>
          </div>
        </div>

        <!-- Activité récente -->
        <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50">
          <h2 class="font-extrabold text-edu-text-main dark:text-white mb-6">{{ i18n.t('dashboard.recentActivity') }}</h2>
          <div v-if="recentActivity.length > 0" class="flex flex-col gap-6">
            <div v-for="item in recentActivity" :key="item.id" class="flex items-start gap-4">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                :class="item.completed ? 'bg-edu-rose dark:bg-rose-900/50 text-rose-500 dark:text-rose-400' : 'bg-edu-green dark:bg-emerald-900/50 text-green-600 dark:text-emerald-400'"
              >
                <component :is="item.completed ? CheckBadgeIcon : CheckCircleIcon" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs font-bold text-edu-text-main dark:text-white mb-1">{{ item.title }}</p>
                <p class="text-[10px] text-edu-text-muted dark:text-gray-400 font-medium">
                  {{ item.completed ? (i18n.isFrench ? 'Cours terminé' : 'Course completed') : `${item.progress}% ${i18n.isFrench ? 'terminé' : 'complete'}` }}
                </p>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-edu-text-muted dark:text-gray-400 text-center py-6">
            {{ i18n.isFrench ? 'Commence un cours pour voir ton activité ici.' : 'Start a course to see your activity here.' }}
          </p>
        </div>

      </div>
    </div>

</div>
</template>
