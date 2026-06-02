<template>
  <div class="profile-container">
    <header class="profile-header">
      <div class="avatar-box">M</div>
      <div>
        <h1>Espace Personnel Apprenant</h1>
        <p class="profile-subtitle">Consultez l'historique de vos formations et téléchargez vos diplômes officiels.</p>
      </div>
    </header>

    <div class="certificates-section">
      <h2>🏆 Vos Certifications & Diplômes</h2>
      
      <div class="certificates-list">
        <div v-for="course in coursesList" :key="course.id" class="cert-card">
          <div class="cert-meta">
            <div class="icon-diploma" :class="{ unlocked: course.certified && course.progress === 100 }">🎓</div>
            <div>
              <h3>{{ course.title }}</h3>
              <div class="status-row">
                <span class="progress-tag">{{ course.progress }}% complété</span>
                <span v-if="course.certified && course.progress === 100" class="status-tag success">Examen Validé</span>
                <span v-else class="status-tag pending">En cours</span>
              </div>
            </div>
          </div>

          <div class="cert-action">
            <button 
              v-if="course.certified && course.progress === 100" 
              @click="printCertificate(course.title)" 
              class="btn-download"
            >
              Imprimer le Diplôme
            </button>
            <div v-else class="locked-box">
              <span class="lock-icon">🔒</span>
              <span>Certificat verrouillé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { courses } from '../data/coursesMock.js';

export default {
  name: 'ProfileView',
  data() {
    return {
      coursesList: courses
    };
  },
  methods: {
    printCertificate(courseTitle) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificat Officiel - mini-Moodle</title>
            <style>
              body { font-family: 'Georgia', serif; text-align: center; padding: 60px; background-color: #ffffff; color: #1e293b; }
              .cert-border { border: 8px double #1e293b; padding: 50px; max-width: 750px; margin: 0 auto; background: #fff; }
              .badge-gold { font-size: 3.5rem; margin-bottom: 10px; color: #d97706; }
              h1 { font-size: 2.8rem; font-weight: bold; letter-spacing: 2px; color: #0f172a; margin-top: 10px; }
              .academy { font-size: 1.1rem; text-transform: uppercase; letter-spacing: 3px; color: #64748b; margin-bottom: 40px; font-family: sans-serif; }
              .statement { font-size: 1.3rem; font-style: italic; line-height: 1.8; margin: 40px 0; color: #334155; }
              .course-title { color: #2563eb; font-weight: bold; font-size: 2rem; display: block; margin-top: 10px; font-family: sans-serif; }
              .uid { font-size: 0.8rem; color: #94a3b8; font-family: monospace; margin-top: 50px; }
              .footer-row { margin-top: 50px; display: flex; justify-content: space-between; font-size: 0.95rem; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #475569; font-family: sans-serif; }
              @media print { body { padding: 0; } .cert-border { border-color: #000; box-shadow: none; } }
            </style>
          </head>
          <body>
            <div class="cert-border">
              <div class="badge-gold">🏅</div>
              <h1>CERTIFICAT DE RÉUSSITE</h1>
              <div class="academy">Génie Logiciel & Plateformes Académiques</div>
              
              <p class="statement">
                Le système automatisé d'évaluation certifie que l'apprenant a suivi de manière assidue
                l'ensemble des modules d'enseignement et a validé l'examen théorique requis pour le cours de :
                <span class="course-title">${courseTitle}</span>
              </p>
              
              <div class="footer-row">
                <div>Délivré le : <strong>${new Date().toLocaleDateString()}</strong></div>
                <div>Authentification : <strong>Validée par le Système (MEAVN)</strong></div>
              </div>
              <div class="uid">ID-Vérification : mm-${Math.random().toString(36).substr(2, 9)}</div>
            </div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            <\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
};
</script>

<style scoped>
.profile-container { max-width: 900px; margin: 4rem auto; padding: 0 1.5rem; }

.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 3.5rem; }
.avatar-box { width: 64px; height: 64px; background: linear-gradient(to bottom right, #2563eb, #3b82f6); color: white; font-size: 1.8rem; font-weight: 700; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2); }
.profile-header h1 { font-size: 2rem; color: #0f172a; margin: 0 0 0.25rem 0; font-weight: 800; }
.profile-subtitle { color: #64748b; margin: 0; font-size: 1.05rem; }

.certificates-section h2 { font-size: 1.4rem; color: #0f172a; margin-bottom: 1.5rem; font-weight: 700; }
.certificates-list { display: flex; flex-direction: column; gap: 1rem; }

.cert-card { background: white; padding: 1.75rem 2rem; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; transition: box-shadow 0.2s; }
.cert-card:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02); }

.cert-meta { display: flex; align-items: center; gap: 20px; }
.icon-diploma { width: 44px; height: 44px; border-radius: 50%; background-color: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; border: 1px solid #e2e8f0; }
.icon-diploma.unlocked { background-color: #eff6ff; border-color: #bfdbfe; color: #2563eb; }

.cert-meta h3 { margin: 0 0 0.5rem 0; font-size: 1.15rem; color: #0f172a; font-weight: 700; }
.status-row { display: flex; gap: 10px; align-items: center; }
.progress-tag { font-size: 0.8rem; color: #64748b; font-weight: 500; }
.status-tag { font-size: 0.75rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 6px; }
.status-tag.success { background-color: #d1fae5; color: #065f46; }
.status-tag.pending { background-color: #f1f5f9; color: #475569; }

.btn-download { background-color: #10b981; color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 600; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15); transition: background-color 0.2s; }
.btn-download:hover { background-color: #059669; }

.locked-box { display: flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 0.85rem; font-weight: 500; background-color: #f8fafc; padding: 0.5rem 1rem; border-radius: 10px; border: 1px dashed #e2e8f0; }
</style>