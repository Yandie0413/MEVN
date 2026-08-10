<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import { computeBadges } from '@/utils/badges';
import {
  MagnifyingGlassIcon,
  FireIcon,
  TrophyIcon,
  CheckBadgeIcon,
  BookOpenIcon,
  UserIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CalculatorIcon,
  LanguageIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  ComputerDesktopIcon,
  PaintBrushIcon,
} from '@heroicons/vue/24/solid';

const router = useRouter();
const courseStore = useCourseStore();
const authStore = useAuthStore();
const i18n = useI18nStore();

const searchTerm = ref('');
function submitSearch() {
  if (!searchTerm.value.trim()) return;
  router.push({ path: '/dashboard/mes-cours', query: { q: searchTerm.value.trim() } });
}

const badges = computed(() => computeBadges(courseStore.courses, authStore.stats, authStore.level, {
  firstStep: i18n.t('dashboard.badgeFirstStep'), firstStepDesc: i18n.isFrench ? 'Termine ton premier chapitre' : 'Complete your first chapter',
  marathon: i18n.t('dashboard.badgeMarathon'), marathonDesc: i18n.isFrench ? '7 jours d\'affilée' : '7 days in a row',
  quizMaster: i18n.t('dashboard.badgeQuizMaster'), quizMasterDesc: i18n.isFrench ? '3 quiz réussis' : '3 quizzes passed',
  polyglot: i18n.t('dashboard.badgePolyglot'), polyglotDesc: i18n.isFrench ? 'Termine un cours de langue' : 'Complete a language course',
  scientist: i18n.t('dashboard.badgeScientist'), scientistDesc: i18n.isFrench ? 'Termine un cours de sciences' : 'Complete a science course',
  legend: i18n.t('dashboard.badgeLegend'), legendDesc: i18n.isFrench ? 'Atteins le niveau 5' : 'Reach level 5'
}));

function getCourseIcon(title: string) {
  switch (title) {
    case 'Maths Magiques': return CalculatorIcon;
    case "L'Univers Fascinant": return RocketLaunchIcon;
    case 'Anglais Aventure': return LanguageIcon;
    case 'Histoire Vivante': return BuildingLibraryIcon;
    case 'Code Créatif': return ComputerDesktopIcon;
    case "L'Art en Couleurs": return PaintBrushIcon;
    default: return BookOpenIcon;
  }
}

function getCourseIconBg(title: string) {
  switch (title) {
    case 'Maths Magiques': return '#E0E7FF';
    case "L'Univers Fascinant": return '#E0F2FE';
    case 'Anglais Aventure': return '#DCFCE7';
    case 'Histoire Vivante': return '#FFEDD5';
    case 'Code Créatif': return '#FEF9C3';
    case "L'Art en Couleurs": return '#FEE2E2';
    default: return '#F3F4F6';
  }
}

function getCourseIconColor(title: string) {
  switch (title) {
    case 'Maths Magiques': return '#7c3aed';
    case "L'Univers Fascinant": return '#0284c7';
    case 'Anglais Aventure': return '#16a34a';
    case 'Histoire Vivante': return '#ea580c';
    case 'Code Créatif': return '#ca8a04';
    case "L'Art en Couleurs": return '#e11d48';
    default: return '#64748b';
  }
}

// Historique réel : cours avec une progression > 0
const history = computed(() => {
  return courseStore.courses
    .filter(c => c.progress > 0)
    .map(c => ({
      id: c.id,
      title: c.title,
      progress: c.progress,
      icon: getCourseIcon(c.title),
      iconBg: getCourseIconBg(c.title),
      iconColor: getCourseIconColor(c.title),
    }));
});

const stats = computed(() => [
  { label: i18n.isFrench ? 'Cours suivis' : 'Courses followed', value: authStore.stats.coursesFollowed, icon: BookOpenIcon, bg: '#E0E7FF', color: '#7c3aed' },
  { label: i18n.isFrench ? 'Cours terminés' : 'Courses completed', value: authStore.stats.coursesCompleted, icon: CheckCircleIcon, bg: '#DCFCE7', color: '#16a34a' },
  { label: i18n.t('dashboard.certificatesCount'), value: authStore.stats.certificatesCount, icon: CheckBadgeIcon, bg: '#FEE2E2', color: '#e11d48' },
]);

const xpPercent = computed(() => Math.round((authStore.xpIntoLevel / authStore.xpForNextLevel) * 100));
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

    <!-- Profile Hero Card -->
    <div class="bg-white dark:bg-gray-800 rounded-[28px] shadow-soft dark:shadow-gray-900/50 mb-6 overflow-hidden">
      <div class="p-6 md:p-8" style="background: linear-gradient(135deg, #E0E7FF 0%, #E0F2FE 100%);">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div class="flex items-center gap-5">
            <div class="w-20 h-20 bg-edu-lime rounded-[20px] flex items-center justify-center shadow-soft flex-shrink-0">
              <UserIcon class="w-11 h-11 text-edu-navy" />
            </div>
            <div>
              <h1 class="text-2xl font-extrabold text-edu-text-main mb-1">{{ authStore.user?.name }}</h1>
              <p class="text-edu-text-muted dark:text-gray-400 text-sm font-medium mb-4">{{ authStore.user?.email }}</p>
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-1.5 text-xs font-bold text-edu-text-main">
                  <FireIcon class="w-4 h-4 text-orange-500" />
                  <span>{{ authStore.stats.streakDays }} {{ i18n.t('dashboard.streak') }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-xs font-bold text-edu-text-main">
                  <SparklesIcon class="w-4 h-4 text-purple-500" />
                  <span>{{ authStore.stats.totalXp }} XP</span>
                </div>
                <div class="flex items-center gap-1.5 text-xs font-bold text-edu-text-main">
                  <CheckBadgeIcon class="w-4 h-4 text-rose-500" />
                  <span>{{ authStore.stats.certificatesCount }} {{ i18n.t('dashboard.certificatesCount') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <div class="flex justify-between text-xs font-bold text-edu-text-muted mb-2">
            <span>{{ i18n.isFrench ? 'Niveau' : 'Level' }} {{ authStore.level }}</span>
            <span>{{ authStore.xpIntoLevel }} / {{ authStore.xpForNextLevel }} XP</span>
            <span>{{ i18n.isFrench ? 'Niveau' : 'Level' }} {{ authStore.level + 1 }}</span>
          </div>
          <div class="h-3 bg-edu-navy/10 dark:bg-edu-navy/20 rounded-full overflow-hidden">
            <div
              class="h-full bg-edu-lime rounded-full transition-all duration-700"
              :style="{ width: xpPercent + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Layout -->
    <div class="flex flex-col lg:flex-row gap-6 pb-10">

      <!-- Left Column -->
      <div class="flex-[2] flex flex-col gap-6 min-w-0">

        <!-- Badges -->
        <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-extrabold text-edu-text-main dark:text-white">{{ i18n.t('dashboard.badges') }}</h2>
            <span class="text-sm font-bold text-edu-text-muted dark:text-gray-400">
              {{ badges.filter(b => b.unlocked).length }} / {{ badges.length }}
            </span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div
              v-for="badge in badges"
              :key="badge.id"
              class="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200"
              :class="badge.unlocked ? 'hover:shadow-soft dark:hover:shadow-gray-900/50' : 'opacity-50 grayscale'"
              :style="badge.unlocked ? { background: badge.bg } : { background: '#F3F4F6' }"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center"
                :style="{ background: badge.unlocked ? 'rgba(255,255,255,0.7)' : '#E5E7EB' }"
              >
                <component :is="badge.icon" class="w-6 h-6" :style="{ color: badge.color }" />
              </div>
              <span class="text-[10px] font-extrabold text-edu-text-main dark:text-white text-center leading-tight">{{ badge.label }}</span>
              <span class="text-[9px] text-edu-text-muted dark:text-gray-400 text-center leading-tight">{{ badge.desc }}</span>
            </div>
          </div>
        </div>

        <!-- Historique -->
        <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50">
          <h2 class="text-xl font-extrabold text-edu-text-main dark:text-white mb-6">{{ i18n.isFrench ? 'Mon historique' : 'My history' }}</h2>
          <div v-if="history.length > 0" class="flex flex-col gap-5">
            <div
              v-for="item in history"
              :key="item.id"
              class="flex items-center gap-4"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                :style="{ background: item.iconBg }"
              >
                <component :is="item.icon" class="w-6 h-6" :style="{ color: item.iconColor }" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-sm font-bold text-edu-text-main dark:text-white">{{ item.title }}</span>
                  <span class="text-sm font-bold text-edu-text-muted dark:text-gray-400">{{ item.progress }}%</span>
                </div>
                <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-edu-lime rounded-full transition-all"
                    :style="{ width: item.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-edu-text-muted dark:text-gray-400 text-center py-6">
            {{ i18n.isFrench ? 'Aucun cours commencé pour le moment.' : 'No courses started yet.' }}
          </p>
        </div>

      </div>

      <!-- Right Column -->
      <div class="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-6">

        <!-- Statistiques -->
        <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50">
          <h2 class="text-base font-extrabold text-edu-text-main dark:text-white mb-5">{{ i18n.isFrench ? 'Statistiques' : 'Statistics' }}</h2>
          <div class="flex flex-col gap-3">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="flex items-center gap-4 p-4 rounded-2xl"
              :style="{ background: stat.bg + '55' }"
            >
              <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ background: stat.bg }">
                <component :is="stat.icon" class="w-5 h-5" :style="{ color: stat.color }" />
              </div>
              <div>
                <p class="text-[10px] text-edu-text-muted dark:text-gray-400 font-medium">{{ stat.label }}</p>
                <p class="text-xl font-extrabold text-edu-text-main dark:text-white">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Prochain palier -->
        <div class="bg-edu-lavender dark:bg-gray-900 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50 relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 opacity-20 dark:opacity-10">
            <TrophyIcon class="w-24 h-24 text-purple-500 dark:text-edu-lime" />
          </div>

          <p class="text-[10px] font-black tracking-[0.15em] text-purple-600 dark:text-edu-lime/70 uppercase mb-2">{{ i18n.isFrench ? 'Prochain palier' : 'Next level' }}</p>
          <h3 class="text-lg font-extrabold text-edu-navy dark:text-white mb-2">{{ i18n.isFrench ? 'Niveau' : 'Level' }} {{ authStore.level + 1 }}</h3>
          <p class="text-xs text-edu-navy/70 dark:text-white/70 leading-relaxed">
            {{ i18n.isFrench ? 'Plus que' : 'Only' }} <strong class="text-purple-600 dark:text-edu-lime">{{ authStore.xpForNextLevel - authStore.xpIntoLevel }} XP</strong> {{ i18n.isFrench ? 'pour débloquer le niveau suivant !' : 'to unlock the next level!' }}
          </p>
          <div class="mt-4 h-1.5 bg-edu-navy/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-edu-navy dark:bg-edu-lime rounded-full"
              :style="{ width: xpPercent + '%' }"
            ></div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
