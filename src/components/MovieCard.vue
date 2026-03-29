<template>
  <div class="movie-card" @click="$emit('click', movie)">
    <div class="card-thumb">
      <img :src="movie.poster" :alt="movie.title" class="card-img" />

      <!-- HD Badge -->
      <span v-if="showHd" class="badge hd">HD</span>

      <!-- Episode badge  -->
      <span v-if="movie.episode" class="badge ep-badge">EP {{ movie.episode }}</span>

      <!-- Season badge -->
      <span v-if="movie.season" class="badge season-badge">S{{ movie.season }}</span>

      <!-- Hover overlay -->
      <div class="card-overlay">
        <div class="overlay-meta">
          <span class="score">★ {{ movie.score }}</span>
          <span class="year">{{ movie.year }}</span>
        </div>
        <div class="overlay-actions" @click.stop>
          <button class="action-btn" title="Watchlist">♥</button>
          <button class="action-btn" title="Bookmark">⊞</button>
        </div>
      </div>
    </div>

    <!-- Info below poster -->
    <div class="card-info">
      <p class="card-title">{{ movie.title }}</p>
      <div class="card-meta">
        <span class="meta-rating">{{ movie.rating_label || 'PG-13' }}</span>
        <span class="meta-year">{{ movie.year }}</span>
        <span v-if="movie.duration" class="meta-duration">· {{ movie.duration }}</span>
        <span v-if="movie.score" class="meta-score">· ★ {{ movie.score }}</span>
      </div>
      <div v-if="movie.genres?.length" class="card-genres">
        <span
          v-for="(genre, i) in displayGenres"
          :key="genre"
          class="genre-tag"
        >{{ genre }}<span v-if="i < displayGenres.length - 1"> · </span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  emits: ['click'],
  props: {
    movie:  { type: Object,  required: true },
    showHd: { type: Boolean, default: true },
  },
  computed: {
    displayGenres() {
      // genres có thể là array of string hoặc array of id
      const g = this.movie.genres || []
      return g.slice(0, 2)  // chỉ hiển thị 2 genre đầu
    },
  },
}
</script>

<style scoped>
.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.movie-card:hover { transform: translateY(-4px); }

/* ── Thumbnail ── */
.card-thumb {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 2/3;
  background: #1e2530;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s;
}
.movie-card:hover .card-img { transform: scale(1.05); }

/* ── Badges ── */
.badge {
  position: absolute;
  padding: 0.2rem 0.45rem;
  border-radius: 3px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  z-index: 2;
}
.hd         { top: 6px; left: 6px;  background: #e8b84b; color: #000; }
.ep-badge   { top: 6px; left: 6px;  background: #e74c3c; color: #fff; }
.season-badge { top: 6px; right: 6px; background: rgba(0,0,0,0.65); color: #fff; }

/* ── Hover overlay ── */
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.25s;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.7rem;
  z-index: 3;
}
.movie-card:hover .card-overlay { opacity: 1; }

.overlay-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.score {
  color: #f5c518;
  font-size: 0.78rem;
  font-weight: 700;
}
.year {
  color: #ccc;
  font-size: 0.72rem;
}

.overlay-actions {
  display: flex;
  gap: 0.4rem;
}
.action-btn {
  width: 30px; height: 30px;
  border-radius: 4px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
  transition: background 0.15s;
}
.action-btn:hover { background: rgba(255,255,255,0.25); }

/* ── Info below card ── */
.card-info { padding: 0.4rem 0.1rem 0; }

.card-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.2rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  color: #888;
  flex-wrap: wrap;
}
.meta-rating {
  background: #2a3040;
  color: #bbb;
  padding: 0.05rem 0.35rem;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: 700;
}
.meta-score { color: #f5c518; }

.card-genres {
  margin-top: 0.2rem;
  font-size: 0.68rem;
  color: #6a8faf;
}
.genre-tag { white-space: nowrap; }
</style>