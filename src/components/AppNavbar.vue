<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <div class="logo">
        <span class="logo-vibe">VIBE</span><span class="logo-radar">RADAR</span>
      </div>
      <ul class="nav-links">
        <li v-for="item in leftLinks" :key="item.label" class="nav-item">
          <a href="#" class="nav-link">
            {{ item.label }}
            <span v-if="item.dropdown" class="chevron">▾</span>
          </a>
        </li>
      </ul>
      <ul class="nav-links nav-right">
        <li class="nav-item"><a href="#" class="nav-link">PAGE ▾</a></li>
        <li class="nav-item"><a href="#" class="nav-link">HELP</a></li>
        <li class="nav-item"><a href="#" class="nav-link">LOGIN</a></li>
        <li class="nav-item"><a href="#" class="btn-signup">SIGN UP</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
  props: {
    leftLinks: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600&display=swap');

.navbar {
  background-color: #0f1923;
  border-bottom: 1px solid #1e2d3d;
  font-family: 'Barlow Condensed', sans-serif;
  position: sticky; top: 0; z-index: 100;
}
.navbar-inner {
  display: flex; align-items: center;
  padding: 0 20px; height: 44px; gap: 4px;
}
.logo {
  font-size: 1.2rem; font-weight: 800;
  letter-spacing: 1px; margin-right: 12px; white-space: nowrap;
}
.logo-vibe { color: #f5820a; }
.logo-radar { color: #fff; }

.nav-links { display: flex; align-items: center; list-style: none; flex: 1; }
.nav-right  { flex: 0; margin-left: auto; }

.nav-link {
  display: flex; align-items: center; gap: 3px;
  color: #b0c0d0; text-decoration: none;
  font-size: 0.82rem; font-weight: 600; letter-spacing: 0.5px;
  padding: 0 10px; height: 44px; white-space: nowrap;
  transition: color 0.15s, background 0.15s;
}
.nav-link:hover { color: #fff; background: rgba(255,255,255,0.05); }
.chevron { font-size: 0.6rem; opacity: 0.6; }

.btn-signup {
  background: #e8193c; color: #fff !important; text-decoration: none;
  font-size: 0.82rem; font-weight: 700; letter-spacing: 0.8px;
  padding: 6px 16px; margin-left: 6px;
  display: inline-flex; align-items: center; height: 32px;
  transition: background 0.15s;
}
.btn-signup:hover { background: #ff2248; }
</style>