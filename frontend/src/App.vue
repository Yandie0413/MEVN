<script setup lang="ts">
// Instantiated eagerly so the light/dark class is applied on every route,
// not only when a component that happens to call useThemeStore() mounts.
import { useThemeStore } from '@/stores/themeStore';
useThemeStore();
</script>

<template>
  <router-view />
</template>

<style>
/* Global resets if needed */
</style>
