<template>
  <div class="section-header">
    <h2 class="title">{{ title }}</h2>
    <div class="header-right">
      <slot />
      <router-link
        v-if="viewAll && section"
        :to="{ name: 'ViewAll', params: { section } }"
        class="view-all-link"
      >
        View all →
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title:   { type: String, required: true },
    viewAll: { type: Boolean, default: false },
    section: { type: String, default: '' },      // ← thêm prop này
  },
}
</script>
<style>
.view-all-link {
  color: #e8b84b;          /* màu vàng gold như mẫu */
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;  /* ← thêm dòng này */
  gap: 1rem;
  margin-bottom: 1rem;
}
.view-all-link:hover { color: #f5c842; }
</style>