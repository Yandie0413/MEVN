<template>
  <div v-if="course" class="quiz-container">
    <router-link :to="'/course/' + course.id" class="btn-back">⬅️ Quitter le quiz</router-link>
    
    <header class="quiz-header">
      <h1>{{ course.title }}</h1>
      <div class="badge-quiz">Évaluation finale</div>
    </header>

    <form @submit.prevent="submitQuiz" v-if="!quizSubmitted" class="quiz-form">
      <div v-for="(q, index) in course.quiz.questions" :key="q.id" class="question-card">
        <div class="question-num">Question {{ index + 1 }}</div>
        <p class="question-text">{{ q.questionText }}</p>
        
        <div class="options-grid">
          <label 
            v-for="option in q.options" 
            :key="option" 
            class="option-card"
            :class="{ selected: userAnswers[q.id] === option }"
          >
            <input 
              type="radio" 
              :name="'question-' + q.id" 
              :value="option" 
              v-model="userAnswers[q.id]"
              required
              class="hidden-radio"
            />
            <div class="custom-radio-circle"></div>
            <span class="option-text">{{ option }}</span>
          </label>
        </div>
      </div>

      <button type="submit" class="btn-submit">Valider mes réponses →</button>
    </form>

    <!-- ZONE DE CORRECTION AUTOMATIQUE STYLE DASHBOARD -->
    <div v-else class="results-section">
      <div class="score-card" :class="{ success: score >= 50 }">
        <div class="circle-score">{{ score }}<span>%</span></div>
        <h2>{{ score >= 50 ? 'Félicitations ! module validé' : 'Évaluation non validée' }}</h2>
        <p>{{ score >= 50 ? 'Le certificat de cette formation est désormais débloqué sur votre profil.' : 'Prenez le temps de relire les chapitres et retentez votre chance !' }}</p>
      </div>

      <h3 class="section-title">Analyse de vos réponses :</h3>
      
      <div v-for="(q, index) in course.quiz.questions" :key="q.id" class="correction-card">
        <div class="correction-header">
          <span class="q-num">Question {{ index + 1 }}</span>
          <span :class="userAnswers[q.id] === q.correctAnswer ? 'badge-correct' : 'badge-wrong'">
            {{ userAnswers[q.id] === q.correctAnswer ? '✔ Correct' : '❌ Erreur' }}
          </span>
        </div>
        <p class="question-text-fix">{{ q.questionText }}</p>
        
        <div class="answers-summary">
          <div class="answer-row">
            <span class="label">Votre choix :</span>
            <span :class="userAnswers[q.id] === q.correctAnswer ? 'text-success' : 'text-danger'">{{ userAnswers[q.id] }}</span>
          </div>
          <div v-if="userAnswers[q.id] !== q.correctAnswer" class="answer-row correct-row">
            <span class="label">Bonne réponse :</span>
            <span class="text-success-bold">{{ q.correctAnswer }}</span>
          </div>
        </div>
      </div>

      <div class="result-actions">
        <button @click="resetQuiz" class="btn-retry">Recommencer l'évaluation</button>
        <router-link to="/profile" class="btn-profile-go">🏆 Aller voir mes certificats</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { courses } from '../data/coursesMock.js';

export default {
  name: 'QuizView',
  props: ['id'],
  data() {
    return {
      course: null,
      userAnswers: {},
      quizSubmitted: false,
      score: 0
    };
  },
  created() {
    const courseId = parseInt(this.id);
    this.course = courses.find(c => c.id === courseId);
  },
  methods: {
    submitQuiz() {
      let correctCount = 0;
      const questions = this.course.quiz.questions;

      questions.forEach(q => {
        if (this.userAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });

      this.score = Math.round((correctCount / questions.length) * 100);
      this.quizSubmitted = true;

      if (this.score >= 50) {
        this.course.certified = true;
      }
    },
    resetQuiz() {
      this.userAnswers = {};
      this.quizSubmitted = false;
      this.score = 0;
    }
  }
};
</script>

<style scoped>
.quiz-container { max-width: 760px; margin: 3rem auto; padding: 0 1.5rem; }
.btn-back { color: #64748b; text-decoration: none; font-size: 0.9rem; font-weight: 500; display: inline-block; margin-bottom: 1.5rem; }
.quiz-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
.quiz-header h1 { font-size: 1.8rem; color: #0f172a; margin: 0; font-weight: 800; }
.badge-quiz { background-color: #f1f5f9; color: #334155; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; }

.question-card { background: white; padding: 2rem; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; }
.question-num { font-size: 0.8rem; text-transform: uppercase; color: #3b82f6; font-weight: 700; margin-bottom: 0.5rem; }
.question-text { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 1.5rem 0; }

.options-grid { display: flex; flex-direction: column; gap: 0.75rem; }
.option-card { display: flex; align-items: center; padding: 1rem 1.25rem; border-radius: 12px; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.2s ease; }
.option-card:hover { border-color: #cbd5e1; background-color: #f8fafc; }
.option-card.selected { border-color: #2563eb; background-color: #eff6ff; }

.hidden-radio { display: none; }
.custom-radio-circle { width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 50%; margin-right: 12px; position: relative; }
.option-card.selected .custom-radio-circle { border-color: #2563eb; }
.option-card.selected .custom-radio-circle::after { content: ''; width: 10px; height: 10px; background-color: #2563eb; border-radius: 50%; position: absolute; top: 2px; left: 2px; }
.option-text { font-size: 1rem; color: #334155; font-weight: 500; }

.btn-submit { display: block; width: 100%; background-color: #0f172a; color: white; border: none; padding: 1rem; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 2rem; transition: background-color 0.2s; }
.btn-submit:hover { background-color: #1e293b; }

/* Correction & resultats */
.score-card { text-align: center; background-color: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; padding: 3rem; border-radius: 24px; margin-bottom: 3rem; }
.score-card.success { background-color: #ecfdf5; border-color: #d1fae5; color: #065f46; }
.circle-score { width: 90px; height: 90px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; font-size: 2rem; font-weight: 800; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.circle-score span { font-size: 1.2rem; font-weight: 600; }
.score-card h2 { font-size: 1.6rem; margin: 0 0 0.5rem 0; font-weight: 800; }
.score-card p { margin: 0; font-size: 1rem; opacity: 0.9; }

.section-title { font-size: 1.25rem; color: #0f172a; font-weight: 700; margin-bottom: 1.5rem; }
.correction-card { background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 1rem; }
.correction-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.q-num { font-size: 0.85rem; font-weight: 600; color: #64748b; }
.badge-correct { background-color: #d1fae5; color: #065f46; font-size: 0.8rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 6px; }
.badge-wrong { background-color: #fee2e2; color: #991b1b; font-size: 0.8rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 6px; }
.question-text-fix { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 1rem 0; }

.answers-summary { background-color: #f8fafc; padding: 1rem; border-radius: 10px; font-size: 0.95rem; }
.answer-row { display: flex; justify-content: space-between; padding: 0.25rem 0; }
.answer-row .label { color: #64748b; }
.text-success { color: #10b981; font-weight: 600; }
.text-danger { color: #ef4444; font-weight: 600; }
.correct-row { border-top: 1px dashed #e2e8f0; margin-top: 0.5rem; padding-top: 0.5rem; }
.text-success-bold { color: #059669; font-weight: 700; }

.result-actions { display: flex; gap: 1rem; margin-top: 2.5rem; }
.btn-retry { flex: 1; background-color: #ffffff; border: 2px solid #e2e8f0; color: #334155; padding: 0.9rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-retry:hover { border-color: #cbd5e1; background-color: #f1f5f9; }
.btn-profile-go { flex: 1.5; text-align: center; background-color: #2563eb; color: white; padding: 0.9rem; border-radius: 12px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
.btn-profile-go:hover { background-color: #1d4ed8; }
</style>