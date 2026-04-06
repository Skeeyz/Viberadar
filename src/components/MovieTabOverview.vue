<template>
  <div class="tab-content">
    <!-- Synopsis -->
    <section class="section">
      <h2 class="section-title">Synopsis</h2>
      <p class="synopsis-text">{{ movie.synopsis }}</p>
    </section>

    <!-- Details -->
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">DIRECTOR</div>
        <div class="detail-value">{{ movie.director }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">WRITERS</div>
        <div class="detail-value">{{ movie.writers }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">RELEASE DATE</div>
        <div class="detail-value">{{ movie.release_date }}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">BOX OFFICE</div>
        <div class="detail-value">{{ movie.box_office }}</div>
      </div>
    </div>

    <!-- Top Cast -->
    <section class="section">
      <h2 class="section-title">Top Cast</h2>
      <div class="top-cast-grid">
        <div
          v-for="actor in movie.cast.slice(0, 5)"
          :key="actor.name"
          class="top-cast-card"
        >
          <div class="top-cast-avatar">
            <img v-if="actor.photo" :src="actor.photo" :alt="actor.name" />
            <div v-else class="avatar-placeholder">{{ actor.size }}</div>
          </div>
          <div class="cast-name">{{ actor.name }}</div>
          <div class="cast-role">{{ actor.role }}</div>
        </div>
      </div>
      <button class="btn-view-cast" @click="$emit('switch-tab', 'Cast & Crew')">
        View Full Cast
      </button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MovieTabOverview',
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  emits: ['switch-tab'],
}
</script>

<style scoped>
.tab-content { padding-top: 4px; }
.section { margin-bottom: 36px; }
.section-title {
  font-family: 'Barlow', sans-serif;
  font-size: 1.15rem; font-weight: 700; color: #e8f0f8; margin-bottom: 14px;
}

.synopsis-text { color: #8899aa; font-size: 0.9rem; line-height: 1.7; max-width: 760px; }

.details-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px 40px;
  padding: 20px 0 28px; border-top: 1px solid #1e2d3d;
  border-bottom: 1px solid #1e2d3d; margin-bottom: 36px;
}
.detail-label {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 1px;
  color: #5a7a9a; text-transform: uppercase; margin-bottom: 4px;
}
.detail-value { font-size: 0.9rem; color: #c8daea; font-weight: 500; }

.top-cast-grid { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
.top-cast-card {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; width: 110px;
}
.top-cast-avatar {
  width: 90px; height: 90px; border-radius: 50%;
  background: #1e2d3d; overflow: hidden; margin-bottom: 10px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #2a3a4a;
}
.top-cast-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder { color: #3a5a7a; font-size: 0.6rem; font-weight: 600; text-align: center; }
.cast-name {
  font-size: 0.82rem; font-weight: 600; color: #c8daea; margin-bottom: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cast-role { font-size: 0.75rem; color: #5a7a9a; }

.btn-view-cast {
  background: transparent; border: 1px solid #2a3a4a; color: #8899aa;
  font-family: 'Barlow', sans-serif; font-size: 0.82rem; font-weight: 600;
  padding: 9px 20px; cursor: pointer;
  transition: border-color 0.15s, color 0.15s; letter-spacing: 0.3px;
}
.btn-view-cast:hover { border-color: #5a7a9a; color: #c8daea; }
</style>