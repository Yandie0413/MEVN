<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18nStore } from '@/stores/i18nStore';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import {
  HomeIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  UserIcon as UserIconOutline,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline';
import { UserIcon } from '@heroicons/vue/24/solid';

defineEmits(['navigate']);

const route = useRoute();
const router = useRouter();
const i18n = useI18nStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();

const navItems = computed(() => {
  const items = [
    { id: 'accueil',      label: i18n.t('sidebar.accueil'),      icon: HomeIcon,          to: '/dashboard' },
    { id: 'mes_cours',   label: i18n.t('sidebar.mescours'),    icon: BookOpenIcon,       to: '/dashboard/mes-cours' },
    { id: 'certificats', label: i18n.t('sidebar.certificats'),  icon: CheckBadgeIcon,     to: '/dashboard/certificats' },
    { id: 'profil',      label: i18n.t('sidebar.profil'),       icon: UserIconOutline,    to: '/dashboard/profil' },
  ];
  if (authStore.isTeacher) {
    items.splice(2, 0, { id: 'enseignement', label: i18n.isFrench ? 'Gestion de cours' : 'Manage courses', icon: AcademicCapIcon, to: '/dashboard/enseignement' });
  }
  return items;
});

function isActive(to: string) {
  if (to === '/dashboard') {
    return route.path === '/dashboard';
  }
  return route.path.startsWith(to);
}

function logout() {
  authStore.logout();
  router.push('/');
}

const xpPercent = computed(() => Math.round((authStore.xpIntoLevel / authStore.xpForNextLevel) * 100));
</script>

<template>
  <aside class="w-[260px] bg-white dark:bg-gray-900/80 backdrop-blur-xl h-full rounded-[28px] p-6 flex flex-col shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
    <!-- Logo -->
    <div class="flex items-center justify-between gap-3 mb-8 px-2 flex-shrink-0">
      <RouterLink to="/" class="flex items-center gap-3 cursor-pointer no-underline text-edu-navy dark:text-white hover:opacity-90 transition-opacity">
        <div class="w-10 h-10 bg-edu-lime rounded-xl flex items-center justify-center">
          <div class="w-3.5 h-3.5 bg-edu-navy dark:bg-white rounded-full"></div>
        </div>
        <span class="font-extrabold text-2xl tracking-wide">Curio</span>
      </RouterLink>
      <button
        @click="themeStore.toggleTheme()"
        class="w-9 h-9 flex-shrink-0 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-500 hover:text-edu-navy dark:text-gray-300 dark:hover:text-white transition-colors"
        :title="themeStore.theme === 'light' ? (i18n.isFrench ? 'Mode sombre' : 'Dark mode') : (i18n.isFrench ? 'Mode clair' : 'Light mode')"
      >
        <SunIcon v-if="themeStore.theme === 'dark'" class="w-5 h-5 text-yellow-400" />
        <MoonIcon v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-hide pb-4">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to"
        @click="$emit('navigate')"
        class="flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium no-underline"
        :class="isActive(item.to)
          ? 'bg-edu-lime text-edu-navy dark:text-edu-navy shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-edu-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'"
      >
        <div class="flex items-center gap-4">
          <component :is="item.icon" class="w-6 h-6" />
          <span class="text-[15px] font-semibold">{{ item.label }}</span>
        </div>
      </RouterLink>
    </nav>

    <!-- Logout Button -->
    <button
      @click="logout"
      class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 flex-shrink-0 mb-3"
    >
      <ArrowRightOnRectangleIcon class="w-5 h-5 flex-shrink-0" />
      <span class="text-[14px] font-semibold">{{ i18n.t('sidebar.deconnexion') }}</span>
    </button>

    <!-- Profile Widget -->
    <div class="mt-auto bg-edu-lime dark:bg-lime-400 rounded-[24px] p-5 text-edu-navy relative shadow-soft flex-shrink-0">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-white dark:bg-white rounded-full flex items-center justify-center text-gray-400 flex-shrink-0 overflow-hidden shadow-sm">
          <UserIcon class="w-7 h-7" />
        </div>
        <div class="min-w-0">
          <h4 class="font-bold text-sm leading-tight truncate">{{ authStore.user?.name || '...' }}</h4>
          <p class="text-[11px] text-edu-navy/70 dark:text-edu-navy/70 font-medium mt-0.5">{{ i18n.t('sidebar.level') }} {{ authStore.level }} · {{ i18n.t('sidebar.explorer') }}</p>
        </div>
      </div>

      <div class="flex justify-between text-xs text-edu-navy/80 dark:text-edu-navy/80 mb-2 font-bold">
        <span>{{ authStore.xpIntoLevel }} XP</span>
        <span>{{ authStore.xpForNextLevel }} XP</span>
      </div>
      <div class="h-2 bg-edu-navy/10 dark:bg-edu-navy/20 rounded-full overflow-hidden">
        <div class="h-full bg-edu-navy rounded-full transition-all duration-700" :style="{ width: xpPercent + '%' }"></div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
