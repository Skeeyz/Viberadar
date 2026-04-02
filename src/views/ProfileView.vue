<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-card glass-ui">
        <div class="profile-header">
          <div class="cover-photo"></div>
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img 
                :src="user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name" 
                alt="User Avatar" 
              />
              <button class="edit-avatar-btn" title="Change Avatar">
                <Camera size="18" />
              </button>
            </div>
            <div class="user-meta">
              <h1 class="user-name">{{ user?.name }}</h1>
              <p class="user-email">{{ user?.email }}</p>
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-item" @click="$router.push('/favorites')">
            <span class="stat-value">{{ favoriteStore.favorites.length }}</span>
            <span class="stat-label">Favorites</span>
          </div>
          <div class="stat-item" @click="$router.push('/watchlist')">
            <span class="stat-value">{{ watchlistStore.watchlist.length }}</span>
            <span class="stat-label">Watchlist</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">Active</span>
            <span class="stat-label">Member</span>
          </div>
        </div>

        <div class="profile-content">
          <div class="section-header">
            <h2 class="section-title">Account Settings</h2>
            <div class="badge">Verified</div>
          </div>
          
          <form @submit.prevent="updateProfile" class="settings-form">
            <div class="input-group">
              <label>Display Name</label>
              <div class="input-wrapper">
                <User size="18" class="input-icon" />
                <input type="text" v-model="formData.name" placeholder="Enter your name" />
              </div>
            </div>

            <div class="input-group">
              <label>Email Address</label>
              <div class="input-wrapper disabled">
                <Mail size="18" class="input-icon" />
                <input type="email" :value="user?.email" disabled />
              </div>
              <small class="helper-text">Your email is used for login and cannot be changed.</small>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="isSaving || !isChanged">
                <span v-if="!isSaving">Update Profile</span>
                <div v-else class="mini-loader"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Camera, Mail, User } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore';
import { useFavoriteStore, useWatchlistStore, useProfileStore } from '@/stores/userStore';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const favoriteStore = useFavoriteStore();
const watchlistStore = useWatchlistStore();
const profileStore = useProfileStore()

const user = computed(() => authStore.user);
const isSaving = ref(false);

const formData = ref({
  name: user.value?.name || '',
});

const isChanged = computed(() => formData.value.name !== user.value?.name);

const updateProfile = async () => {
  if (!isChanged.value) return;
  
  isSaving.value = true;
  try {
    await profileStore.updateProfileName(formData.value.name);
    authStore.user.name = formData.value.name;

  //   Swal.fire({
  //     icon: 'success',
  //     title: 'Profile Updated!',
  //     toast: true,
  //     position: 'top-end',
  //     timer: 2000,
  //     showConfirmButton: false,
  //     background: '#0f172a',
  //     color: '#fff'
  //   });
  } catch (error) {
    Swal.fire('Error', 'Something went wrong!', 'error');
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  favoriteStore.fetchFavorites();
  watchlistStore.fetchWatchlist();
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 60px 20px;
  background: radial-gradient(circle at top right, rgba(34, 211, 238, 0.05), transparent);
}

.profile-container {
  max-width: 850px;
  margin: 0 auto;
}

.glass-ui {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6);
}

/* Header & Avatar */
.cover-photo {
  height: 180px;
  background: linear-gradient(135deg, #0f172a 0%, #164e63 50%, #22d3ee 100%);
}

.avatar-section {
  display: flex;
  align-items: flex-end;
  gap: 28px;
  padding: 0 48px;
  margin-top: -65px;
}

.avatar-wrapper {
  position: relative;
  width: 130px;
  height: 130px;
  background: #0f172a;
  padding: 6px;
  border-radius: 35px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 30px;
}

.edit-avatar-btn {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: #22d3ee;
  color: #0f172a;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.3);
  transition: 0.3s;
}

.edit-avatar-btn:hover { transform: scale(1.1) rotate(10deg); }

.user-meta .user-name { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -1px; }
.user-meta .user-email { color: #64748b; font-size: 15px; }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-item {
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  cursor: pointer;
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.stat-item:hover {
  background: rgba(34, 211, 238, 0.05);
  border-color: rgba(34, 211, 238, 0.2);
  transform: translateY(-8px);
}

.stat-value { display: block; font-size: 28px; font-weight: 800; color: #22d3ee; margin-bottom: 4px; }
.stat-label { font-size: 13px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; }

/* Form Settings */
.profile-content { padding: 48px; }

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 32px;
}

.section-title { font-size: 20px; font-weight: 700; color: #f8fafc; }

.badge {
  background: rgba(34, 211, 238, 0.1);
  color: #22d3ee;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.settings-form { display: flex; flex-direction: column; gap: 28px; }

.input-group label {
  display: block;
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 10px;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: 0.3s;
}

.input-wrapper:focus-within {
  border-color: #22d3ee;
  background: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.1);
}

.input-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #475569; }

.input-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 52px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 15px;
  outline: none;
}

.input-wrapper.disabled { opacity: 0.5; cursor: not-allowed; }
.helper-text { font-size: 12px; color: #475569; margin-top: 8px; }

.save-btn {
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  border: none;
  background: #22d3ee;
  color: #0f172a;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.save-btn:hover:not(:disabled) {
  background: #67e8f9;
  box-shadow: 0 12px 24px rgba(34, 211, 238, 0.25);
  transform: translateY(-2px);
}

.save-btn:disabled {
  background: #1e293b;
  color: #475569;
  cursor: not-allowed;
}

.mini-loader {
  width: 22px;
  height: 22px;
  border: 3px solid #0f172a;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>