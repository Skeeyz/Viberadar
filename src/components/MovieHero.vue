<template>
  <div class="hero" :style="{ backgroundImage: `url(${movie.backdrop})` }">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-poster">
        <img :src="movie.poster" :alt="movie.title" />
      </div>
      <div class="hero-info">
        <h1 class="hero-title">{{ movie.title }}</h1>
        <div class="hero-meta">
          <span class="badge">{{ movie.rating_label }}</span>
          <span class="meta-item">{{ movie.year }}</span>
          <span class="dot">•</span>
          <span class="meta-item">{{ movie.duration }}</span>
          <span class="dot">•</span>
          <span class="star">★</span>
          <span class="score">{{ movie.score }}</span>
          <span class="votes">({{ movie.votes }})</span>
        </div>
        <div class="hero-genres">
          <a v-for="(genre, i) in movie.genres" :key="genre" href="#" class="genre-link">
            <span v-if="i > 0" class="genre-dot">•</span>{{ genre }}
          </a>
        </div>
        <div class="hero-actions">
          <a href="#" class="btn-trailer">
            <span class="play-icon">▶</span> Watch Trailer
          </a>
          <button class="btn-icon" title="Watchlist">♡</button>
          <button class="btn-icon" title="Bookmark">⊡</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieHero',
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.hero {
  position: relative; min-height: 340px;
  background-size: cover; background-position: center top;
  display: flex; align-items: flex-end;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom,
    rgba(13,23,32,0.35) 0%,
    rgba(13,23,32,0.65) 50%,
    rgba(13,23,32,0.97) 100%);
}
.hero-content {
  position: relative; display: flex; align-items: flex-end;
  gap: 28px; padding: 32px 32px 36px; width: 100%;
}
.hero-poster {
  flex-shrink: 0; width: 130px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.7);
  border: 2px solid rgba(255,255,255,0.08);
}
.hero-poster img { width: 100%; display: block; }
.hero-info { flex: 1; }
.hero-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 2.4rem; font-weight: 800; color: #fff;
  letter-spacing: 1.5px; text-transform: uppercase;
  margin-bottom: 10px; text-shadow: 0 2px 8px rgba(0,0,0,0.6);
}
.hero-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
.badge {
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
  color: #cdd6e0; font-size: 0.72rem; font-weight: 700; padding: 1px 6px; letter-spacing: 0.5px;
}
.meta-item { color: #b0c4d8; font-size: 0.85rem; }
.dot  { color: #5a7a9a; font-size: 0.7rem; }
.star { color: #f5a623; font-size: 0.9rem; }
.score { color: #fff; font-weight: 700; font-size: 0.9rem; }
.votes { color: #7a9ab8; font-size: 0.8rem; }

.hero-genres { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; align-items: center; }
.genre-link {
  color: #5b9bd5; font-size: 0.82rem; font-weight: 600;
  text-decoration: none; display: flex; align-items: center; gap: 8px;
  transition: color 0.15s;
}
.genre-link:hover { color: #7ab8f0; }
.genre-dot { color: #3a5a7a; }

.hero-actions { display: flex; align-items: center; gap: 12px; }
.btn-trailer {
  background: #e8193c; color: #fff; text-decoration: none;
  font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px;
  padding: 9px 20px; display: inline-flex; align-items: center; gap: 8px;
  transition: background 0.15s, transform 0.1s;
}
.btn-trailer:hover { background: #ff2248; transform: translateY(-1px); }
.play-icon { font-size: 0.75rem; }
.btn-icon {
  width: 36px; height: 36px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
  color: #cdd6e0; font-size: 1.1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.btn-icon:hover { background: rgba(255,255,255,0.16); color: #fff; }
</style>