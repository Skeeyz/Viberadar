<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="logo">
        <span class="logo-vibe">VIBE</span><span class="logo-radar">RADAR</span>
      </div>
      <p class="footer-copy">© {{ year }} VibeRadar. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Use</a>
        <a href="#">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style scoped>
.footer {
  background: #080c12;
  border-top: 1px solid #1e2530;
  padding: 2rem;
  margin-top: 2rem;
}
.logo {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 1px;
  white-space: nowrap;
}
.logo-vibe  { color: #f5820a; }
.logo-radar { color: #fff; }

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.footer-brand {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 2px;
  color: #fff;
}
.footer-brand span { color: #e8b84b; }
.footer-copy { font-size: 0.78rem; color: #666; }
.footer-links { display: flex; gap: 1.2rem; }
.footer-links a {
  color: #888;
  text-decoration: none;
  font-size: 0.78rem;
  transition: color 0.2s;
}
.footer-links a:hover { color: #e8b84b; }
</style>
