<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import { useThemeStore } from '@/stores/themeStore';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/solid';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const i18n = useI18nStore();
const themeStore = useThemeStore();

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = i18n.t('auth.login.fillFields');
    return;
  }
  errorMsg.value = '';
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || (i18n.isFrench ? 'Email ou mot de passe incorrect.' : 'Incorrect email or password.');
  } finally {
    isLoading.value = false;
  }
};

const features = computed(() => [
  { icon: AcademicCapIcon, label: i18n.t('auth.login.feature1') },
  { icon: ChartBarIcon, label: i18n.t('auth.login.feature2') },
  { icon: TrophyIcon, label: i18n.t('auth.login.feature3') },
]);
</script>

<template>
  <div class="min-h-screen flex font-sans bg-edu-bg dark:bg-gray-900 relative">

    <button
      @click="themeStore.toggleTheme()"
      class="fixed top-5 right-5 z-20 w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-soft text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :title="themeStore.theme === 'light' ? (i18n.isFrench ? 'Mode sombre' : 'Dark mode') : (i18n.isFrench ? 'Mode clair' : 'Light mode')"
    >
      <SunIcon v-if="themeStore.theme === 'dark'" class="w-5 h-5 text-yellow-400" />
      <MoonIcon v-else class="w-5 h-5" />
    </button>

    <!-- LEFT PANEL -->
    <div class="hidden lg:flex flex-col flex-1 bg-white dark:bg-gray-900 text-edu-navy dark:text-white p-12 justify-between relative overflow-hidden border-r border-gray-100 dark:border-transparent">
      <div class="absolute top-0 right-0 w-80 h-80 bg-edu-lime/20 dark:bg-edu-lime/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-60 h-60 bg-edu-lavender dark:bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <RouterLink to="/" class="flex items-center gap-2.5 relative z-10 cursor-pointer hover:opacity-90 transition-opacity no-underline text-edu-navy dark:text-white">
        <div class="w-8 h-8 bg-edu-lime rounded-xl flex items-center justify-center">
          <div class="w-3 h-3 bg-edu-navy dark:bg-white rounded-full"></div>
        </div>
        <span class="font-extrabold text-xl tracking-tight">Curio</span>
      </RouterLink>

      <!-- Center -->
      <div class="relative z-10">
        <h2 class="text-5xl font-extrabold leading-tight mb-6" v-html="i18n.t('auth.login.welcomeBack')"></h2>
        <p class="text-edu-text-muted dark:text-gray-500 text-base leading-relaxed max-w-xs mb-10">
          {{ i18n.t('auth.login.accessCourses') }}
        </p>
        <div class="flex flex-col gap-4">
          <div v-for="feat in features" :key="feat.label" class="flex items-center gap-3 text-sm">
            <div class="w-7 h-7 bg-edu-lime rounded-full flex items-center justify-center flex-shrink-0">
              <component :is="feat.icon" class="w-3.5 h-3.5 text-edu-navy" />
            </div>
            <span class="text-edu-text-muted dark:text-gray-400">{{ feat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Feature highlight -->
      <div class="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-5 relative z-10 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
        <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <TrophyIcon class="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <p class="text-sm font-bold text-edu-navy dark:text-white">{{ i18n.isFrench ? 'Un certificat à la clé' : 'A certificate on completion' }}</p>
          <p class="text-xs text-edu-text-muted dark:text-gray-400">{{ i18n.isFrench ? 'Termine un cours pour débloquer ton certificat vérifiable.' : 'Complete a course to unlock your verifiable certificate.' }}</p>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="flex-1 flex flex-col justify-center items-center px-8 py-12 max-w-lg mx-auto w-full bg-edu-bg dark:bg-gray-900">

      <RouterLink to="/" class="lg:hidden flex items-center gap-2 mb-10 self-start cursor-pointer hover:opacity-90 transition-opacity no-underline">
        <div class="w-7 h-7 bg-edu-navy dark:bg-edu-navy rounded-lg flex items-center justify-center">
          <div class="w-2.5 h-2.5 bg-edu-lime rounded-full"></div>
        </div>
        <span class="font-extrabold text-lg text-edu-navy dark:text-edu-navy">Curio</span>
      </RouterLink>

      <!-- Header -->
      <div class="w-full mb-8">
        <h1 class="text-3xl font-extrabold text-edu-navy dark:text-edu-navy mb-2">{{ i18n.t('auth.login.title') }}</h1>
        <p class="text-edu-text-muted dark:text-gray-400 text-sm">
          {{ i18n.t('auth.login.noAccount') }}
          <button @click="router.push('/register')" class="font-bold text-edu-navy dark:text-edu-navy underline underline-offset-2 hover:no-underline ml-1">{{ i18n.t('auth.login.signup') }}</button>
        </p>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="w-full mb-4 p-3.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
        <ExclamationTriangleIcon class="w-4 h-4 flex-shrink-0" />
        {{ errorMsg }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="login-email" class="text-sm font-semibold text-edu-navy dark:text-edu-navy">{{ i18n.t('auth.login.email') }}</label>
          <div class="relative">
            <EnvelopeIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input id="login-email" type="email" v-model="email" placeholder="you@example.com" required
                   class="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 focus:border-edu-lime transition-all placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <div class="flex justify-between items-center">
            <label for="login-pass" class="text-sm font-semibold text-edu-navy dark:text-edu-navy">{{ i18n.t('auth.login.password') }}</label>
            <a href="#" class="text-xs text-edu-text-muted dark:text-gray-400 hover:text-edu-navy dark:hover:text-edu-lime font-medium transition-colors">{{ i18n.t('auth.login.forgot') }}</a>
          </div>
          <div class="relative">
            <LockClosedIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input id="login-pass" :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="••••••••" required
                   class="w-full pl-11 pr-12 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 focus:border-edu-lime transition-all placeholder-gray-400 dark:placeholder-gray-500" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-edu-navy dark:hover:text-edu-lime transition-colors">
              <EyeSlashIcon v-if="showPassword" class="w-4 h-4" />
              <EyeIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button type="submit" :disabled="isLoading"
                class="w-full py-4 bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold rounded-xl text-sm mt-2 hover:bg-gray-800 dark:hover:bg-lime-400 transition-all hover:scale-[1.01] shadow-soft disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span v-if="!isLoading" class="flex items-center gap-2">{{ i18n.t('auth.login.button') }} <ArrowRightIcon class="w-4 h-4" /></span>
          <span v-else>{{ i18n.t('auth.login.signingIn') }}</span>
        </button>
      </form>

      <p class="text-xs text-center text-edu-text-muted dark:text-gray-400 mt-8">
        {{ i18n.t('auth.login.terms') }}
        <a href="#" class="underline hover:text-edu-navy dark:hover:text-edu-lime">{{ i18n.t('footer.terms') }}</a>
        {{ i18n.t('auth.login.and') }}
        <a href="#" class="underline hover:text-edu-navy dark:hover:text-edu-lime">{{ i18n.t('footer.privacy') }}</a>.
      </p>
    </div>
  </div>
</template>
