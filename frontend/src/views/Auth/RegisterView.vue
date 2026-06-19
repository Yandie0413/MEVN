<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/solid';

const router = useRouter();
const authStore = useAuthStore();
const i18n = useI18nStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const acceptTerms = ref(false);

const handleSubmit = async () => {
  errorMsg.value = '';
  if (!name.value || !email.value || !password.value) {
    errorMsg.value = i18n.t('auth.register.fillFields');
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = i18n.t('auth.register.passwordsNoMatch');
    return;
  }
  if (!acceptTerms.value) {
    errorMsg.value = i18n.t('auth.register.acceptTerms');
    return;
  }
  if (password.value.length < 6) {
    errorMsg.value = i18n.t('auth.register.passwordMin');
    return;
  }
  isLoading.value = true;
  await new Promise(r => setTimeout(r, 900));
  authStore.login(email.value);
  isLoading.value = false;
  router.push('/dashboard');
};

const passwordStrength = () => {
  const p = password.value;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9!@#$%^&*]/.test(p)) s++;
  return s;
};

const strengthLabel = computed(() => {
  const labels = i18n.isFrench 
    ? ['', 'Faible', 'Correct', 'Bon', 'Fort']
    : ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[passwordStrength()] || '';
});

const strengthColor = computed(() => {
  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  return colors[passwordStrength()] || '';
});
</script>

<template>
  <div class="min-h-screen flex font-sans bg-edu-bg dark:bg-gray-900">

    <!-- LEFT PANEL: Branding Visual -->
    <div class="hidden lg:flex flex-col flex-1 bg-edu-navy dark:bg-gray-900 text-white p-12 justify-between relative overflow-hidden">
      <!-- Blobs -->
      <div class="absolute top-0 right-0 w-72 h-72 bg-edu-lime/10 rounded-full -translate-y-1/3 translate-x-1/3"></div>
      <div class="absolute bottom-20 left-0 w-48 h-48 bg-white/5 dark:bg-gray-800/30 rounded-full -translate-x-1/2"></div>

      <RouterLink to="/" class="flex items-center gap-2.5 relative z-10 cursor-pointer hover:opacity-90 transition-opacity no-underline text-white">
        <div class="w-8 h-8 bg-edu-lime rounded-xl flex items-center justify-center">
          <div class="w-3 h-3 bg-edu-navy dark:bg-white rounded-full"></div>
        </div>
        <span class="font-extrabold text-xl tracking-tight">Curio</span>
      </RouterLink>

      <!-- Center -->
      <div class="relative z-10">
        <h2 class="text-5xl font-extrabold leading-tight mb-6" v-html="i18n.t('auth.register.startJourney')"></h2>
        <p class="text-gray-400 dark:text-gray-500 text-base leading-relaxed max-w-xs mb-10">
          {{ i18n.t('auth.register.joinStudents') }}
        </p>

        <!-- Steps -->
        <div class="flex flex-col gap-5">
          <div v-for="(step, i) in [i18n.t('auth.register.step1'), i18n.t('auth.register.step2'), i18n.t('auth.register.step3')]" :key="step"
               class="flex items-center gap-4">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                 :class="i === 0 ? 'bg-edu-lime text-edu-navy' : 'border border-white/20 text-gray-400 dark:border-gray-600 dark:text-gray-500'">
              {{ i + 1 }}
            </div>
            <span class="text-sm" :class="i === 0 ? 'text-white font-semibold' : 'text-gray-400 dark:text-gray-500'">{{ step }}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 relative z-10">
        <div v-for="s in [{ v: '25K+', l: i18n.t('auth.register.students') }, { v: '500+', l: i18n.t('auth.register.courses') }, { v: '98%', l: i18n.t('auth.register.satisfaction') }]" :key="s.v"
             class="text-center p-3 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10 dark:border-gray-700">
          <p class="text-2xl font-extrabold text-edu-lime">{{ s.v }}</p>
          <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{{ s.l }}</p>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: Register Form -->
    <div class="flex-1 flex flex-col justify-center items-center px-8 py-10 max-w-lg mx-auto w-full bg-edu-bg dark:bg-gray-900">

      <RouterLink to="/" class="lg:hidden flex items-center gap-2 mb-8 self-start cursor-pointer hover:opacity-90 transition-opacity no-underline">
        <div class="w-7 h-7 bg-edu-navy rounded-lg flex items-center justify-center">
          <div class="w-2.5 h-2.5 bg-edu-lime rounded-full"></div>
        </div>
        <span class="font-extrabold text-lg text-edu-navy">Curio</span>
      </RouterLink>

      <!-- Header -->
      <div class="w-full mb-7">
        <h1 class="text-3xl font-extrabold text-edu-navy dark:text-edu-navy mb-2">{{ i18n.t('auth.register.title') }}</h1>
        <p class="text-edu-text-muted dark:text-gray-400 text-sm">
          {{ i18n.t('auth.register.hasAccount') }}
          <button @click="router.push('/login')" class="font-bold text-edu-navy dark:text-edu-navy underline underline-offset-2 hover:no-underline ml-1">
            {{ i18n.t('auth.register.signin') }}
          </button>
        </p>
      </div>

      <!-- Social -->
      <div class="w-full flex gap-3 mb-6">
        <button class="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-edu-navy dark:text-edu-navy bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-soft">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-4 h-4" />
          {{ i18n.t('auth.register.socialGoogle') }}
        </button>
        <button class="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-edu-navy dark:text-edu-navy bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-soft">
          <span class="font-bold text-base">in</span>
          {{ i18n.t('auth.register.socialLinkedIn') }}
        </button>
      </div>

      <!-- Divider -->
      <div class="w-full flex items-center gap-3 mb-5">
        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        <span class="text-xs font-medium text-edu-text-muted dark:text-gray-400 whitespace-nowrap">{{ i18n.t('auth.register.orEmail') }}</span>
        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="w-full mb-4 p-3.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
        <ExclamationTriangleIcon class="w-5 h-5 flex-shrink-0" /> {{ errorMsg }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-4">

        <div class="flex flex-col gap-1.5">
          <label for="reg-name" class="text-sm font-semibold text-edu-navy dark:text-edu-navy">{{ i18n.t('auth.register.name') }}</label>
          <div class="relative">
            <UserIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input id="reg-name" type="text" v-model="name" :placeholder="i18n.t('auth.register.fullNamePlaceholder')" required
                   class="w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 focus:border-edu-lime transition-all placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="reg-email" class="text-sm font-semibold text-edu-navy dark:text-edu-navy">{{ i18n.t('auth.register.email') }}</label>
          <div class="relative">
            <EnvelopeIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input id="reg-email" type="email" v-model="email" placeholder="you@example.com" required
                   class="w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 focus:border-edu-lime transition-all placeholder-gray-400 dark:placeholder-gray-500" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="reg-pass" class="text-sm font-semibold text-edu-navy dark:text-edu-navy">{{ i18n.t('auth.register.password') }}</label>
          <div class="relative">
            <LockClosedIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input id="reg-pass" :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="••••••••" required
                   class="w-full pl-10 pr-16 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 focus:border-edu-lime transition-all placeholder-gray-400 dark:placeholder-gray-500" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-edu-navy dark:hover:text-edu-lime text-xs font-semibold">
              {{ showPassword ? 'HIDE' : 'SHOW' }}
            </button>
          </div>
          <!-- Password strength bar -->
          <div v-if="password" class="flex items-center gap-2 mt-1">
            <div class="flex gap-1 flex-1">
              <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300"
                   :class="i <= passwordStrength() ? strengthColor.value : 'bg-gray-200 dark:bg-gray-700'"></div>
            </div>
            <span class="text-xs font-semibold" :class="passwordStrength() <= 1 ? 'text-red-400' : passwordStrength() <= 2 ? 'text-orange-400' : 'text-green-500'">
              {{ strengthLabel.value }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="reg-confirm" class="text-sm font-semibold text-edu-navy dark:text-edu-navy">{{ i18n.t('auth.register.confirm') }}</label>
          <div class="relative">
            <LockClosedIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input id="reg-confirm" type="password" v-model="confirmPassword" placeholder="••••••••" required
                   class="w-full pl-10 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-edu-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-edu-lime/60 focus:border-edu-lime transition-all placeholder-gray-400 dark:placeholder-gray-500"
                   :class="confirmPassword && confirmPassword !== password ? 'border-red-300 focus:ring-red-200 dark:border-red-700' : ''" />
            <span v-if="confirmPassword && confirmPassword === password" class="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
          </div>
        </div>

        <!-- Terms -->
        <label class="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" v-model="acceptTerms" class="mt-1 w-4 h-4 accent-[#1E1F24] dark:accent-edu-lime rounded" />
          <span class="text-xs text-edu-text-muted dark:text-gray-400 leading-relaxed">
            {{ i18n.t('auth.register.termsAgree') }}
            <a href="#" class="font-semibold text-edu-navy dark:text-edu-navy underline hover:no-underline">{{ i18n.t('auth.register.termsOfService') }}</a>
            {{ i18n.t('auth.register.and') }}
            <a href="#" class="font-semibold text-edu-navy dark:text-edu-navy underline hover:no-underline">{{ i18n.t('auth.register.privacyPolicy') }}</a>
          </span>
        </label>

        <button type="submit" :disabled="isLoading"
                class="w-full py-4 bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold rounded-xl text-sm mt-1 hover:bg-gray-800 dark:hover:bg-lime-400 transition-all hover:scale-[1.01] shadow-soft disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ isLoading ? i18n.t('auth.register.creatingAccount') : i18n.t('auth.register.button') }}
        </button>
      </form>

      <p class="text-xs text-center text-edu-text-muted dark:text-gray-400 mt-6">
        {{ i18n.t('auth.register.byCreating') }}
        <a href="#" class="underline hover:text-edu-navy dark:hover:text-edu-lime">{{ i18n.t('footer.terms') }}</a>
        {{ i18n.t('auth.register.and') }}
        <a href="#" class="underline hover:text-edu-navy dark:hover:text-edu-lime">{{ i18n.t('footer.privacy') }}</a>.
      </p>
    </div>

  </div>
</template>
