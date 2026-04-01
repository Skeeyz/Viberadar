<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { ChevronDown, User, Heart, Bookmark, LogOut } from 'lucide-vue-next';

const authStore = useAuthStore();
const isDropdownOpen = ref(false);

const handleMouseEnter = () => {
  isDropdownOpen.value = true;
};

// Hàm đóng khi di chuột ra
const handleMouseLeave = () => {
  isDropdownOpen.value = false;
};

defineOptions({
  name: "UserControl"
})

const handleLogout = () => {
  authStore.logout();
  isDropdownOpen.value = false;
};
</script>

<template>
  <div 
    class="user-control" 
    @mouseenter="handleMouseEnter" 
    @mouseleave="handleMouseLeave"
  >
    <div class="user-info"> <div class="avatar-wrapper">
        <img 
          :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=' + authStore.user?.name" 
          alt="Avatar" 
          class="user-avatar"
        />
      </div>
      <span class="user-name">{{ authStore.user?.name }}</span>
      <ChevronDown class="icon-small" :class="{ 'rotate': isDropdownOpen }" />
    </div>

    <transition name="fade-slide">
      <div v-if="isDropdownOpen" class="user-dropdown">
        <router-link to="/profile" class="dropdown-item">
          <User class="item-icon" /> Profile
        </router-link>
        <router-link to="/favorites" class="dropdown-item">
          <Heart class="item-icon" /> Your Favorite Movie
        </router-link>
        <router-link to="/watchlist" class="dropdown-item">
          <Bookmark class="item-icon" /> Your WatchList
        </router-link>
        <hr class="divider" />
        <button @click="handleLogout" class="dropdown-item logout-btn">
          <LogOut class="item-icon" /> Sign out
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.user-control {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: 8px;
  transition: 0.2s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.05);
}

.avatar-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid orange;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #eee;
}

.icon-small {
  width: 16px;
  height: 16px;
  transition: 0.3s;
}

.icon-small.rotate {
  transform: rotate(180deg);
}

/* Dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 10px); 
  right: 0;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  z-index: 100;
  overflow: visible; 
}


.user-dropdown::before {
  content: "";
  position: absolute;
  top: -15px; 
  left: 0;
  width: 100%;
  height: 15px;
  background: transparent;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: 0.2s;
}

.dropdown-item:hover {
  background: #222;
  color: orange;
}

.item-icon {
  width: 16px;
  height: 16px;
}

.divider {
  border: 0;
  border-top: 1px solid #333;
  margin: 0;
}

.logout-btn {
  color: #ff4d4d;
}

.logout-btn:hover {
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
}

/* Animation */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: 0.2s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>