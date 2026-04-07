<template>
  <div class="flex flex-col items-center">
    
    <div class="w-full space-y-2 mb-6 text-center">
      <h2 class="text-xl font-semibold text-white">Create New Password</h2>
      <p class="text-gray-400 text-sm">Please enter your new secure password below.</p>
    </div>

    <form @submit.prevent="handleReset" class="w-full space-y-5">
      
      <div class="relative">
        <input 
          v-model="newPassword"
          :type="showPassword ? 'text' : 'password'" 
          placeholder="New Password (min 6 characters)" 
          required
          class="w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
        />
      </div>

      <div class="relative">
        <input 
          v-model="confirmPassword"
          :type="showPassword ? 'text' : 'password'" 
          placeholder="Confirm New Password" 
          required
          :class="[
            'w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 outline-none transition-all',
            isMatch ? 'focus:ring-cyan-500' : 'focus:ring-red-500 ring-1 ring-red-500/50'
          ]"
        />
        <p v-if="confirmPassword && !isMatch" class="text-red-400 text-xs mt-2 ml-1 animate-pulse">
          Passwords do not match!
        </p>
      </div>

      <div class="flex items-center gap-2 px-1">
        <input type="checkbox" id="toggle" v-model="showPassword" class="accent-cyan-500" />
        <label for="toggle" class="text-gray-400 text-xs cursor-pointer select-none">Show passwords</label>
      </div>

      <button 
        type="submit" 
        :disabled="isLoading || !isMatch || newPassword.length < 6"
        class="w-full py-3 bg-transparent border border-cyan-500 text-white rounded-lg font-bold tracking-[0.2em] hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
      >
        <span v-if="!isLoading">RESET PASSWORD</span>
        <span v-else class="animate-pulse text-cyan-400">PROCESSING...</span>
      </button>

      <div class="text-center mt-4">
        <router-link to="/auth/signin" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
          &larr; Back to Sign in
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const isLoading = ref(false);

// Lấy token từ URL (?token=xxxx)
const token = route.query.token;

// Kiểm tra khớp mật khẩu
const isMatch = computed(() => {
  if (!confirmPassword.value) return true;
  return newPassword.value === confirmPassword.value;
});

onMounted(() => {
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Access',
      text: 'No reset token found. Please request a new link.',
      background: '#0f172a',
      color: '#fff'
    });
    router.push('/auth/forgot-password');
  }
});

const handleReset = async () => {
  if (!isMatch.value || newPassword.value.length < 6) return;

  isLoading.value = true;
  try {
    console.log("Token nhận được:", token);
    // Gọi hàm resetPassword trong authStore (Bạn cần định nghĩa hàm này)
    const success = await authStore.handleResetPassword(token, newPassword.value);
    
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your password has been reset successfully.',
        timer: 3000,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#fff'
      });
      router.push('/auth/signin');
    }
  } catch (error) {
    console.error("Reset failed:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>