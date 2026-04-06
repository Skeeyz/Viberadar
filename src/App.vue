<script setup>
  import { RouterView } from 'vue-router';
  import { onMounted } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  
  const authStore = useAuthStore();

  onMounted(async () => {
    if (authStore.token) {
      await authStore.checkAuth();
    }
  });
</script>
<template>
  <RouterView />
</template>
<style>
body {
  margin: 0;
  padding: 0;
  background-color: #020617;
  color: white;
  font-family: 'Inter', sans-serif;
}

#app {
  min-height: 100vh;
}

/* * { margin: 0; padding: 0; box-sizing: border-box; }
body { margin: 0; background: #0d1720; } */
</style>
