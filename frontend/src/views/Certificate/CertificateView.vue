<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useI18nStore } from '@/stores/i18nStore';
import {
  ArrowLeftIcon,
  PrinterIcon,
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/solid';

interface CertificateData {
  id: string;
  code: string;
  score: number;
  issuedAt: string;
  course: { id: string; title: string; titleEn?: string; category: string; categoryEn?: string; level?: string; levelEn?: string };
  user: { nom: string; email: string };
}

const route = useRoute();
const router = useRouter();
const i18n = useI18nStore();

const certificate = ref<CertificateData | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await api.get<CertificateData>(`/certificates/${route.params.id}`);
    certificate.value = data;
  } catch (e: any) {
    error.value = e.response?.data?.message || (i18n.isFrench ? 'Certificat introuvable.' : 'Certificate not found.');
  } finally {
    loading.value = false;
  }
});

const courseTitle = computed(() => {
  if (!certificate.value) return '';
  return i18n.locale === 'en' && certificate.value.course.titleEn ? certificate.value.course.titleEn : certificate.value.course.title;
});

const issuedDate = computed(() => {
  if (!certificate.value) return '';
  return new Date(certificate.value.issuedAt).toLocaleDateString(i18n.isFrench ? 'fr-FR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});

function print() {
  window.print();
}
</script>

<template>
  <div class="min-h-screen bg-edu-bg dark:bg-gray-900 font-sans py-10 px-4">
    <div class="max-w-3xl mx-auto no-print flex items-center justify-between mb-6">
      <button @click="router.back()" class="flex items-center gap-2 text-sm font-bold text-edu-navy dark:text-white hover:text-purple-600 dark:hover:text-edu-lime transition-colors">
        <ArrowLeftIcon class="w-4 h-4" /> {{ i18n.isFrench ? 'Retour' : 'Back' }}
      </button>
      <button
        v-if="certificate"
        @click="print"
        class="flex items-center gap-2 bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
      >
        <PrinterIcon class="w-4 h-4" /> {{ i18n.isFrench ? 'Télécharger en PDF' : 'Download as PDF' }}
      </button>
    </div>

    <div v-if="loading" class="max-w-3xl mx-auto text-center py-24 text-edu-text-muted dark:text-gray-400">
      {{ i18n.t('common.loading') }}
    </div>

    <div v-else-if="error" class="max-w-3xl mx-auto text-center py-24 text-rose-500 font-semibold">
      {{ error }}
    </div>

    <div v-else-if="certificate" id="certificate-card" class="max-w-3xl mx-auto">
      <div class="relative bg-white dark:bg-gray-800 rounded-[32px] shadow-2xl overflow-hidden border-[3px] border-edu-navy dark:border-edu-lime">
        <!-- Decorative top band -->
        <div class="h-3 bg-gradient-to-r from-edu-lime via-amber-300 to-edu-lime"></div>

        <div class="relative p-10 md:p-14 text-center">
          <!-- Corner stars -->
          <StarIcon class="absolute top-8 left-8 w-6 h-6 text-amber-400 opacity-70" />
          <StarIcon class="absolute top-8 right-8 w-6 h-6 text-amber-400 opacity-70" />
          <StarIcon class="absolute bottom-8 left-8 w-6 h-6 text-amber-400 opacity-70" />
          <StarIcon class="absolute bottom-8 right-8 w-6 h-6 text-amber-400 opacity-70" />

          <!-- Brand -->
          <div class="flex items-center justify-center gap-2.5 mb-8">
            <div class="w-9 h-9 bg-edu-navy dark:bg-edu-lime rounded-xl flex items-center justify-center">
              <div class="w-3 h-3 bg-edu-lime dark:bg-edu-navy rounded-full"></div>
            </div>
            <span class="font-extrabold text-xl text-edu-navy dark:text-white tracking-tight">Curio Academy</span>
          </div>

          <p class="text-[11px] font-black tracking-[0.25em] uppercase text-edu-text-muted dark:text-gray-400 mb-6">
            {{ i18n.isFrench ? 'Certificat d\'accomplissement' : 'Certificate of Achievement' }}
          </p>

          <div class="w-16 h-16 mx-auto bg-amber-400 text-white rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white dark:border-gray-800">
            <CheckBadgeIcon class="w-9 h-9" />
          </div>

          <p class="text-sm text-edu-text-muted dark:text-gray-400 font-medium mb-2">{{ i18n.isFrench ? 'Ce certificat est fièrement décerné à' : 'This certificate is proudly awarded to' }}</p>
          <h1 class="text-4xl md:text-5xl font-black text-edu-navy dark:text-white mb-6 tracking-tight" style="font-family: Georgia, serif;">
            {{ certificate.user.nom }}
          </h1>

          <p class="text-sm text-edu-text-muted dark:text-gray-400 font-medium mb-2">{{ i18n.isFrench ? 'pour avoir terminé avec succès le cours' : 'for successfully completing the course' }}</p>
          <h2 class="text-2xl font-extrabold text-purple-600 dark:text-edu-lime mb-8">« {{ courseTitle }} »</h2>

          <div class="flex items-center justify-center gap-4 mb-10">
            <span class="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-4 py-2 rounded-full">
              {{ i18n.t('course.score') }} : {{ certificate.score }}%
            </span>
            <span class="bg-gray-50 dark:bg-gray-700/50 text-edu-text-muted dark:text-gray-300 text-xs font-bold px-4 py-2 rounded-full">
              {{ i18n.isFrench ? 'Délivré le' : 'Issued on' }} {{ issuedDate }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-8 border-t border-dashed border-gray-200 dark:border-gray-700">
            <div class="text-left">
              <p class="text-[10px] font-bold text-edu-text-muted dark:text-gray-500 uppercase tracking-wider mb-1">{{ i18n.isFrench ? 'Code de vérification' : 'Verification code' }}</p>
              <p class="text-sm font-mono font-bold text-edu-navy dark:text-white">{{ certificate.code }}</p>
            </div>
            <div class="flex items-center gap-2 text-edu-text-muted dark:text-gray-500">
              <ShieldCheckIcon class="w-5 h-5" />
              <span class="text-[11px] font-semibold">Curio Academy</span>
            </div>
          </div>
        </div>
      </div>
      <p class="no-print text-center text-xs text-edu-text-muted dark:text-gray-500 mt-6">
        {{ i18n.isFrench ? 'Astuce : utilisez « Télécharger en PDF » puis choisissez « Enregistrer en PDF » dans la boîte d\'impression.' : 'Tip: use "Download as PDF" then choose "Save as PDF" in the print dialog.' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  #certificate-card {
    max-width: 100% !important;
  }
}
</style>
