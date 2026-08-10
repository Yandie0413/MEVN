<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import {
  MagnifyingGlassIcon,
  FireIcon,
  StarIcon,
  UserGroupIcon,
  PlayIcon,
  RocketLaunchIcon,
  CalculatorIcon,
  LanguageIcon,
  BuildingLibraryIcon,
  ComputerDesktopIcon,
  PaintBrushIcon,
  BookOpenIcon
} from '@heroicons/vue/24/solid';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const authStore = useAuthStore();
const i18n = useI18nStore();

const activeFilter = ref(i18n.isFrench ? 'Tous' : 'All');
const filters = computed(() => i18n.isFrench
  ? ['Tous', 'Mathématiques', 'Sciences', 'Langues', 'Histoire', 'Informatique', 'Arts']
  : ['All', 'Mathematics', 'Sciences', 'Languages', 'History', 'Computer Science', 'Arts']);

const searchTerm = ref(typeof route.query.q === 'string' ? route.query.q : '');

// Get courses from store
const storeCourses = computed(() => courseStore.courses);

const filteredCourses = computed(() => {
  let result = storeCourses.value;
  if (activeFilter.value !== (i18n.isFrench ? 'Tous' : 'All')) {
    result = result.filter(c => c.category === activeFilter.value);
  }
  const term = searchTerm.value.trim().toLowerCase();
  if (term) {
    result = result.filter(c => c.title.toLowerCase().includes(term) || c.category.toLowerCase().includes(term));
  }
  return result;
});

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

function startCourse(courseId: string) {
  courseStore.setCourseActive(courseId);
  router.push(`/course/${courseId}`);
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Top Bar -->
    <header class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <div class="w-full sm:w-[450px] bg-white dark:bg-gray-800 h-12 rounded-full flex items-center px-5 shadow-soft">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
        <input v-model="searchTerm" type="text" :placeholder="i18n.t('dashboard.search')" class="bg-transparent border-none outline-none text-sm w-full text-edu-text-main dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium" />
      </div>
      <div class="flex items-center gap-4">
        <div class="h-12 bg-white dark:bg-gray-800 rounded-full flex items-center px-5 shadow-soft gap-2 font-bold text-sm text-edu-text-main dark:text-white flex-shrink-0">
          <FireIcon class="w-5 h-5 text-orange-500" />
          <span>{{ authStore.stats.streakDays }} <span class="text-gray-400 dark:text-gray-500 font-medium">{{ i18n.t('dashboard.streak') }}</span></span>
        </div>
      </div>
    </header>

    <!-- Page Title -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-1">
        <h1 class="text-3xl font-extrabold text-edu-text-main dark:text-white">{{ i18n.t('mescours.title') }}</h1>
        <div class="w-9 h-9 bg-edu-orange dark:bg-orange-900/50 rounded-full flex items-center justify-center">
          <BuildingLibraryIcon class="w-5 h-5 text-orange-500" />
        </div>
      </div>
      <p class="text-edu-text-muted dark:text-gray-400 text-sm font-medium">{{ i18n.t('mescours.subtitle') }}</p>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-8 flex-wrap">
      <button
        v-for="f in filters"
        :key="f"
        @click="activeFilter = f"
        class="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
        :class="activeFilter === f
          ? 'bg-edu-navy dark:bg-edu-navy text-edu-lime dark:text-edu-lime shadow-sm'
          : 'bg-white dark:bg-gray-800 text-edu-text-muted dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-edu-navy dark:hover:border-edu-lime hover:text-edu-text-main dark:hover:text-white'"
      >
        {{ f }}
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="filteredCourses.length === 0" class="bg-white dark:bg-gray-800 rounded-[28px] p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
      <BookOpenIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <p class="text-edu-text-main dark:text-white font-bold mb-1">{{ i18n.isFrench ? 'Aucun cours ne correspond' : 'No matching courses' }}</p>
      <p class="text-sm text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Essaie une autre recherche ou catégorie.' : 'Try a different search or category.' }}</p>
    </div>

    <!-- Courses Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 pr-1">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="bg-white dark:bg-gray-800 rounded-[24px] p-5 shadow-soft dark:shadow-gray-900/50 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
        @click="startCourse(course.id)"
      >
        <!-- Card Banner -->
        <div class="h-44 rounded-2xl mb-5 relative overflow-hidden flex items-center justify-center" :class="course.bgColor">
          <span class="absolute top-4 left-4 bg-white/90 dark:bg-gray-700/90 text-edu-text-main dark:text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
            {{ course.category }}
          </span>
          <component :is="getCourseIcon(course.title)" class="w-24 h-24 opacity-60 absolute -right-3 -bottom-3" :style="{ color: course.iconColor }" />
          <component :is="getCourseIcon(course.title)" class="w-14 h-14 absolute left-5 bottom-5" :style="{ color: course.iconColor }" />
        </div>

        <!-- Title & Description -->
        <h3 class="font-extrabold text-edu-text-main dark:text-white text-base mb-1">{{ course.title }}</h3>
        <p class="text-[12px] text-edu-text-muted dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">{{ course.description }}</p>

        <!-- Meta -->
        <div class="flex items-center gap-4 text-[11px] text-edu-text-muted dark:text-gray-400 font-medium mb-4">
          <span class="flex items-center gap-1 text-yellow-500">
            <StarIcon class="w-3.5 h-3.5" /> {{ course.rating ?? 0 }}
          </span>
          <span class="flex items-center gap-1">
            <UserGroupIcon class="w-3.5 h-3.5" /> {{ course.students?.toLocaleString() ?? 0 }}
          </span>
        </div>

        <!-- Progress -->
        <div class="flex justify-between text-[11px] font-bold text-edu-text-muted dark:text-gray-400 mb-1.5">
          <span>{{ i18n.t('dashboard.progression') }}</span>
          <span class="text-edu-text-main dark:text-white">{{ course.progress }}%</span>
        </div>
        <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <div class="h-full bg-edu-lime rounded-full transition-all duration-500" :style="`width: ${course.progress}%`"></div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center mt-auto">
          <span class="text-[11px] text-edu-text-muted dark:text-gray-400 font-medium">{{ course.chapters.length }} {{ i18n.t('dashboard.chapters') }}</span>
          <button class="bg-edu-lime dark:bg-lime-400 text-edu-navy dark:text-edu-navy text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#c5e64d] dark:hover:bg-lime-300 transition-colors">
            <PlayIcon class="w-3 h-3" />
            {{ course.progress > 0 ? i18n.t('dashboard.continue') : i18n.t('dashboard.start') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
