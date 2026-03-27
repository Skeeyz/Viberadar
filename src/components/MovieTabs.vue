<template>
  <div class="content-area">
    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <!-- Overview Tab -->
    <MovieTabOverview
      v-if="activeTab === 'Overview'"
      :movie="movie"
      @switch-tab="activeTab = $event"
    />

    <!-- Cast & Crew Tab -->
    <MovieTabCastCrew
      v-else-if="activeTab === 'Cast & Crew'"
      :movie="movie"
    />

    <!-- Reviews Tab -->
    <MovieReviews
      v-else-if="activeTab === 'Reviews'"
      :movie="movie"
    />

    <!-- Other Tabs -->
    <div v-else class="tab-content">
      <p class="coming-soon">{{ activeTab }} content coming soon.</p>
    </div>
  </div>
</template>

<script>
import MovieTabOverview from '@/components/MovieTabOverview.vue'
import MovieTabCastCrew from '@/components/MovieTabCastCrew.vue'
import MovieReviews from '@/components/MovieReviews.vue';

export default {
  name: 'MovieTabs',
  components: { MovieTabOverview, MovieTabCastCrew, MovieReviews },
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeTab: 'Overview',
      tabs: ['Overview', 'Cast & Crew', 'Reviews', 'Media'],
    }
  },
}
</script>

<style scoped>
.content-area { background: #111e2b; padding: 0 32px 48px; }

.tabs { display: flex; border-bottom: 2px solid #1e2d3d; margin-bottom: 32px; }
.tab {
  background: none; border: none; color: #7a9ab8;
  font-family: 'Barlow', sans-serif; font-size: 0.95rem; font-weight: 600;
  padding: 14px 20px; cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s; letter-spacing: 0.2px;
}
.tab:hover { color: #c0d4e8; }
.tab.active { color: #fff; border-bottom-color: #e8193c; }

.coming-soon { color: #8899aa; padding: 32px 0; }
</style>