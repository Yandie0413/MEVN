<script setup lang="ts">
import { computed } from 'vue';
import { useI18nStore } from '@/stores/i18nStore';
import { useCourseStore } from '@/stores/courseStore';
import type { Chapter } from '@/stores/courseStore';
import { FilmIcon, PlayIcon, CheckCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  chapter: Chapter | null
}>();

const emit = defineEmits(['lesson-completed']);

const courseStore = useCourseStore();
const i18n = useI18nStore();

const handleComplete = () => {
  if (props.chapter) {
    courseStore.markChapterCompleted(props.chapter.id);
    emit('lesson-completed', props.chapter.id);
  }
};

const localizedTitle = computed(() => {
  if (!props.chapter) return '';
  if (i18n.locale === 'en' && props.chapter.titleEn) return props.chapter.titleEn;
  return props.chapter.title;
});

const localizedContent = computed(() => {
  if (!props.chapter) return '';
  if (i18n.locale === 'en' && props.chapter.contentEn) return props.chapter.contentEn;
  return props.chapter.content || '';
});
</script>

<template>
  <div class="flex flex-col gap-6" v-if="chapter">
    <!-- Video Player / Simulated Video -->
    <div v-if="chapter.type === 'video'" class="flex flex-col">
      <div v-if="chapter.videoUrl" class="w-full aspect-video rounded-3xl overflow-hidden shadow-soft mb-6 border border-gray-200/50 dark:border-gray-700/50">
        <iframe 
          class="w-full h-full"
          :src="chapter.videoUrl" 
          title="Video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
        ></iframe>
      </div>
      <div v-else class="w-full aspect-video bg-[#1e293b] rounded-3xl flex flex-col items-center justify-center text-white relative overflow-hidden shadow-soft mb-6">
        <div class="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <span class="flex items-center gap-2 font-bold z-10 text-lg mb-4 text-gray-300">
          <FilmIcon class="w-6 h-6 text-edu-lime" /> {{ i18n.t('course.quiz') }}: {{ chapter.title }}
        </span>
        <button class="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 hover:scale-110 transition-all duration-200 z-10 shadow-md">
          <PlayIcon class="w-8 h-8 ml-1" />
        </button>
        <span class="text-xs text-gray-400 mt-4 z-10 font-medium">{{ i18n.isFrench ? 'Cliquez pour lancer la simulation' : 'Click to start simulation' }}</span>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100/50 dark:border-gray-700/50 shadow-soft dark:shadow-gray-900/50">
        <h3 class="font-extrabold text-edu-text-main dark:text-white text-lg mb-2">{{ i18n.isFrench ? 'Description du cours' : 'Course description' }}</h3>
        <p class="text-sm text-edu-text-muted dark:text-gray-400 leading-relaxed font-medium">
          {{ localizedContent || (i18n.isFrench ? 'Regardez cette vidéo attentivement pour acquérir les connaissances nécessaires. Ce chapitre est une étape clé pour votre progression globale et l\'obtention de votre certificat officiel.' : 'Watch this video carefully to acquire the necessary knowledge. This chapter is a key step for your overall progress and obtaining your official certificate.') }}
        </p>
      </div>
    </div>

    <!-- Text / Markdown content -->
    <div v-else-if="chapter.type === 'text' || chapter.type === 'markdown'" class="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100/50 dark:border-gray-700/50 shadow-soft dark:shadow-gray-900/50">
      <div class="prose max-w-none">
        <h2 class="text-2xl font-black text-edu-text-main dark:text-white mb-6">{{ localizedTitle }}</h2>
        <div class="text-sm text-edu-text-muted dark:text-gray-400 leading-relaxed font-medium whitespace-pre-line">
          {{ localizedContent || (i18n.isFrench ? 'Contenu en cours de chargement...' : 'Content loading...') }}
        </div>
      </div>
    </div>

    <!-- Action pour terminer le chapitre (sauf pour les quiz) -->
    <div class="flex justify-end mt-4">
      <button 
        v-if="!chapter.completed" 
        @click="handleComplete"
        class="bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold px-6 py-3.5 rounded-2xl text-sm hover:bg-opacity-90 dark:hover:bg-lime-400 transition-all shadow-sm flex items-center gap-2"
      >
        {{ i18n.isFrench ? 'Marquer comme terminé et continuer' : 'Mark as completed and continue' }}
      </button>
      <div v-else class="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800 font-bold px-6 py-3 rounded-2xl text-sm">
        <CheckCircleIcon class="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> {{ i18n.isFrench ? 'Chapitre validé' : 'Chapter validated' }}
      </div>
    </div>
  </div>
</template>
