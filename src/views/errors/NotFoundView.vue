<template>
  <div class="not-found-container flex items-center justify-center min-h-[80vh] px-6">
    <div class="text-center space-y-8 max-w-lg">
      
      <div class="relative">
        <h1 class="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 leading-none select-none">
          404
        </h1>
        <div class="absolute inset-0 flex items-center justify-center -z-10 blur-3xl opacity-20">
           <div class="w-64 h-64 bg-cyan-500 rounded-full"></div>
        </div>
      </div>

      <div class="space-y-3">
        <h2 class="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
          Lost in Space?
        </h2>
        <p class="text-gray-400 text-sm md:text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button 
          @click="$router.back()" 
          class="w-full sm:w-auto px-8 py-3 bg-gray-800/50 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all flex items-center justify-center gap-2"
        >
          <i class="fas fa-arrow-left text-xs"></i>
          Go Back
        </button>

        <router-link 
          to="/" 
          class="w-full sm:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
        >
          <i class="fas fa-home"></i>
          Back to Home
        </router-link>
      </div>

      <div class="pt-12">
        <p class="text-gray-600 text-xs uppercase tracking-[0.2em]">
          Viberadar Security System
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.not-found-container {
  background: radial-gradient(circle at center, rgba(6, 182, 212, 0.05) 0%, transparent 70%);
}

.text-navy-900 {
  color: #020617;
}

h1 {
  animation: floating 4s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.3));
}

@keyframes floating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>