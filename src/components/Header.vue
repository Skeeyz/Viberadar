<template>
  <div class="section-header">
    <h2 class="section-title">{{ title }}</h2>
    <slot />
    <a v-if="viewAll" href="#" class="view-all">View all →</a>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: { type: String, required: true },
    viewAll: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.section-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.25rem;
  color: #fff;
  letter-spacing: 1px;
}
.view-all {
  margin-left: auto;
  color: #e8b84b;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  transition: color 0.2s;
}
.view-all:hover { color: #f5c842; }
</style>
