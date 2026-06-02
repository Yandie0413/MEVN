<template>
  <div v-if="course" class="course-layout">
    <!-- 1. BARRE LATÉRALE MODERNE -->
    <aside class="sidebar">
      <router-link to="/" class="btn-back">
        <span class="arrow">←</span> Retour au catalogue
      </router-link>
      
      <h2 class="course-title">{{ course.title }}</h2>
      
      <!-- Zone Progression Restylisée -->
      <div class="progress-zone">
        <div class="progress-text-row">
          <span>Votre progression</span>
          <strong>{{ calculateProgress }}%</strong>
        </div>
        <div class="bar-bg">
          <div class="bar-fill" :style="{ width: calculateProgress + '%' }"></div>
        </div>
      </div>

      <nav class="chapters-list">
        <h3>Chapitres du module</h3>
        <ul>
          <li 
            v-for="(chapter, index) in course.chapters" 
            :key="chapter.id"
            :class="{ active: currentChapterIndex === index }"
            @click="currentChapterIndex = index"
          >
            <div class="checkbox-wrapper">
              <input 
                type="checkbox" 
                v-model="chapter.isCompleted" 
                @click.stop 
                class="modern-checkbox"
              />
            </div>
            <span class="chapter-title">{{ chapter.title }}</span>
          </li>
        </ul>
      </nav>

      <!-- Zone d'action Quiz en bas -->
      <div class="quiz-zone" v-if="course.quiz">
        <router-link :to="'/quiz/' + course.id" class="btn-quiz">
          📝 Passer le Quiz de validation
        </router-link>
      </div>
    </aside>

    <!-- 2. ZONE DE LECTURE PRINCIPALE -->
    <main class="content-area">
      <div class="content-max-width">
        <article class="chapter-card">
          <span class="chapter-badge">Lecture en cours</span>
          <h1>{{ activeChapter.title }}</h1>
          <div class="divider"></div>
          
          <div class="chapter-body">
            <p>{{ activeChapter.content }}</p>
          </div>
          
          <div class="chapter-actions">
            <button 
              v-if="!activeChapter.isCompleted" 
              @click="markAsDone" 
              class="btn-complete"
            >
              ✨ Marquer ce chapitre comme terminé
            </button>
            <div v-else class="status-done-box">
              <span class="icon">🎉</span>
              <div>
                <h4>Chapitre validé !</h4>
                <p>Vos points de progression ont été mis à jour.</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
  
  <div v-else class="loading-screen">
    <div class="spinner"></div>
    <p>Chargement de vos ressources...</p>
  </div>
</template>

<script>
import { courses } from '../data/coursesMock.js';

export default {
  name: 'CourseView',
  props: ['id'],
  data() {
    return {
      course: null,
      currentChapterIndex: 0
    };
  },
  computed: {
    activeChapter() {
      return this.course?.chapters[this.currentChapterIndex];
    },
    calculateProgress() {
      if (!this.course || this.course.chapters.length === 0) return 0;
      const completedCount = this.course.chapters.filter(ch => ch.isCompleted).length;
      const percentage = Math.round((completedCount / this.course.chapters.length) * 100);
      this.course.progress = percentage;
      return percentage;
    }
  },
  created() {
    const courseId = parseInt(this.id);
    this.course = courses.find(c => c.id === courseId);
  },
  methods: {
    markAsDone() {
      this.activeChapter.isCompleted = true;
    }
  }
};
</script>

<style scoped>
.course-layout {
  display: flex;
  height: calc(100vh - 61px);
  background-color: #f8fafc;
}

/* Sidebar pro */
.sidebar {
  width: 340px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.btn-back {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}
.btn-back:hover { color: #2563eb; }
.btn-back:hover .arrow { transform: translateX(-3px); }
.arrow { transition: transform 0.2s; }

.course-title {
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
}

.progress-zone {
  background-color: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  margin-bottom: 2rem;
}

.progress-text-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: #475569;
}

.bar-bg {
  background-color: #e2e8f0;
  height: 6px;
  border-radius: 9999px;
  overflow: hidden;
}

.bar-fill {
  background: linear-gradient(to right, #10b981, #34d399);
  height: 100%;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chapters-list h3 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.chapters-list ul { list-style: none; padding: 0; margin: 0; }

.chapters-list li {
  display: flex;
  align-items: flex-start;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 0.4rem;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.chapters-list li:hover {
  background-color: #f1f5f9;
}

.chapters-list li.active {
  background-color: #eff6ff;
  border-color: #bfdbfe;
  color: #1e40af;
  font-weight: 600;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  height: 1.2rem;
  margin-right: 12px;
}

.modern-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
}

.chapter-title { font-size: 0.95rem; line-height: 1.4; }

.quiz-zone { margin-top: auto; padding-top: 1.5rem; }

.btn-quiz {
  display: block;
  text-align: center;
  background-color: #ef4444;
  color: white;
  padding: 0.9rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  transition: background-color 0.2s;
}
.btn-quiz:hover { background-color: #dc2626; }

/* Zone de lecture de type Article */
.content-area {
  flex: 1;
  padding: 3rem;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.content-max-width {
  width: 100%;
  max-width: 800px;
}

.chapter-card {
  background: #ffffff;
  padding: 3rem;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02);
}

.chapter-badge {
  display: inline-block;
  background: #f1f5f9;
  color: #475569;
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

h1 { color: #0f172a; font-size: 2.25rem; font-weight: 800; margin: 0 0 1.5rem 0; }
.divider { height: 1px; background-color: #f1f5f9; margin-bottom: 2rem; }

.chapter-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #334155;
  margin-bottom: 3rem;
}

.chapter-actions {
  padding-top: 2rem;
  border-top: 1px solid #f1f5f9;
}

.btn-complete {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.9rem 1.75rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}
.btn-complete:hover {
  background-color: #1d4ed8;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
}

.status-done-box {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 1.25rem;
  border-radius: 14px;
}
.status-done-box .icon { font-size: 1.75rem; }
.status-done-box h4 { margin: 0 0 0.25rem 0; color: #065f46; font-size: 1rem; }
.status-done-box p { margin: 0; color: #047857; font-size: 0.85rem; }

/* Loading state */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 61px);
  color: #64748b;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>