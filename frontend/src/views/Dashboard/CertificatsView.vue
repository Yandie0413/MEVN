<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useCourseStore } from '@/stores/courseStore';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import {
  MagnifyingGlassIcon,
  FireIcon,
  TrophyIcon,
  ArrowDownTrayIcon,
  StarIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/vue/24/solid';

interface CertificateEntry {
  id: string;
  code: string;
  score: number;
  issuedAt: string;
  course: { id: string; title: string; titleEn?: string; category: string; bgColor: string; iconColor: string };
}

const router = useRouter();
const courseStore = useCourseStore();
const authStore = useAuthStore();
const i18n = useI18nStore();

const certificates = ref<CertificateEntry[]>([]);
const loading = ref(true);
const searchTerm = ref('');
function submitSearch() {
  if (!searchTerm.value.trim()) return;
  router.push({ path: '/dashboard/mes-cours', query: { q: searchTerm.value.trim() } });
}

onMounted(async () => {
  try {
    const { data } = await api.get<CertificateEntry[]>('/certificates/me');
    certificates.value = data;
  } finally {
    loading.value = false;
  }
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(i18n.isFrench ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function courseTitle(course: CertificateEntry['course']) {
  return i18n.locale === 'en' && course.titleEn ? course.titleEn : course.title;
}

// Find the course with progress > 0 and < 100 that is closest to completion
const nextCert = computed(() => {
  const activeUncompleted = courseStore.courses
    .filter(c => c.progress > 0 && c.progress < 100)
    .sort((a, b) => b.progress - a.progress);
  return activeUncompleted[0] || null;
});

const avgScore = computed(() => {
  if (certificates.value.length === 0) return 0;
  return Math.round(certificates.value.reduce((sum, c) => sum + c.score, 0) / certificates.value.length);
});

// Répartition de la progression sur tous les cours suivis (pour la visualisation)
const progressBreakdown = computed(() => {
  return courseStore.courses
    .filter(c => c.progress > 0)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 6);
});

function download(id: string) {
  router.push(`/certificate/${id}`);
}
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

    <!-- Stats row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50 flex items-center gap-4">
        <div class="w-12 h-12 bg-edu-rose dark:bg-rose-900/40 rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0"><CheckBadgeIcon class="w-6 h-6" /></div>
        <div><p class="text-2xl font-extrabold text-edu-text-main dark:text-white">{{ certificates.length }}</p><p class="text-xs text-edu-text-muted dark:text-gray-400 font-medium">{{ i18n.t('certificates.completed') }}</p></div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50 flex items-center gap-4">
        <div class="w-12 h-12 bg-edu-lavender dark:bg-purple-900/40 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0"><ChartBarIcon class="w-6 h-6" /></div>
        <div><p class="text-2xl font-extrabold text-edu-text-main dark:text-white">{{ avgScore }}%</p><p class="text-xs text-edu-text-muted dark:text-gray-400 font-medium">{{ i18n.t('certificates.avgScore') }}</p></div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50 flex items-center gap-4">
        <div class="w-12 h-12 bg-edu-green dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0"><StarIcon class="w-6 h-6" /></div>
        <div><p class="text-2xl font-extrabold text-edu-text-main dark:text-white">{{ authStore.stats.totalXp }}</p><p class="text-xs text-edu-text-muted dark:text-gray-400 font-medium">{{ i18n.t('certificates.totalXP') }}</p></div>
      </div>
    </div>

    <!-- Progress breakdown chart -->
    <div v-if="progressBreakdown.length > 0" class="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft dark:shadow-gray-900/50 mb-8">
      <h2 class="font-extrabold text-edu-text-main dark:text-white mb-5">{{ i18n.isFrench ? 'Progression par cours' : 'Progress by course' }}</h2>
      <div class="flex flex-col gap-4">
        <div v-for="c in progressBreakdown" :key="c.id" class="flex items-center gap-4">
          <span class="text-xs font-bold text-edu-text-main dark:text-white w-40 truncate flex-shrink-0">{{ c.title }}</span>
          <div class="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="c.progress === 100 ? 'bg-emerald-500' : 'bg-edu-lime'"
              :style="{ width: c.progress + '%' }"
            ></div>
          </div>
          <span class="text-xs font-bold text-edu-text-muted dark:text-gray-400 w-10 text-right flex-shrink-0">{{ c.progress }}%</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16 text-edu-text-muted dark:text-gray-400">{{ i18n.t('common.loading') }}</div>

    <!-- Certificates Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">

      <div
        v-for="cert in certificates"
        :key="cert.id"
        class="bg-white dark:bg-gray-800 rounded-[28px] overflow-hidden shadow-soft dark:shadow-gray-900/50 flex flex-col justify-between"
      >
        <div class="relative p-8 flex flex-col items-center text-center flex-1" :class="cert.course.bgColor">
          <StarIcon class="absolute top-4 left-4 w-6 h-6 text-yellow-400 opacity-80" />
          <StarIcon class="absolute top-4 right-4 w-6 h-6 text-yellow-400 opacity-80" />
          <StarIcon class="absolute bottom-4 left-4 w-6 h-6 text-yellow-400 opacity-80" />
          <StarIcon class="absolute bottom-4 right-4 w-6 h-6 text-yellow-400 opacity-80" />

          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background: rgba(255,255,255,0.35)">
            <CheckBadgeIcon class="w-9 h-9" :style="{ color: cert.course.iconColor }" />
          </div>

          <p class="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style="color: rgba(255,255,255,0.75)">
            {{ i18n.isFrench ? 'Certificat d\'accomplissement' : 'Certificate of Achievement' }}
          </p>
          <div class="w-12 border-t mb-4" style="border-color: rgba(255,255,255,0.4)"></div>

          <p class="text-xs font-medium mb-1" style="color: rgba(255,255,255,0.8)">{{ i18n.isFrench ? 'Décerné à' : 'Awarded to' }}</p>
          <h2 class="text-xl font-extrabold text-white mb-2">{{ authStore.user?.name }}</h2>
          <p class="text-xs font-medium mb-2" style="color: rgba(255,255,255,0.8)">{{ i18n.isFrench ? 'pour avoir terminé' : 'for completing' }}</p>
          <p class="text-sm font-extrabold text-white mb-5">« {{ courseTitle(cert.course) }} »</p>

          <div class="bg-white/90 rounded-full px-5 py-2 flex items-center gap-2 mb-4 shadow-sm">
            <CheckBadgeIcon class="w-4 h-4 text-edu-navy" />
            <span class="text-xs font-bold text-edu-navy">{{ i18n.t('course.score') }} : {{ cert.score }}%</span>
          </div>

          <p class="text-[10px] font-medium" style="color: rgba(255,255,255,0.65)">{{ i18n.isFrench ? 'Délivré le' : 'Issued on' }} {{ formatDate(cert.issuedAt) }}</p>
        </div>

        <div class="flex items-center gap-3 p-4">
          <button @click="download(cert.id)" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm">
            <ArrowDownTrayIcon class="w-4 h-4" />
            {{ i18n.t('certificates.download') }}
          </button>
        </div>
      </div>

      <!-- Next Certificate CTA -->
      <div v-if="nextCert" class="bg-white dark:bg-gray-800 rounded-[28px] shadow-soft dark:shadow-gray-900/50 flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div class="w-16 h-16 bg-edu-orange dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-5 shadow-soft">
          <AcademicCapIcon class="w-8 h-8 text-orange-500" />
        </div>
        <h3 class="text-base font-extrabold text-edu-text-main dark:text-white mb-2">{{ i18n.t('certificates.nextCertificate') }}</h3>
        <p class="text-sm text-edu-text-muted dark:text-gray-400 mb-6 leading-relaxed">
          {{ i18n.isFrench ? 'Continue' : 'Continue' }} <strong class="text-edu-text-main dark:text-white font-bold">{{ nextCert.title }}</strong><br/>
          {{ i18n.t('certificates.toUnlock') }} !
        </p>
        <div class="w-full mb-2">
          <div class="flex justify-between text-[11px] font-bold text-edu-text-muted dark:text-gray-400 mb-2">
            <span>{{ i18n.t('certificates.progress') }}</span>
            <span class="text-edu-text-main dark:text-white">{{ nextCert.progress }}%</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div class="h-full bg-edu-lime dark:bg-lime-400 rounded-full transition-all duration-500" :style="{ width: `${nextCert.progress}%` }"></div>
          </div>
        </div>
        <button @click="router.push(`/course/${nextCert.id}`)" class="mt-6 bg-edu-lime dark:bg-lime-400 text-edu-navy dark:text-edu-navy font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#c5e64d] dark:hover:bg-lime-300 transition-colors shadow-sm">
          <RocketLaunchIcon class="w-4 h-4" />
          {{ i18n.t('certificates.continueCourse') }}
        </button>
      </div>

      <div v-if="certificates.length === 0 && !nextCert" class="col-span-1 sm:col-span-2 bg-white dark:bg-gray-800 rounded-[28px] p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
        <TrophyIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-edu-text-main dark:text-white font-bold mb-1">{{ i18n.t('certificates.noCertificates') }}</p>
        <p class="text-sm text-edu-text-muted dark:text-gray-400 mb-6">{{ i18n.t('certificates.noCertificatesDesc') }}</p>
        <button @click="router.push('/dashboard/mes-cours')" class="bg-edu-lime text-edu-navy font-bold px-6 py-3 rounded-2xl text-sm hover:bg-[#c5e64d] transition-colors">
          {{ i18n.t('dashboard.exploreCourses') }}
        </button>
      </div>

    </div>
  </div>
</template>
