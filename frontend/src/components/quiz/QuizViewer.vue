<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courseStore';
import { useI18nStore } from '@/stores/i18nStore';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  BookOpenIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  TrophyIcon
} from '@heroicons/vue/24/solid';

const props = defineProps<{
  chapterId: string
}>();

const emit = defineEmits(['quiz-completed', 'exit-quiz']);

const courseStore = useCourseStore();
const i18n = useI18nStore();
const router = useRouter();

// Dynamically fetch questions from current active chapter
const quizQuestions = computed(() => {
  return courseStore.activeChapter?.quizQuestions || [];
});

// Quiz state
const currentQuestionIndex = ref(0);
const selectedOptionId = ref<string | null>(null);
const showExplanation = ref(false);
const isCorrect = ref(false);

const answersLog = ref<Record<string, { selectedId: string; isCorrect: boolean }>>({});
const isQuizFinished = ref(false);
const finalScore = ref(0);
const isSubmitting = ref(false);
const certificateEarned = ref<{ id: string; code: string; score: number } | null>(null);

interface ConfettiPiece { id: number; left: string; delay: string; duration: string; color: string; rotate: string }
const confetti = ref<ConfettiPiece[]>([]);
const confettiColors = ['#D4F063', '#7c3aed', '#0ea5e9', '#f43f5e', '#f59e0b', '#10b981'];

function launchConfetti() {
  confetti.value = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.4}s`,
    duration: `${1.6 + Math.random() * 1}s`,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    rotate: `${Math.random() * 360}deg`
  }));
  setTimeout(() => { confetti.value = []; }, 3200);
}

// Reset quiz state when chapterId changes
watch(() => props.chapterId, () => {
  resetQuiz();
}, { immediate: true });

function resetQuiz() {
  currentQuestionIndex.value = 0;
  selectedOptionId.value = null;
  showExplanation.value = false;
  isCorrect.value = false;
  answersLog.value = {};
  isQuizFinished.value = false;
  finalScore.value = 0;
  isSubmitting.value = false;
  certificateEarned.value = null;
  confetti.value = [];
}

const currentQuestion = computed(() => {
  return quizQuestions.value[currentQuestionIndex.value] || null;
});

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === quizQuestions.value.length - 1;
});

function selectOption(optionId: string) {
  if (showExplanation.value) return; // Prevent changing answer after validation
  selectedOptionId.value = optionId;
}

function validateAnswer() {
  if (!currentQuestion.value || !selectedOptionId.value) return;
  
  const correctOption = currentQuestion.value.options.find((o) => o.isCorrect);
  isCorrect.value = selectedOptionId.value === correctOption?.id;
  
  answersLog.value[currentQuestion.value.id] = {
    selectedId: selectedOptionId.value,
    isCorrect: isCorrect.value
  };
  
  showExplanation.value = true;
}

async function nextQuestion() {
  if (isLastQuestion.value) {
    // Envoie les réponses au backend : la correction et le score sont calculés côté serveur
    isSubmitting.value = true;
    const answers = Object.entries(answersLog.value).map(([questionId, log]) => ({
      questionId,
      optionId: log.selectedId
    }));
    try {
      const result = await courseStore.submitQuiz(props.chapterId, answers);
      finalScore.value = result?.score ?? 0;
      certificateEarned.value = result?.certificate ?? null;
      isQuizFinished.value = true;
      if (finalScore.value >= 50) {
        launchConfetti();
      }
      emit('quiz-completed', finalScore.value);
    } finally {
      isSubmitting.value = false;
    }
  } else {
    // Go to next question
    currentQuestionIndex.value++;
    selectedOptionId.value = null;
    showExplanation.value = false;
    isCorrect.value = false;
  }
}

function getLetter(index: number) {
  return ['A', 'B', 'C', 'D', 'E'][index] || '';
}

function getOptionClass(optionId: string) {
  if (!showExplanation.value) {
    return selectedOptionId.value === optionId 
      ? 'border-[#a5b4fc] bg-indigo-50/50 text-[#4f46e5]' 
      : 'border-gray-200 bg-white text-edu-text-main hover:border-gray-300';
  }
  
  const option = currentQuestion.value?.options.find((o) => o.id === optionId);
  const isSelected = selectedOptionId.value === optionId;

  if (option?.isCorrect) {
    return 'border-emerald-500 bg-emerald-50 text-emerald-700';
  }

  if (isSelected && !option?.isCorrect) {
    return 'border-rose-500 bg-rose-50 text-rose-700';
  }
  
  return 'border-gray-100 bg-gray-50/50 text-gray-400 opacity-60';
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-4" v-if="currentQuestion && !isQuizFinished">
    <!-- Header info (matches Image 2 style) -->
    <div class="flex justify-between items-center text-xs font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
      <span>{{ i18n.t('course.question') }} {{ currentQuestionIndex + 1 }} / {{ quizQuestions.length }}</span>
      <span>{{ courseStore.currentCourse?.title }}</span>
    </div>
    <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
      <div
        class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
        :style="{ width: `${((currentQuestionIndex + (showExplanation ? 1 : 0)) / quizQuestions.length) * 100}%` }"
      ></div>
    </div>

    <!-- Active Quiz Card -->
    <div class="bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-soft dark:shadow-gray-900/50 border border-gray-100/50 dark:border-gray-700/50">
      <!-- Tag -->
      <div class="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 mb-4 tracking-wide uppercase">
        <BookOpenIcon class="w-4 h-4" />
        <span>{{ i18n.t('course.quiz') }}</span>
      </div>

      <!-- Question Text -->
      <h2 class="text-2xl font-extrabold text-edu-text-main dark:text-white mb-6 leading-snug">
        {{ currentQuestion.text }}
      </h2>

      <!-- Options -->
      <div class="flex flex-col gap-3 mb-8">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="option.id"
          @click="selectOption(option.id)"
          class="w-full text-left p-4 rounded-2xl border text-sm font-semibold transition-all duration-200 flex items-center gap-4 focus:outline-none"
          :class="getOptionClass(option.id)"
          :disabled="showExplanation"
        >
          <!-- Letter badge -->
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
            :class="[
              selectedOptionId === option.id && !showExplanation ? 'bg-indigo-600 text-white' : '',
              showExplanation && option.isCorrect ? 'bg-emerald-600 text-white' : '',
              showExplanation && selectedOptionId === option.id && !option.isCorrect ? 'bg-rose-600 text-white' : '',
              selectedOptionId !== option.id && (!showExplanation || !option.isCorrect) ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : ''
            ]"
          >
            {{ getLetter(index) }}
          </div>
          <span class="flex-1 text-edu-text-main dark:text-white">{{ option.text }}</span>
          
          <!-- Correct/Incorrect icons on validation -->
          <span v-if="showExplanation && option.isCorrect" class="text-emerald-600">
            <CheckCircleIcon class="w-5 h-5" />
          </span>
          <span v-if="showExplanation && selectedOptionId === option.id && !option.isCorrect" class="text-rose-600">
            <XCircleIcon class="w-5 h-5" />
          </span>
        </button>
      </div>

      <!-- Explanation Box -->
      <Transition name="slide-fade">
        <div v-if="showExplanation" class="bg-gray-50 dark:bg-gray-900/50 border-l-4 border-indigo-500 dark:border-indigo-400 rounded-r-2xl p-5 mb-8 text-sm text-edu-text-muted dark:text-gray-400">
          <strong class="text-edu-text-main dark:text-white font-bold block mb-1">{{ i18n.t('course.explanation') }}</strong>
          {{ currentQuestion.explanation }}
        </div>
      </Transition>

      <!-- Action Button -->
      <div class="flex justify-end">
        <button
          v-if="!showExplanation"
          @click="validateAnswer"
          :disabled="!selectedOptionId"
          class="bg-indigo-600 dark:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-2xl text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {{ i18n.t('course.validateAnswer') }}
        </button>
        <button
          v-else
          @click="nextQuestion"
          :disabled="isSubmitting"
          class="bg-indigo-600 dark:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-2xl text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? i18n.t('common.loading') : (isLastQuestion ? i18n.t('course.finishQuiz') : i18n.t('course.nextQuestion')) }}
          <ArrowRightIcon class="w-4 h-4" v-if="!isSubmitting" />
        </button>
      </div>
    </div>
  </div>

  <!-- Quiz Completed / Finished screen -->
  <div class="max-w-md mx-auto text-center py-10 relative" v-else-if="isQuizFinished">
    <!-- Confettis (succès uniquement) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-50" aria-hidden="true">
      <span
        v-for="piece in confetti"
        :key="piece.id"
        class="confetti-piece"
        :style="{
          left: piece.left,
          animationDelay: piece.delay,
          animationDuration: piece.duration,
          backgroundColor: piece.color,
          transform: `rotate(${piece.rotate})`
        }"
      ></span>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-soft dark:shadow-gray-900/50 border border-gray-100/50 dark:border-gray-700/50">
      <div class="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
           :class="finalScore >= 50 ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'">
        <TrophyIcon class="w-10 h-10" v-if="finalScore >= 50" />
        <XCircleIcon class="w-10 h-10" v-else />
      </div>
      
      <h2 class="text-2xl font-extrabold text-edu-text-main dark:text-white mb-2">{{ i18n.t('course.quizFinished') }}</h2>
      <p class="text-sm text-edu-text-muted dark:text-gray-400 mb-6">{{ i18n.t('course.finalScore') }}</p>

      <!-- Score display -->
      <div class="text-5xl font-black mb-6" :class="finalScore >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
        {{ finalScore }}%
      </div>

      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-8 text-sm text-edu-text-muted dark:text-gray-400">
        <p v-if="finalScore >= 50" class="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
          <SparklesIcon class="w-4 h-4 text-emerald-500" /> {{ i18n.t('course.congratsValidated') }}
        </p>
        <p v-else class="text-rose-700 dark:text-rose-400 font-semibold">
          {{ i18n.t('course.failedMinScore') }}
        </p>
      </div>

      <div v-if="certificateEarned" class="bg-amber-50 dark:bg-amber-900/30 border border-amber-200/60 dark:border-amber-800/50 rounded-2xl p-5 mb-6 flex flex-col items-center gap-3">
        <TrophyIcon class="w-8 h-8 text-amber-500" />
        <p class="text-sm font-extrabold text-amber-800 dark:text-amber-200">{{ i18n.t('certificates.unlocked') }}</p>
        <button
          @click="router.push(`/certificate/${certificateEarned.id}`)"
          class="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
        >
          {{ i18n.t('course.viewMyCert') }}
        </button>
      </div>

      <div class="flex flex-col gap-3">
        <button
          @click="resetQuiz"
          class="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <ArrowPathIcon class="w-4 h-4" /> {{ i18n.t('course.restartQuiz') }}
        </button>
        <button
          @click="emit('exit-quiz')"
          class="w-full bg-white dark:bg-gray-700 text-edu-text-main dark:text-white border border-gray-200 dark:border-gray-600 font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          {{ i18n.t('course.backToChapters') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.confetti-piece {
  position: absolute;
  top: -10px;
  width: 8px;
  height: 14px;
  opacity: 0.9;
  animation-name: confetti-fall;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-fill-mode: forwards;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(540deg);
    opacity: 0;
  }
}
</style>
