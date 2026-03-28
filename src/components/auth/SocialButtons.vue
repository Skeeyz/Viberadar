<template>
  <div class="flex flex-col gap-4 w-full mt-4">
    <div class="relative flex items-center justify-center mb-2">
      <div class="border-t border-gray-700 w-full"></div>
      <span class="bg-[#1a1c1e] px-3 text-gray-500 text-xs absolute uppercase tracking-widest">Or</span>
    </div>

    <button 
      type="button"
      class="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg transition-all duration-300 font-bold text-sm shadow-lg shadow-blue-500/20"
      @click="$emit('social-click', 'facebook')"
    >
      <i class="fab fa-facebook-f text-lg"></i>
      {{ actionType }} Facebook
    </button>

    <button 
      type="button"
      class="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all duration-300 font-bold text-sm shadow-lg shadow-white/10"
      @click="$emit('social-click', 'google')"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" alt="Google">
      {{ actionType }} Google
    </button>
  </div>
</template>

<script setup>
// Nhận props để hiển thị chữ "Sign in with" hoặc "Sign up with" tùy trang
defineProps({
  actionType: {
    type: String,
    default: 'Sign in with'
  }
});

// Khai báo sự kiện gửi lên cha
defineEmits(['social-click']);
</script>