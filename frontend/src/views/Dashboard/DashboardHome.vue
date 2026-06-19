<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore';
import { useI18nStore } from '@/stores/i18nStore';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  FireIcon, 
  SparklesIcon, 
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  PlayIcon,
  BuildingLibraryIcon,
  CalculatorIcon,
  LanguageIcon,
  LightBulbIcon,
  BeakerIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/vue/24/solid';

const router = useRouter();
const courseStore = useCourseStore();
const i18n = useI18nStore();

// Slice first 4 courses for the grid
const activeCourses = computed(() => {
  return courseStore.courses.slice(0, 4);
});

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
  const suivis = courseStore.courses.filter(c => c.progress > 0).length;
  const completedCertificates = courseStore.courses.filter(c => c.progress === 100).length;
  
  let quizCount = 0;
  courseStore.courses.forEach(c => {
    c.chapters.forEach(ch => {
      if (ch.type === 'quiz' && ch.completed) {
        quizCount++;
      }
    });
  });
  
  return [
    { value: suivis, label: i18n.t('dashboard.coursesFollowed'), icon: BookOpenIcon, bg: 'bg-edu-green', color: i18n.isFrench ? 'text-green-600' : 'text-green-600' },
    { value: quizCount || 2, label: i18n.t('dashboard.quizzesCompleted'), icon: TrophyIcon, bg: 'bg-edu-orange', color: i18n.isFrench ? 'text-orange-500' : 'text-orange-500' },
    { value: completedCertificates || 2, label: i18n.t('dashboard.certificatesCount'), icon: CheckBadgeIcon, bg: 'bg-edu-rose', color: i18n.isFrench ? 'text-rose-500' : 'text-rose-500' },
    { value: 12, label: i18n.t('dashboard.level'), icon: AcademicCapIcon, bg: 'bg-edu-lavender', color: i18n.isFrench ? 'text-purple-600' : 'text-purple-600' }
  ];
});
</script>

<template>
  <div class="flex flex-col">

    <!-- Top Bar -->
    <header class="flex justify-between items-center mb-8">
      <div class="w-[450px] bg-white dark:bg-gray-800 h-12 rounded-full flex items-center px-5 shadow-soft">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
        <input type="text" :placeholder="i18n.t('dashboard.search')" class="bg-transparent border-none outline-none text-sm w-full text-edu-text-main dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium" />
      </div>
      <div class="flex items-center gap-4">
        <button class="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-soft text-gray-500 dark:text-gray-400 hover:text-edu-navy dark:hover:text-edu-lime transition-colors">
          <BellIcon class="w-5 h-5" />
        </button>
        <div class="h-12 bg-white dark:bg-gray-800 rounded-full flex items-center px-5 shadow-soft gap-2 font-bold text-sm text-edu-text-main dark:text-white">
          <FireIcon class="w-5 h-5 text-orange-500" />
          <span>7 <span class="text-gray-400 dark:text-gray-500 font-medium">{{ i18n.t('dashboard.streak') }}</span></span>
        </div>
      </div>
    </header>

    <!-- Hero Banner -->
    <div class="bg-white dark:bg-gray-800 rounded-[32px] p-10 flex justify-between items-center relative overflow-hidden shadow-soft mb-8 border border-gray-100/50 dark:border-gray-700/50">
      <div class="z-10 max-w-xl">
        <div class="inline-flex items-center gap-2 bg-edu-lavender dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[11px] font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide">
          <SparklesIcon class="w-4 h-4" />
          {{ i18n.t('dashboard.hello') }} Léa !
        </div>
        <h1 class="text-[40px] font-extrabold text-edu-text-main dark:text-white leading-[1.1] mb-5 tracking-tight">
          {{ i18n.t('dashboard.readyToLearn') }} <br/> {{ i18n.t('dashboard.somethingAwesome') }} <span class="text-purple-600 dark:text-purple-400">{{ i18n.t('dashboard.awesome') }}</span> <br/> {{ i18n.t('dashboard.today') }}
        </h1>
        <p class="text-edu-text-muted dark:text-gray-400 text-sm mb-8">
          {{ i18n.t('dashboard.earnedXP') }} <strong class="text-edu-text-main dark:text-white font-bold">2840 XP</strong> {{ i18n.t('dashboard.xpThisSeason') }}
        </p>
        <div class="flex items-center gap-4">
          <button @click="router.push('/dashboard/mes-cours')" class="bg-edu-lime dark:bg-lime-400 text-edu-navy dark:text-edu-navy font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 hover:bg-[#c5e64d] dark:hover:bg-lime-300 transition-all duration-200 hover:scale-[1.02] shadow-sm">
            <BookOpenIcon class="w-5 h-5" /> {{ i18n.t('dashboard.exploreCourses') }}
          </button>
          <button @click="startCourse('1')" class="bg-white dark:bg-gray-700 text-edu-text-main dark:text-white border border-gray-200 dark:border-gray-600 font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-[1.02] shadow-sm">
            <PlayIcon class="w-5 h-5" /> {{ i18n.t('dashboard.resumeCourse') }} « Maths Magiques »
          </button>
        </div>
      </div>
      <div class="absolute right-0 top-0 bottom-0 w-[40%] flex items-center justify-end">
        <div class="relative w-full h-full">
          <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] scale-150 transform translate-x-12">
            <AcademicCapIcon class="w-full h-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-soft dark:shadow-gray-900/50 flex flex-col">
        <div class="w-12 h-12 rounded-full flex items-center justify-center mb-5" :class="[stat.bg, stat.color]">
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
        <span class="text-3xl font-extrabold text-edu-text-main dark:text-white mb-1">{{ stat.value }}</span>
        <span class="text-xs text-edu-text-muted dark:text-gray-400 font-medium">{{ stat.label }}</span>
      </div>
    </div>

    <!-- Bottom Layout -->
    <div class="flex gap-8">
      <!-- Courses Grid -->
      <div class="flex-[2] flex flex-col min-w-0">
        <div class="flex justify-between items-end mb-6 px-1">
          <div>
            <h2 class="text-2xl font-extrabold text-edu-text-main dark:text-white mb-1">{{ i18n.t('dashboard.continueWhere') }}</h2>
            <p class="text-sm text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Reprends là où tu t\'es arrêté(e)' : 'Pick up where you left off' }}</p>
          </div>
          <RouterLink to="/dashboard/mes-cours" class="text-sm font-semibold text-edu-navy dark:text-edu-lime hover:text-purple-600 dark:hover:text-lime-400 transition-colors no-underline">{{ i18n.t('mescours.seeAll') }}</RouterLink>
        </div>
        
        <div class="grid grid-cols-2 gap-6 pb-4">
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
      <div class="w-[320px] flex-shrink-0 flex flex-col gap-8 pb-4">
        
        <!-- Badges -->
        <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-extrabold text-edu-text-main dark:text-white">{{ i18n.t('dashboard.badges') }}</h2>
            <RouterLink to="/dashboard/profil" class="text-[11px] font-semibold text-edu-navy dark:text-edu-lime hover:text-purple-600 dark:hover:text-lime-400 no-underline">{{ i18n.t('dashboard.seeAll') }}</RouterLink>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 hover:bg-edu-green dark:hover:bg-emerald-900/30 transition-colors p-3 rounded-2xl">
              <div class="w-10 h-10 bg-edu-green dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <RocketLaunchIcon class="w-5 h-5" />
              </div>
              <span class="text-[9px] font-bold text-edu-text-main dark:text-white text-center">{{ i18n.t('dashboard.badgeFirstStep') }}</span>
            </div>
            <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 hover:bg-edu-orange dark:hover:bg-orange-900/30 transition-colors p-3 rounded-2xl">
              <div class="w-10 h-10 bg-edu-orange dark:bg-orange-900/50 text-orange-500 dark:text-orange-400 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <FireIcon class="w-5 h-5" />
              </div>
              <span class="text-[9px] font-bold text-edu-text-main dark:text-white text-center">{{ i18n.t('dashboard.badgeMarathon') }}</span>
            </div>
            <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 hover:bg-edu-lavender dark:hover:bg-purple-900/30 transition-colors p-3 rounded-2xl">
              <div class="w-10 h-10 bg-edu-lavender dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <LightBulbIcon class="w-5 h-5" />
              </div>
              <span class="text-[9px] font-bold text-edu-text-main dark:text-white text-center">{{ i18n.t('dashboard.badgeQuizMaster') }}</span>
            </div>
            <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 hover:bg-edu-sky dark:hover:bg-sky-900/30 transition-colors p-3 rounded-2xl">
              <div class="w-10 h-10 bg-edu-sky dark:bg-sky-900/50 text-sky-500 dark:text-sky-400 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <GlobeAltIcon class="w-5 h-5" />
              </div>
              <span class="text-[9px] font-bold text-edu-text-main dark:text-white text-center">{{ i18n.t('dashboard.badgePolyglot') }}</span>
            </div>
            <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl opacity-50 grayscale">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center mb-2">
                <BeakerIcon class="w-5 h-5" />
              </div>
              <span class="text-[9px] font-bold text-edu-text-main dark:text-white text-center">{{ i18n.t('dashboard.badgeScientist') }}</span>
            </div>
            <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl opacity-50 grayscale">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center mb-2">
                <TrophyIcon class="w-5 h-5" />
              </div>
              <span class="text-[9px] font-bold text-edu-text-main dark:text-white text-center">{{ i18n.t('dashboard.badgeLegend') }}</span>
            </div>
          </div>
        </div>

        <!-- Activité récente -->
        <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50">
          <h2 class="font-extrabold text-edu-text-main dark:text-white mb-6">{{ i18n.t('dashboard.recentActivity') }}</h2>
          <div class="flex flex-col gap-6">
            <div class="flex items-start gap-4">
              <div class="w-9 h-9 bg-edu-green dark:bg-emerald-900/50 text-green-600 dark:text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xs font-bold text-edu-text-main dark:text-white mb-1">{{ i18n.t('dashboard.chapterCompleted') }} : Géométrie en f...</p>
                <p class="text-[10px] text-edu-text-muted dark:text-gray-400 font-medium">Maths Magiques · il y a 2 h</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-9 h-9 bg-edu-orange dark:bg-orange-900/50 text-orange-500 dark:text-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                <TrophyIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs font-bold text-edu-text-main dark:text-white mb-1">{{ i18n.t('dashboard.badgeUnlocked') }} : Marathonien</p>
                <p class="text-[10px] text-edu-text-muted dark:text-gray-400 font-medium">{{ i18n.t('dashboard.reward') }} · hier</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-9 h-9 bg-edu-rose dark:bg-rose-900/50 text-rose-500 dark:text-rose-400 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckBadgeIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs font-bold text-edu-text-main dark:text-white mb-1">{{ i18n.t('dashboard.quizPassed') }} avec 95%</p>
                <p class="text-[10px] text-edu-text-muted dark:text-gray-400 font-medium">Anglais Aventure · hier</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-9 h-9 bg-edu-sky dark:bg-sky-900/50 text-sky-500 dark:text-sky-400 rounded-full flex items-center justify-center flex-shrink-0">
                <RocketLaunchIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs font-bold text-edu-text-main dark:text-white mb-1">{{ i18n.t('dashboard.newCourseStarted') }}</p>
                <p class="text-[10px] text-edu-text-muted dark:text-gray-400 font-medium">Code Créatif · il y a 3 j</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

</div>
</template>
