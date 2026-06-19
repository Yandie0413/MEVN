<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import { useThemeStore } from '@/stores/themeStore';
import { computed } from 'vue';
import {
  AcademicCapIcon,
  ChartBarIcon,
  StarIcon,
  PlayCircleIcon,
  ArrowRightIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  CircleStackIcon,
  DevicePhoneMobileIcon,
  TrophyIcon,
  UserGroupIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon
} from '@heroicons/vue/24/solid';
import {
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const i18n = useI18nStore();
const themeStore = useThemeStore();

const navLinks = computed(() => [
  i18n.t('nav.courses'),
  i18n.t('nav.features'),
  i18n.t('nav.pricing'),
  i18n.t('nav.about')
]);

const courses = computed(() => [
  { 
    icon: PaintBrushIcon, 
    title: i18n.t('course.uiux'), 
    lessons: 24, 
    level: i18n.t('courses.beginner'), 
    color: 'bg-[#E0E7FF] text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', 
    badge: i18n.t('courses.popular') 
  },
  { 
    icon: CodeBracketIcon, 
    title: i18n.t('course.webdev'), 
    lessons: 36, 
    level: i18n.t('courses.intermediate'), 
    color: 'bg-[#D4F063]/50 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400', 
    badge: i18n.t('courses.new') 
  },
  { 
    icon: CircleStackIcon, 
    title: i18n.t('course.datascience'), 
    lessons: 28, 
    level: i18n.t('courses.advanced'), 
    color: 'bg-[#FEE2E2] text-red-500 dark:bg-red-900/30 dark:text-red-400', 
    badge: '' 
  },
  { 
    icon: DevicePhoneMobileIcon, 
    title: i18n.t('course.mobiledev'), 
    lessons: 30, 
    level: i18n.t('courses.intermediate'), 
    color: 'bg-[#E0F2FE] text-sky-600 dark:bg-sky-900/30 dark:text-sky-400', 
    badge: i18n.t('courses.hot') 
  },
]);

const stats = computed(() => [
  { value: '25K+', label: i18n.t('stats.students') },
  { value: '500+', label: i18n.t('stats.courses') },
  { value: '98%', label: i18n.t('stats.satisfaction') },
  { value: '40+', label: i18n.t('stats.instructors') },
]);

const features = computed(() => [
  { icon: AcademicCapIcon, label: i18n.t('auth.login.feature1') },
  { icon: ChartBarIcon, label: i18n.t('auth.login.feature2') },
  { icon: TrophyIcon, label: i18n.t('auth.login.feature3') },
]);

const heroChapters = computed(() => [
  'Intro to Figma',
  i18n.locale === 'fr' ? 'Théorie des Couleurs' : 'Color Theory',
  i18n.locale === 'fr' ? 'Typographie' : 'Typography',
  i18n.locale === 'fr' ? 'Systèmes de Design' : 'Design Systems'
]);
</script>

<template>
  <div class="min-h-screen bg-edu-bg dark:bg-gray-900 font-sans transition-colors duration-300">

    <!-- NAVBAR -->
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 shadow-soft">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity no-underline">
          <div class="w-8 h-8 bg-edu-navy dark:bg-edu-lime rounded-xl flex items-center justify-center">
            <div class="w-3 h-3 bg-edu-lime dark:bg-edu-navy rounded-full"></div>
          </div>
          <span class="font-extrabold text-xl text-edu-navy dark:text-white tracking-tight">Curio</span>
        </RouterLink>
        <div class="hidden md:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link" href="#" class="text-sm font-medium text-edu-text-muted dark:text-gray-300 hover:text-edu-navy dark:hover:text-edu-lime transition-colors">{{ link }}</a>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="i18n.setLocale(i18n.locale === 'fr' ? 'en' : 'fr')"
            class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
            :title="i18n.locale === 'fr' ? 'Switch to English' : 'Passer en Français'"
          >
            <LanguageIcon class="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-edu-navy dark:group-hover:text-edu-lime" />
            <span class="ml-1 text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-edu-navy dark:group-hover:text-edu-lime">
              {{ i18n.locale.toUpperCase() }}
            </span>
          </button>

          <button 
            @click="themeStore.toggleTheme()"
            class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            :title="themeStore.theme === 'light' ? 'Mode sombre' : 'Mode clair'"
          >
            <SunIcon v-if="themeStore.theme === 'dark'" class="w-5 h-5 text-yellow-400" />
            <MoonIcon v-else class="w-5 h-5 text-gray-600" />
          </button>

          <button v-if="!authStore.isAuthenticated" @click="router.push('/login')" class="text-sm font-semibold text-edu-navy dark:text-white px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {{ i18n.t('nav.signIn') }}
          </button>
          <button v-if="!authStore.isAuthenticated" @click="router.push('/register')" class="text-sm font-semibold bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy px-5 py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-lime-400 transition-all hover:scale-105 shadow-sm flex items-center gap-1.5">
            {{ i18n.t('nav.getStarted') }} <ArrowRightIcon class="w-3.5 h-3.5" />
          </button>
          <div v-else class="flex items-center gap-3">
            <span class="text-sm font-semibold text-edu-navy dark:text-white">{{ i18n.t('nav.hi') }}, {{ authStore.user?.name }}!</span>
            <button @click="router.push('/dashboard')" class="text-sm font-semibold bg-edu-lime text-edu-navy px-5 py-2.5 rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-sm flex items-center gap-1.5">
              {{ i18n.t('nav.dashboard') }} <ArrowRightIcon class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col md:flex-row items-center gap-16">
      <div class="flex-1 text-left">
        <div class="inline-flex items-center gap-2 bg-edu-lime/30 dark:bg-edu-lime/20 text-edu-navy dark:text-edu-lime text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
          <span class="w-1.5 h-1.5 bg-edu-navy dark:bg-edu-lime rounded-full animate-pulse"></span>
          {{ i18n.t('hero.badge') }}
        </div>
        <h1 class="text-5xl md:text-6xl font-extrabold text-edu-navy dark:text-white leading-[1.1] mb-6">
          {{ i18n.t('hero.title1') }}<br/>
          <span class="relative inline-block">
            {{ i18n.t('hero.title2') }}
            <span class="absolute -bottom-1 left-0 right-0 h-3 bg-edu-lime/60 dark:bg-edu-lime/40 -z-10 rounded-sm"></span>
          </span>
        </h1>
        <p class="text-lg text-edu-text-muted dark:text-gray-300 leading-relaxed mb-10 max-w-lg">
          {{ i18n.t('hero.subtitle') }}
        </p>
        <div class="flex flex-wrap items-center gap-4">
          <button @click="router.push('/register')" class="bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold px-8 py-4 rounded-2xl hover:bg-gray-800 dark:hover:bg-lime-400 transition-all hover:scale-105 shadow-lg text-sm flex items-center gap-2">
            {{ i18n.t('hero.startLearning') }} <ArrowRightIcon class="w-4 h-4" />
          </button>
          <button class="flex items-center gap-3 font-semibold text-edu-navy dark:text-white text-sm px-4 py-4 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
            <div class="w-8 h-8 bg-edu-rose dark:bg-red-900/50 rounded-full flex items-center justify-center">
              <PlayCircleIcon class="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
            {{ i18n.t('hero.watchDemo') }}
          </button>
        </div>
        <div class="flex items-center gap-3 mt-10">
          <div class="flex -space-x-2">
            <img v-for="i in 4" :key="i" :src="`https://i.pravatar.cc/40?img=${i+10}`" class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover" />
          </div>
          <p class="text-sm text-edu-text-muted dark:text-gray-300 font-medium">{{ i18n.t('hero.joinedBy') }} <span class="font-bold text-edu-navy dark:text-edu-lime">25,000+</span> {{ i18n.t('hero.learners') }}</p>
        </div>
      </div>
      <!-- Hero Visual -->
      <div class="flex-1 flex justify-center">
        <div class="relative w-full max-w-[480px]">
          <div class="bg-edu-navy dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-white">
            <div class="flex justify-between items-start mb-6">
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">{{ i18n.t('hero.yourProgress') }}</p>
                <h3 class="font-bold text-xl">{{ i18n.t('course.uiux') }} Pro</h3>
              </div>
              <div class="w-10 h-10 bg-edu-lime rounded-xl flex items-center justify-center">
                <PaintBrushIcon class="w-5 h-5 text-edu-navy" />
              </div>
            </div>
            <div class="mb-6">
              <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-2">
                <span>{{ i18n.locale === 'fr' ? 'Chapitre' : 'Chapter' }} 8 / 12</span>
                <span class="text-edu-lime font-bold">68%</span>
              </div>
              <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full w-[68%] bg-edu-lime rounded-full"></div>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div v-for="(item, idx) in heroChapters" :key="item"
                   class="flex items-center gap-3 p-3 rounded-xl"
                   :class="idx < 3 ? 'bg-white/5' : 'bg-edu-lime/20'">
                <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                     :class="idx < 3 ? 'bg-edu-lime' : 'border border-gray-500'">
                  <CheckCircleIcon v-if="idx < 3" class="w-5 h-5 text-edu-navy" />
                  <span v-else class="text-gray-500 text-xs">4</span>
                </div>
                <span class="text-sm font-medium" :class="idx < 3 ? 'text-gray-300' : 'text-edu-lime'">{{ item }}</span>
              </div>
            </div>
          </div>
          <!-- Floating badges -->
          <div class="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div class="w-8 h-8 bg-edu-lime rounded-lg flex items-center justify-center">
              <TrophyIcon class="w-4 h-4 text-edu-navy" />
            </div>
            <div>
              <p class="text-[10px] text-edu-text-muted dark:text-gray-400">{{ i18n.t('hero.achievement') }}</p>
              <p class="text-xs font-bold text-edu-navy dark:text-white">{{ i18n.t('hero.courseComplete') }}</p>
            </div>
          </div>
          <div class="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl">
            <div class="flex items-center gap-1 mb-1">
              <StarIcon v-for="i in 5" :key="i" class="w-3 h-3 text-yellow-400" />
            </div>
            <p class="text-xs font-bold text-edu-navy dark:text-white">4.9/5 {{ i18n.t('hero.rating') }}</p>
            <p class="text-[10px] text-edu-text-muted dark:text-gray-400">{{ i18n.locale === 'fr' ? 'sur 12 400 avis' : 'from 12,400 reviews' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="bg-edu-navy dark:bg-gray-800 py-14">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.value" class="flex flex-col items-center">
          <h3 class="text-4xl font-extrabold text-edu-lime mb-1">{{ stat.value }}</h3>
          <p class="text-sm text-gray-400 dark:text-gray-300 font-medium">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- FEATURED COURSES -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="flex justify-between items-end mb-10">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-edu-text-muted dark:text-gray-400 mb-2">{{ i18n.t('courses.explore') }}</p>
          <h2 class="text-4xl font-extrabold text-edu-navy dark:text-white">{{ i18n.t('courses.featured') }}</h2>
        </div>
        <a href="#" class="text-sm font-semibold text-edu-navy dark:text-edu-lime underline underline-offset-4 hover:no-underline flex items-center gap-1">
          {{ i18n.t('courses.viewAll') }} <ArrowTopRightOnSquareIcon class="w-4 h-4" />
        </a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="course in courses" :key="course.title"
             class="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-soft dark:shadow-gray-900/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div class="flex justify-between items-start mb-4">
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center', course.color]">
              <component :is="course.icon" class="w-7 h-7" />
            </div>
            <span v-if="course.badge" class="text-[10px] font-bold bg-edu-lime text-edu-navy dark:text-edu-navy px-2.5 py-1 rounded-full uppercase tracking-wider">
              {{ course.badge }}
            </span>
          </div>
          <h3 class="font-bold text-edu-navy dark:text-white text-base mb-1 group-hover:text-indigo-600 dark:group-hover:text-edu-lime transition-colors">{{ course.title }}</h3>
          <p class="text-xs text-edu-text-muted dark:text-gray-400 mb-4">{{ course.lessons }} {{ i18n.t('courses.lessons') }} · {{ course.level }}</p>
          <div class="pt-3 border-t border-gray-100 dark:border-gray-700">
            <button @click="router.push('/login')" class="text-xs font-semibold text-edu-navy dark:text-edu-lime hover:text-indigo-600 dark:hover:text-lime-400 transition-colors flex items-center gap-1">
              {{ i18n.t('courses.startCourse') }} <ArrowRightIcon class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="max-w-7xl mx-auto px-6 pb-24">
      <div class="bg-edu-navy dark:bg-gray-800 rounded-[32px] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-64 h-64 bg-edu-lime/10 rounded-full"></div>
        <div class="absolute -bottom-16 -left-8 w-48 h-48 bg-edu-lime/5 rounded-full"></div>
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-extrabold text-white dark:text-white mb-3">{{ i18n.t('cta.title') }}</h2>
          <p class="text-gray-400 dark:text-gray-300">{{ i18n.t('cta.subtitle') }}</p>
        </div>
        <div class="relative z-10 flex-shrink-0">
          <button @click="router.push('/register')" class="bg-edu-lime text-edu-navy dark:text-edu-navy font-extrabold px-8 py-4 rounded-2xl hover:opacity-90 transition-all hover:scale-105 shadow-lg text-sm flex items-center gap-2 whitespace-nowrap">
            {{ i18n.t('cta.button') }} <ArrowRightIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-gray-200 dark:border-gray-700 py-8">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-edu-text-muted dark:text-gray-400">
        <RouterLink to="/" class="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity no-underline">
          <div class="w-6 h-6 bg-edu-navy dark:bg-edu-lime rounded-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-edu-lime dark:bg-edu-navy rounded-full"></div>
          </div>
          <span class="font-bold text-edu-navy dark:text-white">Curio</span>
        </RouterLink>
        <p>© 2026 Curio. {{ i18n.t('footer.rights') }}</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-edu-navy dark:hover:text-edu-lime transition-colors">{{ i18n.t('footer.privacy') }}</a>
          <a href="#" class="hover:text-edu-navy dark:hover:text-edu-lime transition-colors">{{ i18n.t('footer.terms') }}</a>
          <a href="#" class="hover:text-edu-navy dark:hover:text-edu-lime transition-colors">{{ i18n.t('footer.contact') }}</a>
        </div>
      </div>
    </footer>

  </div>
</template>
