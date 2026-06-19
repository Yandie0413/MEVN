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
      }
    ]
  },
  {
    path: '/course/:id',
    name: 'CourseViewer',
    component: CourseViewer
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
