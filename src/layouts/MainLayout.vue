<template>
  <div class="main-layout">
    <AppNavbar />
    <main class="main-content">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import AppNavbar from '../components/AppNavbar.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'MainLayout',
  components: { AppNavbar, Footer },
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0d1117;
  font-family: 'Barlow', sans-serif;
  color: #e0e0e0;
}
.main-content { flex: 1; }
</style>
