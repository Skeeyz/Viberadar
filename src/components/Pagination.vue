<template>
  <div class="pagination" v-if="totalPages > 1">
    <button :disabled="current <= 1" @click="$emit('change', current - 1)">‹</button>

    <button
      v-for="p in pages"
      :key="p"
      :class="{ active: p === current, dots: p === '...' }"
      :disabled="p === '...'"
      @click="p !== '...' && $emit('change', p)"
    >{{ p }}</button>

    <button :disabled="current >= totalPages" @click="$emit('change', current + 1)">›</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    current:    { type: Number, required: true },
    totalPages: { type: Number, required: true },
  },
  emits: ['change'],
  computed: {
    pages() {
      const { current: c, totalPages: t } = this
      if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
      if (c <= 4)  return [1, 2, 3, 4, 5, '...', t]
      if (c >= t - 3) return [1, '...', t-4, t-3, t-2, t-1, t]
      return [1, '...', c-1, c, c+1, '...', t]
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 1rem 0 0.5rem;
}
.pagination button {
  min-width: 32px; height: 32px;
  border-radius: 6px;
  border: 1px solid #1a2030;
  background: #141820;
  color: #aaa;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.pagination button:hover:not(:disabled):not(.dots) {
  background: #e8b84b; color: #000; border-color: #e8b84b;
}
.pagination button.active {
  background: #e8b84b; color: #000; border-color: #e8b84b; font-weight: 700;
}
.pagination button:disabled { opacity: 0.35; cursor: default; }
.pagination button.dots { border: none; background: transparent; cursor: default; }
</style>