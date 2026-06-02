<template>
  <div class="catalog-container">
    <header class="catalog-header">
      <div class="header-badge">Plateforme Apprenant</div>
      <h1>Mon Espace <span>mini-Moodle</span></h1>
      <p class="subtitle">Propulsez vos compétences à un autre niveau. Suivez vos chapitres, validez vos acquis et décrochez vos certifications.</p>
    </header>

    <div class="courses-grid">
      <div v-for="course in coursesList" :key="course.id" class="course-card">
        
        <div class="card-body">
          <div v-if="course.certified" class="badge-certified">
            <span class="icon">🏆</span> Certifié
          </div>
          
          <div class="course-icon-box">🧠</div>
          
          <h3>{{ course.title }}</h3>
          <p class="course-description">{{ course.description }}</p>
          
          <div class="progress-section">
            <div class="progress-info">
              <span class="progress-label">Progression de l'apprentissage</span>
              <span class="progress-percentage">{{ course.progress }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: course.progress + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <router-link :to="'/course/' + course.id" class="btn-start" :class="{ 'in-progress': course.progress > 0 }">
            <span>{{ course.progress > 0 ? 'Continuer l’apprentissage' : 'Découvrir le cours' }}</span>
            <span class="arrow">→</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { courses } from '../data/coursesMock.js';

export default {
  name: 'HomeView',
  data() {
    return {
      coursesList: courses
    };
  }
};
</script>

<style scoped>
/* Conteneur Principal */
.catalog-container {
  padding: 4rem 2rem;
  max-width: 1240px;
  margin: 0 auto;
  background-color: #f8fafc;
}

/* En-tête */
.catalog-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem auto;
}

.header-badge {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

h1 {
  color: #0f172a;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

h1 span {
  background: linear-gradient(to right, #2563eb, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #64748b;
  font-size: 1.15rem;
  line-height: 1.6;
}

/* Grille */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
}

/* Cartes Premium */
.course-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #cbd5e1;
}

.card-body {
  padding: 2.25rem;
  position: relative;
}

.course-icon-box {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Badge de certification moderne */
.badge-certified {
  position: absolute;
  top: 2.25rem;
  right: 2.25rem;
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

h3 {
  color: #0f172a;
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.course-description {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  height: 4.8rem; /* Aligne la hauteur des descriptions */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Section Progression */
.progress-section {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
}

.progress-percentage {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}

.progress-bar-bg {
  background-color: #e2e8f0;
  border-radius: 9999px;
  height: 6px;
  overflow: hidden;
}

.progress-bar-fill {
  background: linear-gradient(to right, #2563eb, #60a5fa);
  height: 100%;
  border-radius: 9999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Footer et Bouton */
.card-footer {
  padding: 0 2.25rem 2.25rem 2.25rem;
  background: transparent;
}

.btn-start {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #0f172a;
  color: #ffffff;
  padding: 0.85rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-start:hover {
  background-color: #1e293b;
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.15);
}

.btn-start:hover .arrow {
  transform: translateX(4px);
}

.btn-start.in-progress {
  background-color: #2563eb;
}

.btn-start.in-progress:hover {
  background-color: #1d4ed8;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
}

.arrow {
  transition: transform 0.2s ease;
}
</style>