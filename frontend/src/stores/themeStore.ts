import { defineStore } from 'pinia';
import { ref, watch, onMounted } from 'vue'; // <-- Ajout de onMounted

export type Theme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('light');

  // Load from localStorage
  const savedTheme = localStorage.getItem('curio_theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme;
  }

  // Apply theme to document
  function applyTheme(newTheme: Theme) {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // INITIALISATION SÉCURISÉE : 
  // On attend que l'application soit montée dans le navigateur pour toucher au DOM
  onMounted(() => {
    applyTheme(theme.value);
  });

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    localStorage.setItem('curio_theme', newTheme);
    // Plus besoin d'appeler applyTheme ici, le watch s'en occupe automatiquement !
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  }

  // Watch for changes (réactif aux modifications de la variable 'theme')
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    theme,
    setTheme,
    toggleTheme,
  };
});