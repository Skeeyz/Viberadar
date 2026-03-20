<script setup lang="ts">
import Footer from '@/components/FooterMain.vue';
import Header from '@/components/HeaderMain.vue';
import Navbar from '@/components/NavbarMain.vue';
</script>
<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
<template>
  <div class = "app-layout">
  <Header />
  <Navbar />
  <main class = "main-content">
    <router-view />
    </main>
  <Footer />
  </div>
</template>
