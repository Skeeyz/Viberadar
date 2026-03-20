<script setup>
import { ChevronDown } from 'lucide-vue-next';
import SearchBar from './SearchBar.vue';
</script>
<template>
  <header class="header">
    <div class="header-top">
      <!-- Logo -->
      <div class="logo">
        <span class="highlight">VIBE</span>RADAR
      </div>

      <!-- Menu -->
      <nav class="nav">
  <!-- HOME -->
  <div class="nav-item">
    <span class="nav-link">
      HOME <ChevronDown class="icon" />
    </span>
    <div class="dropdown">
      <a href="#">Home 1</a>
      <a href="#">Home 2</a>
    </div>
  </div>

  <!-- MOVIES -->
  <div class="nav-item">
    <span class="nav-link">
      MOVIES <ChevronDown class="icon" />
    </span>
    <div class="dropdown">
      <a href="#">Home 1</a>
      <a href="#">Home 2</a>
    </div>
  </div>
  <!-- NEWS -->
  <div class="nav-item">
    <span class="nav-link">
      NEWS <ChevronDown class="icon" />
    </span>
    <div class="dropdown">
      <a href="#">Home 1</a>
      <a href="#">Home 2</a>
    </div>
  </div>

  <!-- COMMUNITY -->
  <div class="nav-item">
    <span class="nav-link">
      COMMUNITY <ChevronDown class="icon" />
    </span>
    <div class="dropdown">
      <a href="#">Home 1</a>
      <a href="#">Home 2</a>
    </div>
  </div>

  <!-- PAGE -->
  <div class="nav-item">
    <span class="nav-link">
      PAGE <ChevronDown class="icon" />
    </span>
    <div class="dropdown">
      <a href="#">Home 1</a>
      <a href="#">Home 2</a>
    </div>
  </div>

  <!-- HELP (no dropdown) -->
  <a href="#">HELP</a>
</nav>

      <!-- Actions -->
      <div class="actions">
        <a href="#" class="login">LOGIN</a>
        <button class="signup">SIGN UP</button>
      </div>
    </div>

    <div class="header-bottom">
  <div class="search-wrapper">
    <SearchBar />
  </div>
</div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(180deg, #0c1323, #0a1830);
  color: white;
}

/* TOP */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
}

/* Logo */
.logo {
  font-weight: bold;
  font-size: 20px;
}

.highlight {
  color: orange;
}

.nav {
  display: flex;
  gap: 25px;
  font-size: 14px;
}

/* Nav item */
.nav-item {
  position: relative;
  cursor: pointer;
}

.nav-item span {
  color: #ddd;
}

.nav-item:hover span {
  color: white;
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: 30px;
  left: 0;
  background: #111;
  border-radius: 6px;
  padding: 10px 0;
  min-width: 150px;

  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: 0.3s;
  z-index: 10;
}

.dropdown a {
  display: block;
  padding: 8px 15px;
  color: #ccc;
  text-decoration: none;
  font-size: 13px;
}

.dropdown a:hover {
  background: #222;
  color: white;
}

/* Show dropdown */
.nav-item:hover .dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.login {
  color: #ddd;
  text-decoration: none;
}

.signup {
  background: #ff2c55;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

/* BOTTOM (SEARCH AREA) */
.header-bottom {
  padding: 20px 40px 40px;
}

.search-wrapper {
  max-width: 800px;
  margin: auto;
}

/* Fake search (placeholder) */
.search-placeholder {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255,255,255,0.05);
  padding: 12px;
  border-radius: 10px;
}

.type {
  color: red;
  font-size: 14px;
  font-weight: bold;
}

.input-fake {
  flex: 1;
  height: 36px;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  position: relative;
}


.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ddd;
}

.icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: 0.3s;
}

/* xoay icon khi hover */
.nav-item:hover .icon {
  transform: rotate(180deg);
}
</style>
