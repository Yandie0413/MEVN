<script setup lang="ts">
import Sidebar from '@/components/dashboard/Sidebar.vue';
</script>

<template>
  <div class="h-screen bg-edu-bg w-full flex overflow-hidden font-sans">
      
      <!-- Sidebar -->
      <div class="p-4 flex-shrink-0 h-full">
        <Sidebar />
      </div>

      <!-- Main Content — RouterView renders the active child page -->
      <main class="flex-1 h-full overflow-y-auto pt-6 px-8 pb-10">
        <RouterView />
      </main>
  </div>
</template>
