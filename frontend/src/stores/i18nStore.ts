import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type Locale = 'fr' | 'en';

export interface Translations {
  [key: string]: {
    fr: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.courses': { fr: 'Cours', en: 'Courses' },
  'nav.features': { fr: 'Fonctionnalités', en: 'Features' },
  'nav.pricing': { fr: 'Tarifs', en: 'Pricing' },
  'nav.about': { fr: 'À propos', en: 'About' },
  'nav.signIn': { fr: 'Se connecter', en: 'Sign In' },
  'nav.getStarted': { fr: 'Commencer', en: 'Get Started' },
  'nav.dashboard': { fr: 'Tableau de bord', en: 'Dashboard' },
  'nav.hi': { fr: 'Salut', en: 'Hi' },

  // Hero Section
  'hero.badge': { fr: 'Plateforme EdTech #1 2026', en: '#1 EdTech Platform 2026' },
  'hero.title1': { fr: 'Apprendre Sans', en: 'Learn Without' },
  'hero.title2': { fr: 'Limites', en: 'Limits' },
  'hero.subtitle': { fr: 'Maîtrisez des compétences recherchées avec des instructeurs de classe mondiale. Rejoignez plus de 25 000 étudiants qui construisent leur avenir — un cours à la fois.', en: 'Master in-demand skills with world-class instructors. Join over 25,000 students building their future — one course at a time.' },
  'hero.startLearning': { fr: 'Commencer Gratuitement', en: 'Start Learning Free' },
  'hero.watchDemo': { fr: 'Voir la Démo', en: 'Watch Demo' },
  'hero.joinedBy': { fr: 'Rejoint par', en: 'Joined by' },
  'hero.learners': { fr: 'apprenants', en: 'learners' },
  'hero.yourProgress': { fr: 'Votre Progression', en: 'Your Progress' },
  'hero.achievement': { fr: 'Réussite', en: 'Achievement' },
  'hero.courseComplete': { fr: 'Cours Terminé !', en: 'Course Complete!' },
  'hero.rating': { fr: 'Note', en: 'Rating' },
  'hero.reviews': { fr: 'avis', en: 'reviews' },
  'hero.chapter': { fr: 'Chapitre', en: 'Chapter' },
  'hero.colorTheory': { fr: 'Théorie des Couleurs', en: 'Color Theory' },
  'hero.typography': { fr: 'Typographie', en: 'Typography' },
  'hero.designSystems': { fr: 'Systèmes de Design', en: 'Design Systems' },
  'hero.onReviews': { fr: 'sur 12 400 avis', en: 'from 12,400 reviews' },

  // Stats
  'stats.students': { fr: 'Étudiants Inscrits', en: 'Students Enrolled' },
  'stats.courses': { fr: 'Cours Experts', en: 'Expert Courses' },
  'stats.satisfaction': { fr: 'Taux de Satisfaction', en: 'Satisfaction Rate' },
  'stats.instructors': { fr: 'Instructeurs Experts', en: 'Expert Instructors' },

  // Featured Courses
  'courses.explore': { fr: 'Explorer', en: 'Explore' },
  'courses.featured': { fr: 'Cours en Vedette', en: 'Featured Courses' },
  'courses.viewAll': { fr: 'Voir Tout', en: 'View All' },
  'courses.startCourse': { fr: 'Commencer le Cours', en: 'Start Course' },
  'courses.lessons': { fr: 'leçons', en: 'lessons' },
  'courses.beginner': { fr: 'Débutant', en: 'Beginner' },
  'courses.intermediate': { fr: 'Intermédiaire', en: 'Intermediate' },
  'courses.advanced': { fr: 'Avancé', en: 'Advanced' },
  'courses.popular': { fr: 'Populaire', en: 'Popular' },
  'courses.new': { fr: 'Nouveau', en: 'New' },
  'courses.hot': { fr: 'Tendance', en: 'Hot' },

  // Course Titles
  'course.uiux': { fr: 'Design UI/UX', en: 'UI/UX Design' },
  'course.webdev': { fr: 'Développement Web', en: 'Web Development' },
  'course.datascience': { fr: 'Science des Données', en: 'Data Science' },
  'course.mobiledev': { fr: 'Développement Mobile', en: 'Mobile Dev' },

  // CTA Section
  'cta.title': { fr: 'Prêt à commencer votre voyage ?', en: 'Ready to start your journey?' },
  'cta.subtitle': { fr: 'Créez votre compte gratuit et accédez à plus de 500 cours dès aujourd\'hui.', en: 'Create your free account and access 500+ courses today.' },
  'cta.button': { fr: 'Créer un Compte Gratuit', en: 'Create Free Account' },

  // Footer
  'footer.rights': { fr: 'Tous droits réservés.', en: 'All rights reserved.' },
  'footer.privacy': { fr: 'Confidentialité', en: 'Privacy' },
  'footer.terms': { fr: 'Conditions', en: 'Terms' },
  'footer.contact': { fr: 'Contact', en: 'Contact' },

  // Auth Pages
  'auth.login.title': { fr: 'Bon retour !', en: 'Welcome Back!' },
  'auth.login.subtitle': { fr: 'Connectez-vous pour continuer votre apprentissage', en: 'Sign in to continue your learning journey' },
  'auth.login.email': { fr: 'Adresse e-mail', en: 'Email address' },
  'auth.login.password': { fr: 'Mot de passe', en: 'Password' },
  'auth.login.remember': { fr: 'Se souvenir de moi', en: 'Remember me' },
  'auth.login.forgot': { fr: 'Mot de passe oublié ?', en: 'Forgot password?' },
  'auth.login.button': { fr: 'Se connecter', en: 'Sign In' },
  'auth.login.noAccount': { fr: 'Pas encore de compte ?', en: 'Don\'t have an account?' },
  'auth.login.signup': { fr: 'S\'inscrire', en: 'Sign up' },
  'auth.login.welcomeBack': { fr: 'Bienvenue<br/>de retour sur<br/><span class="text-edu-lime">l\'apprentissage.</span>', en: 'Welcome<br/>back to<br/><span class="text-edu-lime">learning.</span>' },
  'auth.login.accessCourses': { fr: 'Accédez à vos cours, suivez votre progression et connectez-vous avec plus de 25 000 apprenants dans le monde.', en: 'Access your courses, track your progress and connect with 25,000+ learners worldwide.' },
  'auth.login.feature1': { fr: '500+ cours animés par des experts', en: '500+ expert-led courses' },
  'auth.login.feature2': { fr: 'Apprenez à votre rythme', en: 'Learn at your own pace' },
  'auth.login.feature3': { fr: 'Gagnez des certifications reconnues', en: 'Earn recognized certificates' },
  'auth.login.socialGoogle': { fr: 'Google', en: 'Google' },
  'auth.login.socialLinkedIn': { fr: 'LinkedIn', en: 'LinkedIn' },
  'auth.login.orEmail': { fr: 'ou continuer avec e-mail', en: 'or continue with email' },
  'auth.login.fillFields': { fr: 'Veuillez remplir tous les champs.', en: 'Please fill in all fields.' },
  'auth.login.signingIn': { fr: 'Connexion...', en: 'Signing in...' },
  'auth.login.terms': { fr: 'En vous connectant, vous acceptez nos', en: 'By signing in, you agree to our' },
  'auth.login.and': { fr: 'et', en: 'and' },

  'auth.register.title': { fr: 'Créer un compte', en: 'Create Account' },
  'auth.register.subtitle': { fr: 'Commencez votre voyage d\'apprentissage aujourd\'hui', en: 'Start your learning journey today' },
  'auth.register.name': { fr: 'Nom complet', en: 'Full name' },
  'auth.register.email': { fr: 'Adresse e-mail', en: 'Email address' },
  'auth.register.password': { fr: 'Mot de passe', en: 'Password' },
  'auth.register.confirm': { fr: 'Confirmer le mot de passe', en: 'Confirm password' },
  'auth.register.button': { fr: 'Créer un compte', en: 'Create Account' },
  'auth.register.hasAccount': { fr: 'Vous avez déjà un compte ?', en: 'Already have an account?' },
  'auth.register.signin': { fr: 'Se connecter', en: 'Sign in' },
  'auth.register.startJourney': { fr: 'Start your<br/>learning<br/><span class="text-edu-lime">journey today.</span>', en: 'Start your<br/>learning<br/><span class="text-edu-lime">journey today.</span>' },
  'auth.register.joinStudents': { fr: 'Rejoins des milliers d\'étudiants, obtient des certifications et améliore ta carrière avec des cours de classe mondiale.', en: 'Join thousands of students, earn certifications, and upgrade your career with world-class courses.' },
  'auth.register.step1': { fr: 'Créer ton compte gratuit', en: 'Create your free account' },
  'auth.register.step2': { fr: 'Explorer 500+ cours', en: 'Explore 500+ courses' },
  'auth.register.step3': { fr: 'Gagner des certifications', en: 'Earn certifications' },
  'auth.register.students': { fr: 'Étudiants', en: 'Students' },
  'auth.register.courses': { fr: 'Cours', en: 'Courses' },
  'auth.register.satisfaction': { fr: 'Satisfaction', en: 'Satisfaction' },
  'auth.register.socialGoogle': { fr: 'Google', en: 'Google' },
  'auth.register.socialLinkedIn': { fr: 'LinkedIn', en: 'LinkedIn' },
  'auth.register.orEmail': { fr: 'ou s\'inscrire avec e-mail', en: 'or sign up with email' },
  'auth.register.fullName': { fr: 'Nom complet', en: 'Full name' },
  'auth.register.fullNamePlaceholder': { fr: 'Jean Dupont', en: 'John Doe' },
  'auth.register.emailPlaceholder': { fr: 'vous@exemple.com', en: 'you@example.com' },
  'auth.register.fillFields': { fr: 'Veuillez remplir tous les champs.', en: 'Please fill in all fields.' },
  'auth.register.passwordsNoMatch': { fr: 'Les mots de passe ne correspondent pas.', en: 'Passwords do not match.' },
  'auth.register.acceptTerms': { fr: 'Vous devez accepter les conditions générales.', en: 'You must accept the terms and conditions.' },
  'auth.register.passwordMin': { fr: 'Le mot de passe doit contenir au moins 6 caractères.', en: 'Password must be at least 6 characters.' },
  'auth.register.creatingAccount': { fr: 'Création du compte...', en: 'Creating account...' },
  'auth.register.termsAgree': { fr: 'J\'accepte les', en: 'I agree to the' },
  'auth.register.termsOfService': { fr: 'Conditions d\'utilisation', en: 'Terms of Service' },
  'auth.register.and': { fr: 'et', en: 'and' },
  'auth.register.privacyPolicy': { fr: 'Politique de confidentialité', en: 'Privacy Policy' },
  'auth.register.byCreating': { fr: 'En créant un compte, vous acceptez nos', en: 'By creating an account, you agree to our' },

  // Dashboard
  'dashboard.home': { fr: 'Accueil', en: 'Home' },
  'dashboard.myCourses': { fr: 'Mes Cours', en: 'My Courses' },
  'dashboard.certificates': { fr: 'Certificats', en: 'Certificates' },
  'dashboard.profile': { fr: 'Profil', en: 'Profile' },
  'dashboard.logout': { fr: 'Déconnexion', en: 'Logout' },
  'dashboard.search': { fr: 'Cherche un cours, un sujet...', en: 'Search for a course, topic...' },
  'dashboard.streak': { fr: 'jours', en: 'days' },
  'dashboard.welcome': { fr: 'Bienvenue', en: 'Welcome' },
  'dashboard.continueWhere': { fr: 'Continue où tu t\'es arrêté', en: 'Continue where you left off' },
  'dashboard.allCourses': { fr: 'Tous les cours', en: 'All Courses' },
  'dashboard.chooseAdventure': { fr: 'Choisis ton aventure et gagne des XP !', en: 'Choose your adventure and earn XP!' },
  'dashboard.progression': { fr: 'Progression', en: 'Progress' },
  'dashboard.chapters': { fr: 'chapitres', en: 'chapters' },
  'dashboard.continue': { fr: 'Continuer', en: 'Continue' },
  'dashboard.start': { fr: 'Commencer', en: 'Start' },
  'dashboard.all': { fr: 'Tous', en: 'All' },
  'dashboard.hello': { fr: 'Bonjour', en: 'Hello' },
  'dashboard.readyToLearn': { fr: 'Prêt(e) à apprendre', en: 'Ready to learn' },
  'dashboard.somethingAwesome': { fr: 'quelque chose de', en: 'something' },
  'dashboard.awesome': { fr: 'génial', en: 'awesome' },
  'dashboard.today': { fr: 'aujourd\'hui ?', en: 'today?' },
  'dashboard.earnedXP': { fr: 'Tu as déjà gagné', en: 'You\'ve already earned' },
  'dashboard.xpThisSeason': { fr: 'XP cette saison. Continue sur ta lancée !', en: 'XP this season. Keep it up!' },
  'dashboard.exploreCourses': { fr: 'Explorer les cours', en: 'Explore courses' },
  'dashboard.resumeCourse': { fr: 'Reprendre', en: 'Resume' },
  'dashboard.coursesFollowed': { fr: 'Cours suivis', en: 'Courses Followed' },
  'dashboard.quizzesCompleted': { fr: 'Quiz complétés', en: 'Quizzes Completed' },
  'dashboard.certificatesCount': { fr: 'Certificats', en: 'Certificates' },
  'dashboard.level': { fr: 'Niveau', en: 'Level' },
  'dashboard.badges': { fr: 'Tes badges', en: 'Your badges' },
  'dashboard.seeAll': { fr: 'Tout voir', en: 'See all' },
  'dashboard.badgeFirstStep': { fr: 'Premier Pas', en: 'First Step' },
  'dashboard.badgeMarathon': { fr: 'Marathonien', en: 'Marathonian' },
  'dashboard.badgeQuizMaster': { fr: 'Quiz Master', en: 'Quiz Master' },
  'dashboard.badgePolyglot': { fr: 'Polyglotte', en: 'Polyglot' },
  'dashboard.badgeScientist': { fr: 'Scientifique', en: 'Scientist' },
  'dashboard.badgeLegend': { fr: 'Légende', en: 'Legend' },
  'dashboard.recentActivity': { fr: 'Activité récente', en: 'Recent Activity' },
  'dashboard.chapterCompleted': { fr: 'Chapitre terminé', en: 'Chapter completed' },
  'dashboard.badgeUnlocked': { fr: 'Badge débloqué', en: 'Badge unlocked' },
  'dashboard.quizPassed': { fr: 'Quiz réussi', en: 'Quiz passed' },
  'dashboard.newCourseStarted': { fr: 'Nouveau cours commencé', en: 'New course started' },
  'dashboard.hoursAgo': { fr: 'il y a {n} h', en: '{n} h ago' },
  'dashboard.daysAgo': { fr: 'il y a {n} j', en: '{n} d ago' },
  'dashboard.reward': { fr: 'Récompense', en: 'Reward' },

  // Course Categories
  'category.mathematics': { fr: 'Mathématiques', en: 'Mathematics' },
  'category.sciences': { fr: 'Sciences', en: 'Sciences' },
  'category.languages': { fr: 'Langues', en: 'Languages' },
  'category.history': { fr: 'Histoire', en: 'History' },
  'category.computer': { fr: 'Informatique', en: 'Computer Science' },
  'category.arts': { fr: 'Arts', en: 'Arts' },

  // Certificates
  'certificates.title': { fr: 'Mes Certificats', en: 'My Certificates' },
  'certificates.subtitle': { fr: 'Tes réussites et diplômes', en: 'Your achievements and diplomas' },
  'certificates.completed': { fr: 'Cours terminés', en: 'Completed Courses' },
  'certificates.totalXP': { fr: 'XP Total', en: 'Total XP' },
  'certificates.avgScore': { fr: 'Score Moyen', en: 'Average Score' },
  'certificates.download': { fr: 'Télécharger', en: 'Download' },
  'certificates.share': { fr: 'Partager', en: 'Share' },
  'certificates.completedOn': { fr: 'Terminé le', en: 'Completed on' },
  'certificates.noCertificates': { fr: 'Aucun certificat pour le moment', en: 'No certificates yet' },
  'certificates.noCertificatesDesc': { fr: 'Termine des cours pour débloquer tes certificats !', en: 'Complete courses to unlock your certificates!' },
  'certificates.achievements': { fr: 'Toutes tes réussites en un coup d\'œil. Partage-les avec fierté !', en: 'All your achievements at a glance. Share them with pride!' },
  'certificates.nextCertificate': { fr: 'Ton prochain certificat', en: 'Your next certificate' },
  'certificates.continueCourse': { fr: 'Continuer le cours', en: 'Continue course' },
  'certificates.toUnlock': { fr: 'À débloquer en terminant tous les chapitres', en: 'Unlock by completing all chapters' },
  'certificates.unlocked': { fr: 'Certificat débloqué !', en: 'Certificate unlocked!' },
  'certificates.congratsSkills': { fr: 'Félicitations ! Vous avez acquis toutes les compétences.', en: 'Congratulations! You have acquired all skills.' },
  'certificates.viewMyCert': { fr: 'Voir mon certificat', en: 'View my certificate' },
  'certificates.locked': { fr: 'Verrouillé', en: 'Locked' },
  'certificates.progress': { fr: 'Progression', en: 'Progress' },

  // Profile
  'profile.title': { fr: 'Mon Profil', en: 'My Profile' },
  'profile.subtitle': { fr: 'Gère tes informations personnelles', en: 'Manage your personal information' },
  'profile.personalInfo': { fr: 'Informations Personnelles', en: 'Personal Information' },
  'profile.name': { fr: 'Nom complet', en: 'Full name' },
  'profile.email': { fr: 'Adresse e-mail', en: 'Email address' },
  'profile.bio': { fr: 'Biographie', en: 'Bio' },
  'profile.save': { fr: 'Enregistrer les modifications', en: 'Save changes' },
  'profile.changePassword': { fr: 'Changer le mot de passe', en: 'Change Password' },
  'profile.currentPassword': { fr: 'Mot de passe actuel', en: 'Current password' },
  'profile.newPassword': { fr: 'Nouveau mot de passe', en: 'New password' },
  'profile.confirmPassword': { fr: 'Confirmer le nouveau mot de passe', en: 'Confirm new password' },
  'profile.updatePassword': { fr: 'Mettre à jour le mot de passe', en: 'Update password' },

  // Course Viewer
  'course.overview': { fr: 'Aperçu', en: 'Overview' },
  'course.chapters': { fr: 'Chapitres', en: 'Chapters' },
  'course.completed': { fr: 'Terminé', en: 'Completed' },
  'course.nextChapter': { fr: 'Chapitre Suivant', en: 'Next Chapter' },
  'course.markComplete': { fr: 'Marquer comme terminé', en: 'Mark as Complete' },
  'course.quiz': { fr: 'Quiz', en: 'Quiz' },
  'course.submit': { fr: 'Soumettre', en: 'Submit' },
  'course.score': { fr: 'Score', en: 'Score' },
  'course.congratulations': { fr: 'Félicitations !', en: 'Congratulations!' },
  'course.passed': { fr: 'Vous avez réussi le quiz !', en: 'You passed the quiz!' },
  'course.failed': { fr: 'Continuez à apprendre !', en: 'Keep learning!' },
  'course.tryAgain': { fr: 'Réessayer', en: 'Try Again' },
  'course.startCourse': { fr: 'Commencer le cours', en: 'Start course' },
  'course.resumeCourse': { fr: 'Continuer le cours', en: 'Continue course' },
  'course.doQuiz': { fr: 'Faire le quiz', en: 'Take quiz' },
  'course.backToCourses': { fr: 'Retour aux cours', en: 'Back to courses' },
  'course.backToCourse': { fr: 'Retour au cours', en: 'Back to course' },
  'course.backToOverview': { fr: 'Retour à l\'aperçu', en: 'Back to overview' },
  'course.inProgress': { fr: 'En cours', en: 'In progress' },
  'course.toDo': { fr: 'À faire', en: 'To do' },
  'course.progressLabel': { fr: 'Progression', en: 'Progress' },
  'course.chaptersCompleted': { fr: 'chapitres terminés', en: 'chapters completed' },
  'course.reward': { fr: 'Récompense', en: 'Reward' },
  'course.certificateUnlocked': { fr: 'Certificat débloqué !', en: 'Certificate unlocked!' },
  'course.officialCert': { fr: 'Certificat officiel', en: 'Official certificate' },
  'course.congratsSkills': { fr: 'Félicitations ! Vous avez acquis toutes les compétences.', en: 'Congratulations! You have acquired all skills.' },
  'course.toUnlock': { fr: 'À débloquer en terminant tous les chapitres', en: 'Unlock by completing all chapters' },
  'course.viewMyCert': { fr: 'Voir mon certificat', en: 'View my certificate' },
  'course.locked': { fr: 'Verrouillé', en: 'Locked' },
  'course.validateAnswer': { fr: 'Valider ma réponse', en: 'Validate my answer' },
  'course.nextQuestion': { fr: 'Question suivante', en: 'Next question' },
  'course.finishQuiz': { fr: 'Terminer le quiz', en: 'Finish quiz' },
  'course.question': { fr: 'Question', en: 'Question' },
  'course.explanation': { fr: 'Explication :', en: 'Explanation:' },
  'course.quizFinished': { fr: 'Quiz Terminé !', en: 'Quiz Finished!' },
  'course.finalScore': { fr: 'Voici votre score final pour cette évaluation', en: 'Here is your final score for this assessment' },
  'course.congratsValidated': { fr: 'Félicitations, vous avez validé ce quiz !', en: 'Congratulations, you passed this quiz!' },
  'course.failedMinScore': { fr: 'Vous n\'avez pas atteint le score minimum de 50%. Révisez et réessayez.', en: 'You did not reach the minimum score of 50%. Review and try again.' },
  'course.restartQuiz': { fr: 'Recommencer le quiz', en: 'Restart quiz' },
  'course.backToChapters': { fr: 'Retourner aux chapitres', en: 'Back to chapters' },

  // Mes Cours
  'mescours.title': { fr: 'Tous les cours', en: 'All Courses' },
  'mescours.subtitle': { fr: 'Choisis ton aventure et gagne des XP !', en: 'Choose your adventure and earn XP!' },
  'mescours.seeAll': { fr: 'Tout voir →', en: 'See all →' },
  'mescours.continue': { fr: 'Continuer', en: 'Continue' },
  'mescours.start': { fr: 'Commencer', en: 'Start' },
  'mescours.progression': { fr: 'Progression', en: 'Progress' },
  'mescours.chapters': { fr: 'chapitres', en: 'chapters' },

  // Sidebar
  'sidebar.accueil': { fr: 'Accueil', en: 'Home' },
  'sidebar.mescours': { fr: 'Mes cours', en: 'My Courses' },
  'sidebar.certificats': { fr: 'Certificats', en: 'Certificates' },
  'sidebar.profil': { fr: 'Profil', en: 'Profile' },
  'sidebar.deconnexion': { fr: 'Déconnexion', en: 'Logout' },
  'sidebar.level': { fr: 'Niveau', en: 'Level' },
  'sidebar.explorer': { fr: 'Explorateur', en: 'Explorer' },

  // Common
  'common.loading': { fr: 'Chargement...', en: 'Loading...' },
  'common.error': { fr: 'Erreur', en: 'Error' },
  'common.success': { fr: 'Succès', en: 'Success' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel' },
  'common.confirm': { fr: 'Confirmer', en: 'Confirm' },
  'common.save': { fr: 'Enregistrer', en: 'Save' },
  'common.delete': { fr: 'Supprimer', en: 'Delete' },
  'common.edit': { fr: 'Modifier', en: 'Edit' },
  'common.close': { fr: 'Fermer', en: 'Close' },
};

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref<Locale>('fr'); // Default to French

  // Load from localStorage
  const savedLocale = localStorage.getItem('curio_locale');
  if (savedLocale === 'fr' || savedLocale === 'en') {
    locale.value = savedLocale;
  }

  function setLocale(newLocale: Locale) {
    locale.value = newLocale;
    localStorage.setItem('curio_locale', newLocale);
  }

  function t(key: string, replacements?: Record<string, string | number>): string {
    let translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    let text = translation[locale.value] || translation['fr'] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }

  const isEnglish = computed(() => locale.value === 'en');
  const isFrench = computed(() => locale.value === 'fr');

  return {
    locale,
    setLocale,
    t,
    isEnglish,
    isFrench,
  };
});
