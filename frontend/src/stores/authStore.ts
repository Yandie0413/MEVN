import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export type Role = 'admin' | 'enseignant' | 'etudiant';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface ApiUser {
  id: string;
  nom: string;
  email: string;
  role: Role;
}

export interface UserStats {
  streakDays: number;
  totalXp: number;
  coursesFollowed: number;
  coursesCompleted: number;
  certificatesCount: number;
}

const XP_PER_LEVEL = 500;

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('curio_token'));
  const user = ref<AuthUser | null>(null);
  const stats = ref<UserStats>({ streakDays: 0, totalXp: 0, coursesFollowed: 0, coursesCompleted: 0, certificatesCount: 0 });
  const statsLoaded = ref(false);

  const savedUser = localStorage.getItem('curio_user');
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser);
    } catch (e) {
      user.value = null;
    }
  }

  const isAuthenticated = computed(() => !!token.value);
  const isTeacher = computed(() => user.value?.role === 'enseignant' || user.value?.role === 'admin');
  const level = computed(() => Math.floor(stats.value.totalXp / XP_PER_LEVEL) + 1);
  const xpIntoLevel = computed(() => stats.value.totalXp % XP_PER_LEVEL);
  const xpForNextLevel = computed(() => XP_PER_LEVEL);

  function persist(newToken: string, apiUser: ApiUser) {
    token.value = newToken;
    user.value = { id: apiUser.id, name: apiUser.nom, email: apiUser.email, role: apiUser.role };
    localStorage.setItem('curio_token', newToken);
    localStorage.setItem('curio_user', JSON.stringify(user.value));
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
  }

  async function register(nom: string, email: string, password: string, role: Role = 'etudiant') {
    const { data } = await api.post('/auth/register', { nom, email, password, role });
    persist(data.token, data.user);
  }

  function logout() {
    token.value = null;
    user.value = null;
    statsLoaded.value = false;
    localStorage.removeItem('curio_token');
    localStorage.removeItem('curio_user');
  }

  async function fetchStats(force = false) {
    if (!isAuthenticated.value) return;
    if (statsLoaded.value && !force) return;
    const { data } = await api.get('/auth/me');
    stats.value = {
      streakDays: data.streakDays,
      totalXp: data.totalXp,
      coursesFollowed: data.coursesFollowed,
      coursesCompleted: data.coursesCompleted,
      certificatesCount: data.certificatesCount
    };
    statsLoaded.value = true;
  }

  return {
    token,
    user,
    stats,
    statsLoaded,
    level,
    xpIntoLevel,
    xpForNextLevel,
    isAuthenticated,
    isTeacher,
    login,
    register,
    logout,
    fetchStats
  };
});
