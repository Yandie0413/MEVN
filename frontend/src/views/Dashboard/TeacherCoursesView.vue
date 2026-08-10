<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore';
import { useI18nStore } from '@/stores/i18nStore';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BookOpenIcon,
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/solid';

const router = useRouter();
const courseStore = useCourseStore();
const i18n = useI18nStore();

const deletingId = ref<string | null>(null);

onMounted(() => {
  courseStore.fetchMyTeachingCourses();
});

function createNew() {
  router.push('/dashboard/enseignement/new');
}

function edit(id: string) {
  router.push(`/dashboard/enseignement/${id}`);
}

async function remove(id: string) {
  const ok = window.confirm(i18n.isFrench ? 'Supprimer définitivement ce cours et toute la progression associée ?' : 'Permanently delete this course and all associated progress?');
  if (!ok) return;
  deletingId.value = id;
  try {
    await courseStore.deleteCourseById(id);
  } finally {
    deletingId.value = null;
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-3xl font-extrabold text-edu-text-main dark:text-white">{{ i18n.isFrench ? 'Gestion de mes cours' : 'Manage My Courses' }}</h1>
          <div class="w-9 h-9 bg-edu-lavender dark:bg-purple-900/50 rounded-full flex items-center justify-center">
            <AcademicCapIcon class="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <p class="text-edu-text-muted dark:text-gray-400 text-sm font-medium">{{ i18n.isFrench ? 'Crée, modifie et publie tes cours, chapitres et quiz.' : 'Create, edit and publish your courses, chapters and quizzes.' }}</p>
      </div>
      <button
        @click="createNew"
        class="self-start bg-edu-navy dark:bg-edu-lime text-white dark:text-edu-navy font-bold px-5 py-3 rounded-2xl text-sm flex items-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] shadow-sm flex-shrink-0"
      >
        <PlusIcon class="w-4 h-4" /> {{ i18n.isFrench ? 'Nouveau cours' : 'New course' }}
      </button>
    </div>

    <div v-if="courseStore.teachingLoading" class="text-center py-20 text-edu-text-muted dark:text-gray-400">
      {{ i18n.t('common.loading') }}
    </div>

    <div v-else-if="courseStore.teachingCourses.length === 0" class="bg-white dark:bg-gray-800 rounded-[28px] p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
      <BookOpenIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <p class="text-edu-text-main dark:text-white font-bold mb-1">{{ i18n.isFrench ? 'Aucun cours pour le moment' : 'No courses yet' }}</p>
      <p class="text-sm text-edu-text-muted dark:text-gray-400 mb-6">{{ i18n.isFrench ? 'Crée ton premier cours pour commencer à enseigner.' : 'Create your first course to start teaching.' }}</p>
      <button @click="createNew" class="bg-edu-lime text-edu-navy font-bold px-6 py-3 rounded-2xl text-sm hover:bg-[#c5e64d] transition-colors">
        {{ i18n.isFrench ? 'Créer un cours' : 'Create a course' }}
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
      <div
        v-for="course in courseStore.teachingCourses"
        :key="course.id"
        class="bg-white dark:bg-gray-800 rounded-[24px] p-5 shadow-soft dark:shadow-gray-900/50 flex flex-col"
      >
        <div class="h-32 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden" :class="course.bgColor">
          <BookOpenIcon class="w-12 h-12 opacity-60" :style="{ color: course.iconColor }" />
          <span
            class="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            :class="course.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
          >
            <EyeIcon v-if="course.published" class="w-3 h-3" />
            <EyeSlashIcon v-else class="w-3 h-3" />
            {{ course.published ? (i18n.isFrench ? 'Publié' : 'Published') : (i18n.isFrench ? 'Brouillon' : 'Draft') }}
          </span>
        </div>
        <h3 class="font-extrabold text-edu-text-main dark:text-white text-base mb-1">{{ course.title }}</h3>
        <p class="text-[12px] text-edu-text-muted dark:text-gray-400 mb-4">{{ course.category }} · {{ course.chapters.length }} {{ i18n.t('dashboard.chapters') }}</p>
        <div class="flex items-center gap-2 mt-auto">
          <button
            @click="edit(course.id)"
            class="flex-1 bg-edu-navy dark:bg-gray-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <PencilSquareIcon class="w-3.5 h-3.5" /> {{ i18n.t('common.edit') }}
          </button>
          <button
            @click="remove(course.id)"
            :disabled="deletingId === course.id"
            class="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors disabled:opacity-50"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
