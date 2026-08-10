import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/Auth/LoginView.vue';
import RegisterView from '@/views/Auth/RegisterView.vue';
import DashboardLayout from '@/views/Dashboard/DashboardLayout.vue';
import CourseViewer from '@/views/Course/CourseViewer.vue';
import MesCoursView from '@/views/Dashboard/MesCoursView.vue';
import CertificatsView from '@/views/Dashboard/CertificatsView.vue';
import ProfilView from '@/views/Dashboard/ProfilView.vue';
import CertificateView from '@/views/Certificate/CertificateView.vue';
import { useAuthStore } from '@/stores/authStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/DashboardHome.vue')
      },
      {
        path: 'mes-cours',
        name: 'MesCours',
        component: MesCoursView
      },
      {
        path: 'certificats',
        name: 'Certificats',
        component: CertificatsView
      },
      {
        path: 'profil',
        name: 'Profil',
        component: ProfilView
      },
      {
        path: 'enseignement',
        name: 'Enseignement',
        meta: { requiresTeacher: true },
        component: () => import('@/views/Dashboard/TeacherCoursesView.vue')
      },
      {
        path: 'enseignement/:id',
        name: 'EnseignementEdit',
        meta: { requiresTeacher: true },
        component: () => import('@/views/Dashboard/TeacherCourseEditView.vue')
      }
    ]
  },
  {
    path: '/course/:id',
    name: 'CourseViewer',
    component: CourseViewer,
    meta: { requiresAuth: true }
  },
  {
    path: '/certificate/:id',
    name: 'Certificate',
    component: CertificateView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Home' };
  }
  if (to.meta.requiresTeacher && !authStore.isTeacher) {
    return { name: 'Dashboard' };
  }
  if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    return { name: 'Dashboard' };
  }
  return true;
});

export default router;
