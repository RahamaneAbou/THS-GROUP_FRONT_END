<template>
  <div>
    <!-- Affiche PageAccueil uniquement sur la route '/' -->
    <PageAccueil v-if="$route.path === '/'" />

    <!-- Affiche les autres pages normalement -->
    <router-view />
  </div>
</template>

<script>
import PageAccueil from './views/PageAccueil.vue';

export default {
  name: "App",
  components: {
    PageAccueil
  }
};
</script>
