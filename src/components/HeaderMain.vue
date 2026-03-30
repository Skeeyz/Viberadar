<script setup>
import { ChevronDown } from 'lucide-vue-next';
import SearchBar from './SearchBar.vue';
import { useAuthStore } from '@/stores/authStore.js';
import UserControl from './UserControl.vue';

const authStore = useAuthStore();
</script>
<template>
  <header class="header">
    <div class="header-top">
      <!-- Logo -->
      <RouterLink to="/" class="logo" aria-label="Viberadar Home">
        <span class="highlight">VIBE</span>RADAR
      </RouterLink>

      <!-- Menu -->


      <!-- Actions -->
      <div class="actions">
        <UserControl v-if="authStore.isAuthenticated" />

        <template v-else>
          <router-link to="/auth/signin" class="login">LOGIN</router-link>
          <router-link to="/auth/signup" class="signup-link">
            <button class="signup">SIGN UP</button>
          </router-link>
        </template>
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
  position: sticky;
  top: 0;
  z-index: 100;
}

/* TOP */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 32px;
  flex-wrap: wrap;
}

/* Logo */
.logo {
  font-weight: bold;
  font-size: 18px;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
}

.highlight {
  color: orange;
}

.nav {
  display: flex;
  gap: 25px;
  font-size: 14px;
  flex-wrap: wrap;
  justify-content: center;
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
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.login {
  color: #ddd;
  text-decoration: none;
  font-size: 13px;
}

.signup {
  background: #ff2c55;
  border: none;
  padding: 7px 12px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.2;
}

.header-bottom {
  padding: 0 32px 20px;
}

.search-wrapper {
  max-width: 760px;
  margin: auto;
  width: 100%;
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

@media (max-width: 1100px) {
  .header-top {
    padding: 12px 24px;
  }

  .header-bottom {
    padding: 0 24px 18px;
  }

  .nav {
    gap: 16px;
    font-size: 13px;
  }
}

@media (max-width: 820px) {
  .header-top {
    flex-direction: column;
    align-items: stretch;
  }

  .logo {
    text-align: center;
  }

  .nav {
    justify-content: center;
  }

  .actions {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .header-top {
    padding: 12px 16px;
  }

  .header-bottom {
    padding: 0 16px 16px;
  }

  .nav {
    gap: 12px;
    font-size: 12px;
  }

  .nav-item,
  .nav > a {
    width: 100%;
    text-align: center;
  }

  .nav-link {
    justify-content: center;
  }

  .dropdown {
    left: 50%;
    transform: translate(-50%, 10px);
    min-width: 180px;
  }

  .nav-item:hover .dropdown {
    transform: translate(-50%, 0);
  }

  .actions {
    width: 100%;
    gap: 10px;
  }

  .signup {
    width: 100%;
    padding: 10px 14px;
  }
}
</style>
