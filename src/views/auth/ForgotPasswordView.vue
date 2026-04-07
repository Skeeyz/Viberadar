<template>
  <div class="flex flex-col items-center">
    
    <div class="w-full space-y-2 mb-6 text-center">
      <h2 class="text-xl font-semibold text-white">Reset your password</h2>
    </div>

    <form @submit.prevent="handleSendEmail" class="w-full space-y-6">
      
      <div class="relative">
        <input 
          v-model="email"
          type="email" 
          placeholder="Enter your registered Email" 
          required
          class="w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
        />
      </div>

      <button 
        type="submit" 
        class="w-full py-3 bg-transparent border border-cyan-500 text-white rounded-lg font-bold tracking-[0.2em] hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
      >
        SEND
      </button>

      <div class="flex items-center gap-2 p-4 bg-cyan-950/40 rounded-lg border border-cyan-900">
        <i class="fas fa-info-circle text-cyan-400"></i>
        <p class="text-gray-300 text-sm">
          We will send a secure link to your email to recover your account.
        </p>
      </div>

      <div class="text-center mt-4">
        <router-link to="/auth/signin" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
          &larr; Back to Sign in
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
const email = ref('');
const authStore = useAuthStore();
const handleSendEmail = async() => {
  const success = await authStore.handleForgotPassword(email.value);
  console.log(`Gửi yêu cầu reset pass cho: ${email.value}`);
};
</script>