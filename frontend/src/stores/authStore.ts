import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref<{ name: string; email: string } | null>(null);

  function login(email: string) {
    // Simulation d'une connexion réussie
    isAuthenticated.value = true;
    user.value = {
      name: email.split('@')[0], // nom basé sur l'email
      email: email
    };
  }

  function logout() {
    isAuthenticated.value = false;
    user.value = null;
  }

  return {
    isAuthenticated,
    user,
    login,
    logout
  };
});
