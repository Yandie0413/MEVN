<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore';
import { useI18nStore } from '@/stores/i18nStore';
import {
  MagnifyingGlassIcon,
  BellIcon,
  FireIcon,
  TrophyIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  StarIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  CalculatorIcon,
  LanguageIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  ComputerDesktopIcon,
  PaintBrushIcon,
  BookOpenIcon
} from '@heroicons/vue/24/solid';

const router = useRouter();
const courseStore = useCourseStore();
const i18n = useI18nStore();

function getCourseIcon(title: string) {
  switch (title) {
    case 'Maths Magiques': return CalculatorIcon;
    case 'L\'Univers Fascinant': return RocketLaunchIcon;
    case 'Anglais Aventure': return LanguageIcon;
    case 'Histoire Vivante': return BuildingLibraryIcon;
    case 'Code Créatif': return ComputerDesktopIcon;
    case 'L\'Art en Couleurs': return PaintBrushIcon;
    default: return BookOpenIcon;
  }
}

function getCourseGradient(title: string) {
  switch (title) {
    case 'Maths Magiques': return 'linear-gradient(135deg, #c4b5fd 0%, #e0d6ff 100%)';
    case 'L\'Univers Fascinant': return 'linear-gradient(135deg, #7dd3fc 0%, #e0f2fe 100%)';
    case 'Anglais Aventure': return 'linear-gradient(135deg, #5eead4 0%, #a5f3fc 100%)';
    case 'Histoire Vivante': return 'linear-gradient(135deg, #fed7aa 0%, #ffedd5 100%)';
    case 'Code Créatif': return 'linear-gradient(135deg, #fde047 0%, #fef9c3 100%)';
    case 'L\'Art en Couleurs': return 'linear-gradient(135deg, #fca5a5 0%, #fee2e2 100%)';
    default: return 'linear-gradient(135deg, #c4b5fd 0%, #e0d6ff 100%)';
  }
}

function getCourseIconColor(title: string) {
  switch (title) {
    case 'Maths Magiques': return '#7c3aed';
    case 'L\'Univers Fascinant': return '#0284c7';
    case 'Anglais Aventure': return '#0f766e';
    case 'Histoire Vivante': return '#ea580c';
    case 'Code Créatif': return '#ca8a04';
    case 'L\'Art en Couleurs': return '#e11d48';
    default: return '#4f46e5';
  }
}

// Generate certificate object for any course that has 100% progress
const certificates = computed(() => {
  const completed = courseStore.courses.filter(c => c.progress === 100);
  
  // If no courses are fully completed, we show a default mocked one (Anglais Aventure - Niveau 1)
  // to prevent the screen from being completely empty initially, but add Maths Magiques once completed!
  const list = completed.map(c => ({
    id: c.id,
    course: `« ${c.title} »`,
    gradient: getCourseGradient(c.title),
    icon: getCourseIcon(c.title),
    iconColor: getCourseIconColor(c.title),
    score: 95, // Default score
    date: 'Aujourd\'hui',
    showAbbr: false,
    abbr: null
  }));

  if (list.length === 0) {
    // Return mock initial certificates to match user visual state
    return [
      {
        id: 'mock-1',
        course: '« Anglais Aventure - Niveau 1 »',
        gradient: 'linear-gradient(135deg, #5eead4 0%, #a5f3fc 100%)',
        icon: LanguageIcon,
        iconColor: '#0f766e',
        score: 95,
        date: '12 mars 2026',
        showAbbr: true,
        abbr: 'GB',
      },
      {
        id: 'mock-2',
        course: '« L\'Univers Fascinant - Chapitre 1 »',
        gradient: 'linear-gradient(135deg, #7dd3fc 0%, #e0f2fe 100%)',
        icon: RocketLaunchIcon,
        iconColor: '#0284c7',
        score: 91,
        date: '5 décembre 2025',
        showAbbr: false,
        abbr: null,
      }
    ];
  }
  
  return list;
});

// Find the course with progress > 0 and < 100 that is closest to completion
const nextCert = computed(() => {
  const activeUncompleted = courseStore.courses
    .filter(c => c.progress > 0 && c.progress < 100)
    .sort((a, b) => b.progress - a.progress); // Highest progress first
  
  if (activeUncompleted.length > 0) {
    return {
      id: activeUncompleted[0].id,
      course: activeUncompleted[0].title,
      progress: activeUncompleted[0].progress
    };
  }
  
  // Fallback
  return {
    id: '1',
    course: 'Maths Magiques',
    progress: 68
  };
});

function continueNextCourse() {
  courseStore.setCourseActive(nextCert.value.id);
  router.push(`/course/${nextCert.value.id}`);
}

function handleAction(message: string) {
  console.log(message);
}

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

    <!-- Page Title -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-1">
        <h1 class="text-3xl font-extrabold text-edu-text-main dark:text-white">{{ i18n.t('certificates.title') }}</h1>
        <div class="w-9 h-9 bg-edu-orange dark:bg-orange-900/50 rounded-full flex items-center justify-center">
          <TrophyIcon class="w-5 h-5 text-orange-500" />
        </div>
      </div>
      <p class="text-edu-text-muted dark:text-gray-400 text-sm font-medium">{{ i18n.t('certificates.achievements') }}</p>
    </div>

    <!-- Certificates Grid -->
    <div class="grid grid-cols-2 gap-6 pb-10">

      <!-- Certificate Cards -->
      <div
        v-for="cert in certificates"
        :key="cert.id"
        class="bg-white dark:bg-gray-800 rounded-[28px] overflow-hidden shadow-soft dark:shadow-gray-900/50 flex flex-col justify-between"
      >
        <!-- Card Banner -->
        <div
          class="relative p-8 flex flex-col items-center text-center flex-1"
          :style="{ background: cert.gradient }"
        >
          <!-- Corner stars using Heroicons -->
          <StarIcon class="absolute top-4 left-4 w-6 h-6 text-yellow-400 opacity-80" />
          <StarIcon class="absolute top-4 right-4 w-6 h-6 text-yellow-400 opacity-80" />
          <StarIcon class="absolute bottom-4 left-4 w-6 h-6 text-yellow-400 opacity-80" />
          <StarIcon class="absolute bottom-4 right-4 w-6 h-6 text-yellow-400 opacity-80" />

          <!-- Icon or Abbreviation -->
          <div v-if="cert.showAbbr" class="mb-4">
            <span class="text-5xl font-black" style="color: rgba(255,255,255,0.8)">{{ cert.abbr }}</span>
          </div>
          <div v-else class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background: rgba(255,255,255,0.35)">
            <component :is="cert.icon" class="w-9 h-9" :style="{ color: cert.iconColor }" />
          </div>

          <!-- Certificate text -->
          <p class="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style="color: rgba(255,255,255,0.75)">
            {{ i18n.t('certificates.completedOn').includes('Terminé') ? 'Certificat d\'accomplissement' : 'Certificate of Achievement' }}
          </p>
          <div class="w-12 border-t mb-4" style="border-color: rgba(255,255,255,0.4)"></div>

          <p class="text-xs font-medium mb-1" style="color: rgba(255,255,255,0.8)">{{ i18n.isFrench ? 'Décerné à' : 'Awarded to' }}</p>
          <h2 class="text-xl font-extrabold text-white mb-2">Léa Martin</h2>
          <p class="text-xs font-medium mb-2" style="color: rgba(255,255,255,0.8)">{{ i18n.isFrench ? 'pour avoir terminé' : 'for completing' }}</p>
          <p class="text-sm font-extrabold text-white mb-5">{{ cert.course }}</p>

          <!-- Score badge -->
          <div class="bg-white/90 dark:bg-white/90 rounded-full px-5 py-2 flex items-center gap-2 mb-4 shadow-sm">
            <CheckBadgeIcon class="w-4 h-4 text-edu-navy" />
            <span class="text-xs font-bold text-edu-navy">Score : {{ cert.score }}%</span>
          </div>

          <p class="text-[10px] font-medium" style="color: rgba(255,255,255,0.65)">{{ i18n.isFrench ? 'Délivré le' : 'Issued on' }} {{ cert.date }}</p>
        </div>

        <!-- Card Actions -->
        <div class="flex items-center gap-3 p-4">
          <button @click="handleAction(i18n.t('certificates.download') + '...')" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm">
            <ArrowDownTrayIcon class="w-4 h-4" />
            {{ i18n.t('certificates.download') }}
          </button>
          <button @click="handleAction(i18n.t('certificates.share') + '...')" class="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-colors text-edu-text-muted dark:text-gray-400 hover:text-edu-navy dark:hover:text-edu-lime">
            <ShareIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Next Certificate CTA -->
      <div class="bg-white dark:bg-gray-800 rounded-[28px] shadow-soft dark:shadow-gray-900/50 flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div class="w-16 h-16 bg-edu-orange dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-5 shadow-soft">
          <AcademicCapIcon class="w-8 h-8 text-orange-500" />
        </div>
        <h3 class="text-base font-extrabold text-edu-text-main dark:text-white mb-2">{{ i18n.t('certificates.nextCertificate') }}</h3>
        <p class="text-sm text-edu-text-muted dark:text-gray-400 mb-6 leading-relaxed">
          {{ i18n.isFrench ? 'Continue' : 'Continue' }} <strong class="text-edu-text-main dark:text-white font-bold">{{ nextCert.course }}</strong><br/>
          {{ i18n.t('certificates.toUnlock') }} !
        </p>
        <div class="w-full mb-2">
          <div class="flex justify-between text-[11px] font-bold text-edu-text-muted dark:text-gray-400 mb-2">
            <span>{{ i18n.t('certificates.progress') }}</span>
            <span class="text-edu-text-main dark:text-white">{{ nextCert.progress }}%</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              class="h-full bg-edu-lime dark:bg-lime-400 rounded-full transition-all duration-500"
              :style="{ width: `${nextCert.progress}%` }"
            ></div>
          </div>
        </div>
        <button @click="continueNextCourse" class="mt-6 bg-edu-lime dark:bg-lime-400 text-edu-navy dark:text-edu-navy font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#c5e64d] dark:hover:bg-lime-300 transition-colors shadow-sm">
          <RocketLaunchIcon class="w-4 h-4" />
          {{ i18n.t('certificates.continueCourse') }}
        </button>
      </div>

    </div>
  </div>
</template>
