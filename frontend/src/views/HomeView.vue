<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useCourseStore } from '@/stores/courseStore';
import { useI18nStore } from '@/stores/i18nStore';
import { useThemeStore } from '@/stores/themeStore';
import { computed, onMounted } from 'vue';
import {
  StarIcon,
  ArrowRightIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  TrophyIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon
} from '@heroicons/vue/24/solid';
import {
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const courseStore = useCourseStore();
const i18n = useI18nStore();
const themeStore = useThemeStore();

onMounted(() => {
  courseStore.fetchCourses();
});

const navLinks = computed(() => [
  { label: i18n.t('nav.courses'), href: '#featured-courses' }
]);

// Real course data from the catalog — icon/color are purely presentational, everything else is live.
const categoryIcon: Record<string, typeof PaintBrushIcon> = {
  'Mathématiques': TrophyIcon,
  'Sciences': RocketLaunchIcon,
  'Langues': LanguageIcon,
  'Histoire': BuildingLibraryIcon,
  'Informatique': CodeBracketIcon,
  'Arts': PaintBrushIcon
};
const cardColors = [
  'bg-[#E0E7FF] text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'bg-[#D4F063]/50 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  'bg-[#FEE2E2] text-red-500 dark:bg-red-900/30 dark:text-red-400',
  'bg-[#E0F2FE] text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
];

const featuredCourses = computed(() => courseStore.courses.slice(0, 4).map((c, i) => ({
  id: c.id,
  icon: categoryIcon[c.category] || BookOpenIcon,
  title: c.title,
  level: c.level,
  lessons: c.chapters.length,
  rating: c.rating,
  color: cardColors[i % cardColors.length]
})));

// Loose "pinned collage" positions for the hero — deterministic per card index, varied sizes for an organic (not gridded) feel.
const collageLayout = [
  { left: '2%', top: '0px', rotate: '-6deg', width: 'w-44', pinColor: 'bg-rose-400' },
  { left: '28%', top: '58px', rotate: '4deg', width: 'w-52', pinColor: 'bg-sky-400' },
  { left: '55%', top: '2px', rotate: '-3deg', width: 'w-40', pinColor: 'bg-amber-400' },
  { left: '78%', top: '52px', rotate: '5deg', width: 'w-48', pinColor: 'bg-emerald-400' }
];
function collageStyle(i: number) {
  const p = collageLayout[i % collageLayout.length];
  return { left: p.left, top: p.top, transform: `rotate(${p.rotate})` };
}
function collageWidth(i: number) {
  return collageLayout[i % collageLayout.length].width;
}
function collagePinColor(i: number) {
  return collageLayout[i % collageLayout.length].pinColor;
}
</script>

<template>
  <div class="min-h-screen bg-edu-bg dark:bg-gray-900 font-sans transition-colors duration-300">

    <!-- NAVBAR: floating island, not an edge-to-edge bar -->
    <nav class="sticky top-3 sm:top-4 z-50 mt-3 sm:mt-4 mx-3 sm:mx-6 lg:mx-auto lg:max-w-7xl rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-100 dark:border-gray-700 shadow-soft">
      <div class="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <RouterLink to="/" class="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity no-underline flex-shrink-0">
          <div class="w-8 h-8 bg-edu-navy dark:bg-edu-lime rounded-xl flex items-center justify-center">
            <div class="w-3 h-3 bg-edu-lime dark:bg-edu-navy rounded-full"></div>
          </div>
          <span class="font-display font-bold text-xl text-edu-navy dark:text-white tracking-tight">Curio</span>
        </RouterLink>
        <div class="hidden md:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link.label" :href="link.href" class="text-sm font-medium text-edu-text-muted dark:text-gray-300 hover:text-edu-navy dark:hover:text-edu-lime transition-colors">{{ link.label }}</a>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="i18n.setLocale(i18n.locale === 'fr' ? 'en' : 'fr')"
            class="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group flex-shrink-0"
            :title="i18n.locale === 'fr' ? 'Switch to English' : 'Passer en Français'"
          >
            <LanguageIcon class="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-edu-navy dark:group-hover:text-edu-lime" />
            <span class="hidden sm:inline ml-1 text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-edu-navy dark:group-hover:text-edu-lime">
              {{ i18n.locale.toUpperCase() }}
            </span>
          </button>

          <button
            @click="themeStore.toggleTheme()"
            class="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
            :title="themeStore.theme === 'light' ? 'Mode sombre' : 'Mode clair'"
          >
            <SunIcon v-if="themeStore.theme === 'dark'" class="w-5 h-5 text-yellow-400" />
            <MoonIcon v-else class="w-5 h-5 text-gray-600" />
          </button>

          <button v-if="!authStore.isAuthenticated" @click="router.push('/login')" class="hidden sm:inline-block text-sm font-semibold text-edu-navy dark:text-white px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
            {{ i18n.t('nav.signIn') }}
          </button>
          <button v-if="!authStore.isAuthenticated" @click="router.push('/register')" class="text-sm font-semibold bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-lime-400 transition-all hover:scale-105 shadow-sm flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
            {{ i18n.t('nav.getStarted') }} <ArrowRightIcon class="w-3.5 h-3.5" />
          </button>
          <div v-else class="flex items-center gap-3">
            <span class="hidden lg:inline text-sm font-semibold text-edu-navy dark:text-white">{{ i18n.t('nav.hi') }}, {{ authStore.user?.name }}!</span>
            <button @click="router.push('/dashboard')" class="text-sm font-semibold bg-edu-lime text-edu-navy px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-sm flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
              {{ i18n.t('nav.dashboard') }} <ArrowRightIcon class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="dot-grid relative max-w-7xl mx-auto px-6 pt-16 pb-16">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-2 bg-edu-lime/30 dark:bg-edu-lime/20 text-edu-navy dark:text-edu-lime text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
          <span class="w-1.5 h-1.5 bg-edu-navy dark:bg-edu-lime rounded-full animate-pulse"></span>
          {{ i18n.t('hero.badge') }}
        </div>
        <h1 class="font-display text-5xl md:text-7xl font-bold text-edu-navy dark:text-white leading-[1.05] mb-6">
          {{ i18n.t('hero.title1') }}<br/>
          <span class="relative inline-block">
            {{ i18n.t('hero.title2') }}
            <span class="absolute -bottom-1 left-0 right-0 h-3 bg-edu-lime/60 dark:bg-edu-lime/40 -z-10 rounded-sm"></span>
          </span>
        </h1>
        <p class="text-lg text-edu-text-muted dark:text-gray-300 leading-relaxed mb-10 max-w-lg">
          {{ i18n.t('hero.subtitle') }}
        </p>
        <div class="relative flex flex-wrap items-center gap-4">
          <button @click="router.push('/register')" class="bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold px-8 py-4 rounded-2xl hover:bg-gray-800 dark:hover:bg-lime-400 transition-all hover:scale-105 shadow-lg text-sm flex items-center gap-2">
            {{ i18n.t('hero.startLearning') }} <ArrowRightIcon class="w-4 h-4" />
          </button>
          <!-- Hand-drawn accent -->
          <div class="hidden lg:block absolute left-full top-1/2 -translate-y-2 ml-2 text-edu-navy dark:text-edu-lime">
            <svg width="92" height="56" viewBox="0 0 92 56" fill="none" class="rotate-[-6deg]">
              <path d="M4 6 C 30 -2, 55 8, 68 30 S 82 44, 86 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
              <path d="M76 34 L 86 40 L 78 48" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.7"/>
            </svg>
            <span class="font-display italic text-sm -mt-1 block ml-1">{{ i18n.isFrench ? "c'est gratuit !" : "it's free!" }}</span>
          </div>
        </div>
      </div>

      <!-- Course collage: real catalog data, pinned like scattered cards rather than a fake app mockup -->
      <div v-if="featuredCourses.length > 0" class="hidden md:block relative h-[280px] mt-20">
        <div
          v-for="(course, i) in featuredCourses" :key="course.id"
          :class="['absolute bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft dark:shadow-gray-900/50 border border-gray-100/80 dark:border-gray-700/50 transition-transform duration-300 hover:scale-105 hover:rotate-0 hover:z-20 cursor-pointer', collageWidth(i)]"
          :style="collageStyle(i)"
          @click="router.push('/login')"
        >
          <div :class="['absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-sm border-2 border-white dark:border-gray-800', collagePinColor(i)]"></div>
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center mb-3', course.color]">
            <component :is="course.icon" class="w-5 h-5" />
          </div>
          <p class="font-bold text-sm text-edu-navy dark:text-white mb-1 truncate">{{ course.title }}</p>
          <p class="text-[11px] text-edu-text-muted dark:text-gray-400 flex items-center gap-1">
            <StarIcon class="w-3 h-3 text-yellow-400" /> {{ course.rating }} · {{ course.lessons }} {{ i18n.t('courses.lessons') }}
          </p>
        </div>
      </div>
      <div v-if="featuredCourses.length > 0" class="md:hidden flex overflow-x-auto gap-4 -mx-6 px-6 mt-12 pb-2">
        <div
          v-for="course in featuredCourses" :key="course.id"
          class="flex-shrink-0 w-40 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft dark:shadow-gray-900/50 border border-gray-100/80 dark:border-gray-700/50"
          @click="router.push('/login')"
        >
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center mb-3', course.color]">
            <component :is="course.icon" class="w-5 h-5" />
          </div>
          <p class="font-bold text-sm text-edu-navy dark:text-white mb-1 truncate">{{ course.title }}</p>
          <p class="text-[11px] text-edu-text-muted dark:text-gray-400 flex items-center gap-1">
            <StarIcon class="w-3 h-3 text-yellow-400" /> {{ course.rating }} · {{ course.lessons }} {{ i18n.t('courses.lessons') }}
          </p>
        </div>
      </div>
    </section>

    <!-- FEATURED COURSES -->
    <section id="featured-courses" class="max-w-7xl mx-auto px-6 py-24">
      <div class="flex justify-between items-end mb-10">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-edu-text-muted dark:text-gray-400 mb-2">{{ i18n.t('courses.explore') }}</p>
          <h2 class="font-display text-4xl font-bold text-edu-navy dark:text-white">{{ i18n.t('courses.featured') }}</h2>
        </div>
        <a href="/login" class="text-sm font-semibold text-edu-navy dark:text-edu-lime underline underline-offset-4 hover:no-underline flex items-center gap-1">
          {{ i18n.t('courses.viewAll') }} <ArrowTopRightOnSquareIcon class="w-4 h-4" />
        </a>
      </div>
      <div v-if="featuredCourses.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Spotlight: first course gets a larger, detailed tile -->
        <div
          v-if="featuredCourses[0]"
          class="lg:col-span-2 lg:row-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft dark:shadow-gray-900/50 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          @click="router.push('/login')"
        >
          <div>
            <div class="flex justify-between items-start mb-6">
              <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center', featuredCourses[0].color]">
                <component :is="featuredCourses[0].icon" class="w-8 h-8" />
              </div>
              <span class="text-xs font-bold bg-edu-lime text-edu-navy px-3 py-1.5 rounded-full flex items-center gap-1">
                <StarIcon class="w-3.5 h-3.5" /> {{ featuredCourses[0].rating }}
              </span>
            </div>
            <h3 class="font-display text-2xl font-bold text-edu-navy dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-edu-lime transition-colors">{{ featuredCourses[0].title }}</h3>
            <p class="text-sm text-edu-text-muted dark:text-gray-400">{{ featuredCourses[0].lessons }} {{ i18n.t('courses.lessons') }} · {{ featuredCourses[0].level }}</p>
          </div>
          <div class="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span class="text-sm font-semibold text-edu-navy dark:text-edu-lime group-hover:text-indigo-600 dark:group-hover:text-lime-400 transition-colors flex items-center gap-1.5 w-fit">
              {{ i18n.t('courses.startCourse') }} <ArrowRightIcon class="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        <!-- Remaining courses: compact rows -->
        <div
          v-for="course in featuredCourses.slice(1)" :key="course.id"
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft dark:shadow-gray-900/50 hover:shadow-md transition-all duration-300 cursor-pointer group flex items-center gap-4"
          @click="router.push('/login')"
        >
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', course.color]">
            <component :is="course.icon" class="w-6 h-6" />
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-edu-navy dark:text-white text-sm mb-0.5 truncate group-hover:text-indigo-600 dark:group-hover:text-edu-lime transition-colors">{{ course.title }}</h4>
            <p class="text-xs text-edu-text-muted dark:text-gray-400">{{ course.lessons }} {{ i18n.t('courses.lessons') }} · <StarIcon class="w-3 h-3 inline text-yellow-400 -mt-0.5" /> {{ course.rating }}</p>
          </div>
          <ArrowRightIcon class="w-4 h-4 text-edu-text-muted dark:text-gray-500 flex-shrink-0 group-hover:text-indigo-600 dark:group-hover:text-edu-lime transition-colors" />
        </div>
      </div>
    </section>

    <!-- CTA SECTION: full-bleed band, not a floating card. Inverts per theme so it's never a dark block sitting in a light page. -->
    <section class="bg-edu-lime dark:bg-black mt-24 py-16 md:py-20">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
        <div class="max-w-xl text-center md:text-left">
          <h2 class="font-display text-3xl md:text-5xl font-bold text-edu-navy dark:text-white mb-3">{{ i18n.t('cta.title') }}</h2>
          <p class="text-edu-navy/70 dark:text-gray-400">{{ i18n.t('cta.subtitle') }}</p>
        </div>
        <button @click="router.push('/register')" class="bg-edu-navy text-white dark:bg-edu-lime dark:text-edu-navy font-extrabold px-8 py-4 rounded-2xl hover:opacity-90 transition-all hover:scale-105 shadow-lg text-sm flex items-center gap-2 whitespace-nowrap flex-shrink-0">
          {{ i18n.t('cta.button') }} <ArrowRightIcon class="w-4 h-4" />
        </button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-gray-200 dark:border-gray-700 py-8">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-edu-text-muted dark:text-gray-400">
        <RouterLink to="/" class="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity no-underline">
          <div class="w-6 h-6 bg-edu-navy dark:bg-edu-lime rounded-lg flex items-center justify-center">
            <div class="w-2 h-2 bg-edu-lime dark:bg-edu-navy rounded-full"></div>
          </div>
          <span class="font-display font-bold text-edu-navy dark:text-white">Curio</span>
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

<style scoped>
.dot-grid {
  background-image: radial-gradient(circle, rgba(30, 31, 36, 0.1) 1px, transparent 1px);
  background-size: 22px 22px;
}
:global(.dark) .dot-grid {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.09) 1px, transparent 1px);
}
</style>
