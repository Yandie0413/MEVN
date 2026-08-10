<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Bars3Icon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import { useCourseStore } from '@/stores/courseStore';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useI18nStore } from '@/stores/i18nStore';

const courseStore = useCourseStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const i18n = useI18nStore();

const sidebarOpen = ref(false);

onMounted(() => {
  courseStore.fetchCourses();
  authStore.fetchStats();
});
</script>

<template>
  <div class="h-screen bg-edu-bg dark:bg-gray-950 w-full flex overflow-hidden font-sans">

    <!-- Mobile backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar: off-canvas drawer on mobile, static column on desktop -->
    <div
      class="p-4 h-full flex-shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <Sidebar @navigate="sidebarOpen = false" />
    </div>

    <!-- Main Content -->
    <div class="flex-1 h-full overflow-y-auto flex flex-col min-w-0">

      <!-- Mobile top bar -->
      <div class="lg:hidden flex-shrink-0 sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <button
          @click="sidebarOpen = true"
          class="w-10 h-10 flex items-center justify-center rounded-xl text-edu-navy dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
        <span class="font-extrabold text-lg text-edu-navy dark:text-white">Curio</span>
        <button
          @click="themeStore.toggleTheme()"
          class="w-10 h-10 flex items-center justify-center rounded-xl text-edu-navy dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :title="themeStore.theme === 'dark' ? (i18n.isFrench ? 'Mode clair' : 'Light mode') : (i18n.isFrench ? 'Mode sombre' : 'Dark mode')"
        >
          <SunIcon v-if="themeStore.theme === 'dark'" class="w-5 h-5 text-yellow-400" />
          <MoonIcon v-else class="w-5 h-5" />
        </button>
      </div>

      <main class="flex-1 pt-6 px-4 sm:px-6 lg:px-8 pb-10">
        <RouterView />
      </main>
    </div>
  </div>
</template>
