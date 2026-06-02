<template>
  <div id="app-layout">
    <!-- Barre de navigation optionnelle en haut -->
    <nav class="navbar">
      <router-link to="/" class="nav-logo">🧠 mini-Moodle</router-link>
      <router-link to="/profile" class="nav-profile-link">👤 Mon Profil</router-link>
    </nav>

    <!-- C'est ici que Vue Router va injecter HomeView.vue ou tes autres pages -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Styles globaux pour toute l'application */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f7fafc;
  color: #2d3748;
}

.navbar {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-logo {
  color: white;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: bold;
}

.main-content {
  min-height: calc(100vh - 60px);
}
.nav-profile-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  float: right;
  margin-top: 5px;
}
</style>