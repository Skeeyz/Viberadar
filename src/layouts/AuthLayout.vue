<template>
  <div class="auth-container min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
       style="background-image: url('/bg-auth.png');">
    
    <div class="absolute inset-0 bg-black/60"></div>

    <main class="relative z-10 w-full max-w-[450px] px-6 py-10 
                 bg-gray-900/40 backdrop-blur-xl 
                 border border-cyan-500/50 rounded-[30px] 
                 shadow-[0_0_20px_rgba(6,182,212,0.2)] 
                 mx-4 transition-all duration-300">
      
      <div class="flex justify-center mb-8">
        <h1 class="text-3xl font-bold tracking-wider">
          <span class="text-orange-500">VIBE</span><span class="text-white">RADAR</span>
        </h1>
      </div>

      <router-view />

    </main>
  </div>
</template>
<script setup>
  import '@/assets/css/auth.css';
</script>
<style scoped>
.auth-container {
  /* Bạn có thể thêm font chữ chuyên biệt ở đây */
  font-family: 'Inter', sans-serif;
}

/* Hiệu ứng mượt mà khi chuyển giữa các trang auth */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>