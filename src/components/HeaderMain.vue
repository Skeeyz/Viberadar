<script setup>
import { ChevronDown } from 'lucide-vue-next';
// import SearchBar from './SearchBar.vue';
import { useAuthStore } from '@/stores/authStore.js';
import UserControl from './UserControl.vue';
import MovieSearch  from '@/components/MovieSearch.vue';

const authStore = useAuthStore();
</script>
<template>
  <header class="header">
    <div class="header-top">
      <!-- Logo -->
      <RouterLink to="/home" class="logo" aria-label="Viberadar Home">
        <span class="highlight">VIBE</span>RADAR
      </RouterLink>

      <!-- Menu -->
      <div class="search-wrapper">
        <!-- <SearchBar /> -->
        <MovieSearch />
      </div>

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

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  gap: 20px;
  padding: 14px 32px;
  position: relative;
}

/* Logo */
.logo {
  flex: 1; 
  font-weight: bold;
  font-size: 20px;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.search-wrapper {
  flex: 2;
  max-width: 600px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
}

.highlight {
  color: orange;
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


/* Actions */
.actions {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end; /* Đẩy nội dung về cuối */
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


.icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: 0.3s;
}


@media (max-width: 1100px) {
  .header-top {
    padding: 12px 24px;
  }

  .header-bottom {
    padding: 0 24px 18px;
  }

}

@media (max-width: 820px) {
  .header-top {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .logo, .search-wrapper, .actions {
    flex: none;
    width: 100%;
    justify-content: center;
    text-align: center;
  }


  .search-wrapper {
    order: 3;
  }
  
}

@media (max-width: 640px) {
  .header-top {
    padding: 12px 16px;
  }

  .header-bottom {
    padding: 0 16px 16px;
  }

  .dropdown {
    left: 50%;
    transform: translate(-50%, 10px);
    min-width: 180px;
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
