<template>
  <div class="flex flex-col items-center">
    <div v-if="isSent" class="w-full text-center space-y-6 animate-fade-in">
      <div class="flex justify-center">
        <div class="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <i class="fas fa-paper-plane text-3xl text-cyan-400"></i>
        </div>
      </div>
      
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-white">Check your email</h2>
        <p class="text-gray-400">
          We've sent a password reset link to <br/>
          <span class="text-cyan-400 font-medium">{{ email }}</span>
        </p>
      </div>

      <div class="p-4 bg-cyan-950/30 rounded-lg border border-cyan-900/50 text-sm text-gray-300">
        Didn't receive the email? Check your spam folder or try again in a few minutes.
      </div>

      <button 
        @click="isSent = false" 
        class="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
      >
        Try another email address
      </button>

      <div class="pt-4 border-t border-gray-800">
        <router-link to="/auth/signin" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
          &larr; Back to Sign in
        </router-link>
      </div>
    </div>

    <template v-else>
      <div class="w-full space-y-2 mb-6 text-center">
        <h2 class="text-xl font-semibold text-white">Reset your password</h2>
        <p class="text-gray-400 text-sm">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      <form @submit.prevent="handleSendEmail" class="w-full space-y-6">
        <div class="relative">
          <input 
            v-model="email"
            type="email" 
            placeholder="Enter your registered Email" 
            required
            :disabled="isLoading"
            class="w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 bg-transparent border border-cyan-500 text-white rounded-lg font-bold tracking-[0.2em] hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] flex justify-center items-center gap-2"
        >
          <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isLoading ? 'SENDING...' : 'SEND' }}
        </button>

        <div class="flex items-center gap-3 p-4 bg-cyan-950/40 rounded-lg border border-cyan-900">
          <i class="fas fa-info-circle text-cyan-400 text-lg"></i>
          <p class="text-gray-300 text-xs leading-relaxed">
            We will send a secure link to your email to recover your account.
          </p>
        </div>

        <div class="text-center mt-4">
          <router-link to="/auth/signin" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
            &larr; Back to Sign in
          </router-link>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

const email = ref('');
const isLoading = ref(false);
const isSent = ref(false);

const authStore = useAuthStore();

const handleSendEmail = async () => {
  if (!email.value) return;

  isLoading.value = true;
  
  try {
    const result = await authStore.handleForgotPassword(email.value);
    
    if (result && result.success) {
      isSent.value = true;
      console.log(`Success: Reset request sent for ${email.value}`);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: result?.message || 'Server connection lost. Please try again.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#06b6d4'
      });
    }
  } catch (error) {
    console.error("View Execution Error:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred. Please refresh the page.',
      background: '#0f172a',
      color: '#fff'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>