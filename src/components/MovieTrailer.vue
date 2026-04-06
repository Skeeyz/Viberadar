<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div
      class="modal-box"
      :class="{ 'no-trailer-mode': !trailerKey }"
    >
      <button class="close-btn" @click="$emit('close')">✕</button>
      <iframe
        v-if="trailerKey"
        :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      />
      <p v-else class="no-trailer">Không tìm thấy trailer.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show:       { type: Boolean, default: false },
  trailerKey: { type: String,  default: null  },
})
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  position: relative;
  width: 85vw;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: visible;
}

/* Normal mode: iframe fills the box */
.modal-box iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

/* No‑trailer mode: flex centering */
.modal-box.no-trailer-mode {
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255,255,255,0.3);
}

.no-trailer {
  text-align: center;
  color: #ccc;
  font-size: 1rem;
  margin: 0; /* remove any default margin that could offset centering */
}
</style>