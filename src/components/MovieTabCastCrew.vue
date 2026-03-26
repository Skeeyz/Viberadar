<template>
  <div class="tab-content">
    <!-- Cast -->
    <section class="section">
      <h2 class="section-title">Cast</h2>
      <div class="cast-list-grid">
        <div
          v-for="actor in movie.cast"
          :key="actor.name"
          class="cast-list-card"
        >
          <div class="cast-list-avatar">
            <img v-if="actor.photo" :src="actor.photo" :alt="actor.name" />
            <div v-else class="avatar-placeholder">{{ actor.size }}</div>
          </div>
          <div>
            <div class="cast-name">{{ actor.name }}</div>
            <div class="cast-role">{{ actor.role }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Crew -->
    <section class="section">
      <h2 class="section-title">Crew</h2>
      <div class="crew-grid">
        <div
          v-for="member in movie.crew"
          :key="member.name + member.role"
          class="crew-item"
        >
          <div class="detail-label">{{ member.role }}</div>
          <div class="detail-value">{{ member.name }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MovieTabCastCrew',
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.tab-content { padding-top: 4px; }
.section { margin-bottom: 36px; }
.section-title {
  font-family: 'Barlow', sans-serif;
  font-size: 1.15rem; font-weight: 700; color: #e8f0f8; margin-bottom: 14px;
}

.cast-list-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
}
@media (max-width: 640px) { .cast-list-grid { grid-template-columns: repeat(2, 1fr); } }

.cast-list-card {
  display: flex; align-items: center; gap: 12px;
  background: #162230; padding: 12px 14px;
  border: 1px solid #1e2d3d;
  transition: border-color 0.15s, background 0.15s;
}
.cast-list-card:hover { border-color: #2e4a62; background: #1a2a3a; }
.cast-list-avatar {
  flex-shrink: 0; width: 50px; height: 50px; border-radius: 50%;
  background: #1e2d3d; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #2a3a4a;
}
.cast-list-avatar img { width: 100%; height: 100%; object-fit: cover; }

.avatar-placeholder { color: #3a5a7a; font-size: 0.6rem; font-weight: 600; text-align: center; }
.cast-name {
  font-size: 0.82rem; font-weight: 600; color: #c8daea; margin-bottom: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cast-role { font-size: 0.75rem; color: #5a7a9a; }

.detail-label {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 1px;
  color: #5a7a9a; text-transform: uppercase; margin-bottom: 4px;
}
.detail-value { font-size: 0.9rem; color: #c8daea; font-weight: 500; }

.crew-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px 32px; padding-top: 4px;
}
@media (max-width: 640px) { .crew-grid { grid-template-columns: repeat(2, 1fr); } }
.crew-item { border-top: 1px solid #1e2d3d; padding-top: 10px; }
</style>