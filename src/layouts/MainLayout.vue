<script setup lang="ts">
import Footer from '@/components/FooterMain.vue';
import Header from '@/components/HeaderMain.vue';
</script>
<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(245, 158, 11, 0.12), transparent 28%),
    linear-gradient(180deg, #08111f 0%, #0b1424 38%, #0f172a 100%);
}

.main-content {
  flex: 1;
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
    padding: 32px 0 48px;
}
</style>
<template>
  <div class = "app-layout">
  <Header />
  <main class = "main-content">
    <router-view />
    </main>
  <Footer />
  </div>
</template>
