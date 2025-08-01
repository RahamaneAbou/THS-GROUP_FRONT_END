<template>
  <div>
    <!-- Affiche PageAccueil uniquement sur la route '/' -->
    <Text v-if="$route.path === '/'" />

    <!-- Affiche les autres pages normalement -->
    <router-view />
  </div>
</template>

<script>


export default {
  name: "App",
 
};
</script>
