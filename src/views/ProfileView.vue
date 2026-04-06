<template>
  <div class="profile-page">
    <div class="profile-container">
      <transition name="page-fade" appear>
        <div class="profile-card glass-ui">
          
          <div class="profile-header">
            <div class="cover-photo"></div>
            <div class="avatar-section">
              <div class="avatar-wrapper shadow-pop">
                <div class="avatar-placeholder" v-if="!isImgLoaded"></div>
                <img 
                  :src="user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name" 
                  alt="User Avatar"
                  @load="onImageLoad"
                  :class="{ 'img-loaded': isImgLoaded }"
                  loading="lazy"
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
            <div 
              v-for="(stat, index) in stats" 
              :key="index"
              class="stat-item" 
              @click="stat.action"
              :style="{ '--delay': index * 0.05 + 's' }" 
            >
              <span class="stat-value" :class="{ 'loading-shimmer': favoriteStore.loading }">
                {{ stat.value }}
              </span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>

          <div class="profile-content">
            <div class="section-header">
              <h2 class="section-title">Account Settings</h2>
              <div class="badge-status">Verified Account</div>
            </div>
            
            <form @submit.prevent="updateProfile" class="settings-form">
              <div class="input-group">
                <label class="field-label">Display Name</label>
                <div class="input-wrapper" :class="{ 'is-focused': activeField === 'name', 'has-error': errors.name }">
                  <User size="18" class="input-icon" />
                  <input 
                    type="text" 
                    v-model="formData.name" 
                    @focus="activeField = 'name'"
                    @blur="activeField = ''"
                    @input="validateName"
                    placeholder="Enter your name" 
                  />
                </div>
                <div class="error-container">
                   <transition name="error-slide">
                     <p v-if="errors.name" class="error-msg">{{ errors.name }}</p>
                   </transition>
                </div>
              </div>

              <div class="input-group">
                <label class="field-label">Email Address</label>
                <div class="input-wrapper disabled-box">
                  <Mail size="18" class="input-icon" />
                  <input type="email" :value="user?.email" disabled />
                </div>
              </div>

              <div class="form-actions">
                <button 
                  type="submit" 
                  class="save-btn" 
                  :disabled="isSaving || !isNameChanged || !!errors.name"
                  :class="{ 'btn-ready': isNameChanged && !errors.name }"
                >
                  <span v-if="!isSaving">Save Changes</span>
                  <div v-else class="mini-loader"></div>
                </button>
              </div>
            </form>

            <template v-if="method === 'default'">
              <div class="section-divider"></div>
              <div class="section-header">
                <h2 class="section-title">Security & Password</h2>
              </div>

              <form @submit.prevent="handleUpdatePassword" class="settings-form">
                <div class="input-group">
                  <label class="field-label">Current Password</label>
                  <div class="input-wrapper" :class="{ 'is-focused': activeField === 'oldPass', 'has-error': errors.currentPassword }">
                    <Lock size="18" class="input-icon" />
                    <input 
                      type="password" 
                      v-model="passwordData.currentPassword" 
                      @focus="activeField = 'oldPass'"
                      @blur="activeField = ''"
                      @input="validatePasswords"
                      placeholder="••••••••" 
                    />
                  </div>
                  <div class="error-container">
                    <transition name="error-slide">
                      <p v-if="errors.currentPassword" class="error-msg">{{ errors.currentPassword }}</p>
                    </transition>
                  </div>
                </div>

                <div class="input-grid-row">
                  <div class="input-group">
                    <label class="field-label">New Password</label>
                    <div class="input-wrapper" :class="{ 'is-focused': activeField === 'newPass', 'has-error': errors.newPassword }">
                      <Key size="18" class="input-icon" />
                      <input 
                        type="password" 
                        v-model="passwordData.newPassword" 
                        @focus="activeField = 'newPass'"
                        @blur="activeField = ''"
                        @input="validatePasswords"
                        placeholder="Min 6 characters" 
                      />
                    </div>
                    <div class="error-container">
                      <transition name="error-slide">
                        <p v-if="errors.newPassword" class="error-msg">{{ errors.newPassword }}</p>
                      </transition>
                    </div>
                  </div>

                  <div class="input-group">
                    <label class="field-label">Confirm Password</label>
                    <div class="input-wrapper" :class="{ 'is-focused': activeField === 'confirmPass', 'has-error': errors.confirmPassword }">
                      <ShieldCheck size="18" class="input-icon" />
                      <input 
                        type="password" 
                        v-model="passwordData.confirmPassword" 
                        @focus="activeField = 'confirmPass'"
                        @blur="activeField = ''"
                        @input="validatePasswords"
                        placeholder="Repeat new password" 
                      />
                    </div>
                    <div class="error-container">
                      <transition name="error-slide">
                        <p v-if="errors.confirmPassword" class="error-msg">{{ errors.confirmPassword }}</p>
                      </transition>
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button 
                    type="submit" 
                    class="save-btn secondary-btn" 
                    :disabled="isSavingPassword || !canUpdatePassword"
                    :class="{ 'btn-ready-alt': canUpdatePassword }"
                  >
                    <span v-if="!isSavingPassword">Update Password</span>
                    <div v-else class="mini-loader"></div>
                  </button>
                </div>
              </form>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
// (Giữ nguyên phần Script của bạn vì logic JS không gây khựng bằng CSS/DOM)
import { ref, computed, onMounted } from 'vue';
import { Camera, Mail, User, Lock, Key, ShieldCheck } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useFavoriteStore, useWatchlistStore, useProfileStore } from '@/stores/userStore';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();
const favoriteStore = useFavoriteStore();
const watchlistStore = useWatchlistStore();
const profileStore = useProfileStore();
const method = localStorage.getItem('auth_method');

const user = computed(() => authStore.user);
const isSaving = ref(false);
const isSavingPassword = ref(false);
const isImgLoaded = ref(false);
const activeField = ref('');

const formData = ref({ name: user.value?.name || '' });
const passwordData = ref({ currentPassword: '', newPassword: '', confirmPassword: '' });
const errors = ref({ name: '', currentPassword: '', newPassword: '', confirmPassword: '' });

const validateName = () => {
  errors.value.name = formData.value.name.trim().length < 2 ? 'Name must be at least 2 characters' : '';
};

const validatePasswords = () => {
  errors.value.currentPassword = (passwordData.value.currentPassword.length > 0 && passwordData.value.currentPassword.length < 6) ? 'Min 6 characters' : '';
  errors.value.newPassword = (passwordData.value.newPassword.length > 0 && passwordData.value.newPassword.length < 6) ? 'Min 6 characters' : '';
  errors.value.confirmPassword = (passwordData.value.confirmPassword && passwordData.value.newPassword !== passwordData.value.confirmPassword) ? 'Passwords do not match' : '';
};

const isNameChanged = computed(() => formData.value.name.trim() !== (user.value?.name || '').trim());
const canUpdatePassword = computed(() => {
  return passwordData.value.currentPassword.length >= 6 && 
         passwordData.value.newPassword.length >= 6 && 
         passwordData.value.newPassword === passwordData.value.confirmPassword;
});

const stats = computed(() => [
  { label: 'Favorites', value: favoriteStore.favorites.length, action: () => router.push('/favorites') },
  { label: 'Watchlist', value: watchlistStore.watchlist.length, action: () => router.push('/watchlist') },
  { label: 'Member', value: 'Active', action: null }
]);

const onImageLoad = () => { isImgLoaded.value = true; };

const updateProfile = async () => {
  if (!isNameChanged.value || errors.value.name) return;
  isSaving.value = true;
  try {
    await profileStore.updateProfileName(formData.value.name);
    if (authStore.user) authStore.user.name = formData.value.name;
    showToast('Profile Updated!');
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Update failed!', background: '#0f172a', color: '#fff' });
  } finally { isSaving.value = false; }
};

const handleUpdatePassword = async () => {
  if (!canUpdatePassword.value) return;
  isSavingPassword.value = true;
  try {
    await profileStore.changePassword(passwordData.value.currentPassword, passwordData.value.newPassword);
    showToast('Password Changed!');
    passwordData.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Incorrect password!', background: '#0f172a', color: '#fff' });
  } finally { isSavingPassword.value = false; }
};

const showToast = (title: string) => {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#0f172a', color: '#fff', icon: 'success', title });
};

onMounted(() => {
  favoriteStore.fetchFavorites();
  watchlistStore.fetchWatchlist();
});
</script>

<style scoped>
/* --- 1. TỐI ƯU CUỘN (SCROLL PERFORMANCE) --- */
.profile-page {
  min-height: 100vh;
  padding: 60px 20px;
  background: radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent);
  /* Ép trình duyệt sử dụng GPU để render layer này */
  will-change: transform; 
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.profile-card {
  /* Chống giật khi cuộn qua các vùng blur nặng */
  transform: translateZ(0); 
}

.glass-ui {
  background: rgba(15, 23, 42, 0.85);
  /* Giảm bớt độ blur nếu máy yếu bị khựng, 12px là mức cân bằng */
  backdrop-filter: blur(12px); 
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
}

/* --- 2. CHIẾN THUẬT CHỐNG GIẬT BỐ CỤC (LAYOUT STABILITY) --- */
.error-container {
  min-height: 20px; /* Giữ chỗ trước cho thông báo lỗi để không bị đẩy layout khi lỗi hiện ra */
  margin-top: 4px;
}

/* --- 3. ANIMATIONS MƯỢT MÀ --- */
.page-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.error-slide-enter-active, .error-slide-leave-active {
  transition: all 0.2s ease-out;
}
.error-slide-enter-from, .error-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.stat-item {
  will-change: transform, background-color;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease;
}

.loading-shimmer {
  transform: translateZ(0);
  background: linear-gradient(90deg, transparent 25%, rgba(34, 211, 238, 0.1) 50%, transparent 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Avatar Wrapper */
.avatar-wrapper img {
  will-change: opacity;
  transition: opacity 0.4s ease-out;
}

/* Nút bấm & Input */
.input-wrapper, .save-btn {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.is-focused {
  border-color: #22d3ee;
  background: rgba(15, 23, 42, 0.6);
  box-shadow: 0 4px 12px rgba(34, 211, 238, 0.15);
}

.has-error {
  border-color: #fb7185 !important;
}

/* Rest of your CSS... */
.profile-container { max-width: 850px; margin: 0 auto; }
.cover-photo { height: 180px; background: linear-gradient(135deg, #0f172a 0%, #164e63 50%, #22d3ee 100%); }
.avatar-section { display: flex; align-items: flex-end; gap: 28px; padding: 0 48px; margin-top: -65px; }
.avatar-wrapper { position: relative; width: 130px; height: 130px; background: #0f172a; padding: 6px; border-radius: 35px; border: 1px solid rgba(255, 255, 255, 0.1); }
.avatar-placeholder { position: absolute; inset: 6px; background: #1e293b; border-radius: 30px; z-index: 1; }
.avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; border-radius: 30px; position: relative; z-index: 2; opacity: 0; }
.avatar-wrapper img.img-loaded { opacity: 1; }
.edit-avatar-btn { position: absolute; bottom: -8px; right: -8px; background: #22d3ee; color: #0f172a; border: none; width: 38px; height: 38px; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; box-shadow: 0 8px 20px rgba(34, 211, 238, 0.3); }
.user-meta .user-name { font-size: 32px; font-weight: 800; color: #fff; margin: 0; }
.user-meta .user-email { color: #64748b; font-size: 15px; margin: 4px 0 0 0; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 48px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.stat-item { text-align: center; padding: 24px; background: rgba(255, 255, 255, 0.02); border-radius: 24px; cursor: pointer; }
.stat-value { display: block; font-size: 28px; font-weight: 800; color: #22d3ee; }
.stat-label { font-size: 13px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; }
.profile-content { padding: 48px; }
.section-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); margin: 40px 0; }
.section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 32px; }
.section-title { font-size: 20px; font-weight: 700; color: #f8fafc; margin: 0; }
.badge-status { background: rgba(34, 211, 238, 0.1); color: #22d3ee; padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
.settings-form { display: flex; flex-direction: column; gap: 28px; }
.field-label { display: block; font-size: 14px; color: #94a3b8; margin-bottom: 10px; font-weight: 600; }
.input-wrapper { position: relative; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; }
.input-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #475569; }
.input-wrapper input { width: 100%; padding: 14px 16px 14px 52px; background: transparent; border: none; color: #fff; font-size: 15px; outline: none; }
.disabled-box { opacity: 0.5; cursor: not-allowed; }
.input-grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.error-msg { color: #fb7185; font-size: 12px; font-weight: 500; }
.save-btn { width: 100%; padding: 16px; border-radius: 16px; border: none; background: #1e293b; color: #475569; font-weight: 700; cursor: pointer; }
.secondary-btn { background: rgba(255, 255, 255, 0.03); color: #64748b; border: 1px solid rgba(255, 255, 255, 0.05); }
.btn-ready { background: #22d3ee !important; color: #0f172a !important; }
.btn-ready-alt { background: rgba(34, 211, 238, 0.1) !important; color: #22d3ee !important; border: 1px solid rgba(34, 211, 238, 0.3) !important; }
.mini-loader { width: 20px; height: 20px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 640px) { .input-grid-row, .stats-grid { grid-template-columns: 1fr; } .avatar-section { flex-direction: column; align-items: center; text-align: center; } }
</style>