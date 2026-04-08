<template>
  <div class="hero" :style="{ backgroundImage: `url(${movie?.backdrop})` }">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-poster">
        <img :src="movie?.poster" :alt="movie?.title" />
      </div>
      <div class="hero-info">
        <h1 class="hero-title">{{ movie?.title }}</h1>
        
        <div class="hero-meta">
          <span class="badge">{{ movie?.rating_label || 'PG-13' }}</span>
          <span class="meta-item">{{ movie?.year }}</span>
          <span class="dot">•</span>
          <span class="meta-item">{{ movie?.duration }}</span>
          <span class="dot">•</span>
          <span class="star">★</span>
          <span class="score">{{ movie?.score }}</span>
          <span class="votes">({{ movie?.votes }})</span>
        </div>

        <div class="hero-genres">
          <span v-for="(genre, i) in movie?.genres" :key="genre" class="genre-item">
            <span v-if="i > 0" class="genre-dot">•</span>
            {{ genre }}
          </span>
        </div>

        <div class="hero-actions">
          <button class="btn-trailer" @click="$emit('open-trailer')">
            <span class="play-icon">▶</span> Watch Trailer
          </button>

          <div class="reaction-group">
            <button 
              class="btn-reaction favorite" 
              :class="{ 'is-active': isFavorite }"
              @click="handleFavoriteClick" 
              title="Add to Favorites"
            >
              <i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
            </button>

            <button 
              class="btn-reaction watchlist" 
              :class="{ 'is-active': isInWatchlist }"
              @click="handleWatchlistClick" 
              title="Add to Watchlist"
            >
              <i :class="isInWatchlist ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFavoriteStore, useWatchlistStore } from '@/stores/userStore';

// Định nghĩa Props và Emits
const props = defineProps<{
  movie: any
}>();

defineEmits(['open-trailer']);

// Khởi tạo Store
const favoriteStore = useFavoriteStore();
const watchlistStore = useWatchlistStore();

// Computed kiểm tra trạng thái (giống MovieCard)
const isFavorite = computed(() => favoriteStore.isFavorite(props.movie?.id));
const isInWatchlist = computed(() => watchlistStore.isInWatchlist(props.movie?.id));

// Methods xử lý click
const handleFavoriteClick = async () => {
  if (props.movie) await favoriteStore.toggleFavorite(props.movie);
};

const handleWatchlistClick = async () => {
  if (props.movie) await watchlistStore.toggleWatchlist(props.movie);
};
</script>

<style scoped>
/* --- Giữ lại các style cũ của bạn và bổ sung/sửa đổi bên dưới --- */

.hero {
  position: relative; 
  min-height: 450px; /* Tăng nhẹ chiều cao cho thoáng */
  background-size: cover; 
  background-position: center 20%;
  display: flex; 
  align-items: flex-end;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom,
    rgba(2, 6, 23, 0.2) 0%,
    rgba(2, 6, 23, 0.7) 50%,
    rgba(2, 6, 23, 1) 100%);
}

.hero-content {
  position: relative; 
  display: flex; 
  align-items: flex-end;
  gap: 32px; 
  padding: 40px 5%; 
  width: 100%;
}

.hero-poster {
  flex-shrink: 0; 
  width: 180px; /* To hơn một chút cho đẹp */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.8);
  border: 1px solid rgba(255,255,255,0.1);
}

.hero-poster img { width: 100%; display: block; object-fit: cover; }

.hero-info { flex: 1; padding-bottom: 10px; }

.hero-title {
  font-size: 3rem; 
  font-weight: 800; 
  color: #fff;
  margin-bottom: 12px;
  line-height: 1.1;
}

.hero-genres { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 24px; 
  color: #22d3ee; /* Màu cyan đồng bộ hệ thống */
  font-size: 0.9rem;
  font-weight: 500;
}

.genre-dot { margin-right: 8px; opacity: 0.5; color: #94a3b8; }

.hero-actions { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
}

.btn-trailer {
  background: #22d3ee; /* Đổi sang màu cyan cho hiện đại */
  color: #020617; 
  border: none;
  border-radius: 8px;
  font-size: 0.95rem; 
  font-weight: 700; 
  padding: 12px 28px; 
  cursor: pointer;
  display: inline-flex; 
  align-items: center; 
  gap: 10px;
  transition: all 0.3s ease;
}

.btn-trailer:hover { 
  background: #06b6d4; 
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
}

/* --- REACTION GROUP ĐỒNG BỘ MOVIECARD --- */
.reaction-group {
  display: flex;
  gap: 10px;
}

.btn-reaction {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-reaction:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateY(-3px);
}

.btn-reaction.favorite.is-active {
  color: #fb7185; /* Pink-rose cho tim */
  background: rgba(251, 113, 133, 0.1);
  border-color: rgba(251, 113, 133, 0.2);
}

.btn-reaction.watchlist.is-active {
  color: #fbbf24; /* Amber cho bookmark */
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.2);
}

@media (max-width: 768px) {
  .hero-content { flex-direction: column; align-items: center; text-align: center; }
  .hero-poster { width: 140px; }
  .hero-title { font-size: 2rem; }
  .hero-actions { justify-content: center; }
}
</style>