<template>
    <div class="movie-card">
      <div class="poster-container">
        <img
          :src="movie.poster"
          :alt="movie.title"
          class="poster-image"
        />
        <div class="overlay">
          <button class="play-button" @click.stop="handleTrailerClick">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="content" @click.stop="handleCardClick">
        <h3 class="title">{{ movie.title }}</h3>

        <div class="meta">
          <span class="year">{{ movie.year }}</span>
          <div class="rating" :aria-label="`Rating: ${movie.rating} out of 10`">
            <span
              v-for="star in 5"
              :key="star"
              class="rating-star"
              :class="{ active: star <= getStarCount(movie.rating) }"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52 6.12 20.61l1.12-6.55L2.48 9.42l6.58-.96L12 2.5z"
                />
              </svg>
            </span>
          </div>
        </div>

        <p class="description">{{ movie.description }}</p>


        <div class="genres">
          <span
            v-for="genre in movie.genres"
            :key="genre"
            class="genre-tag"
          >
            {{ genre }}
          </span>
        </div>

        <div class="actions-buttons">
          <button 
          @click.stop="handleTrailerClick"
          class="btn-watch">Watch Trailer</button>
          <div class="reaction-group">
            <button 
              class="btn-reaction favorite" 
              @click.stop="handleFavoriteClick" 
              title="Favorite Action">
              <i v-if="viewType === 'favorites' && !isFavorite" class="fa-solid fa-heart-crack"></i>
              <i v-else :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
            </button>

            <button 
              class="btn-reaction watchlist" 
              @click.stop="handleWatchlistClick" 
              title="Watchlist Action">
              <i v-if="viewType === 'watchlist' && !isInWatchlist" class="fa-solid fa-bookmark-slash"></i>
              <i v-else :class="isInWatchlist ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import Swal from 'sweetalert2'
import { useFavoriteStore, useWatchlistStore } from '@/stores/userStore';
import { useMovieStore } from '../stores/movieStore'

interface Movie {
  id: number
  title: string
  poster: string
  year: number
  rating: number
  description: string
  genres: string[]
  addedAt: string
  type: 'movie' | 'tv'
}
defineOptions({
  name: "MovieCard"
})

const favoriteStore = useFavoriteStore();
const watchlistStore = useWatchlistStore();
const movieStore = useMovieStore();

const props = defineProps<{
  movie: Movie,
  viewType?: 'home' | 'favorites' | 'watchlist' 
}>()


const isFavorite = computed(() => favoriteStore.isFavorite(props.movie.id));
const isInWatchlist = computed(() => watchlistStore.isInWatchlist(props.movie.id));

const handleFavoriteClick = async () => {
  await favoriteStore.toggleFavorite(props.movie)
}

const handleWatchlistClick = async () => {
  await watchlistStore.toggleWatchlist(props.movie);
};

const getStarCount = (rating: number) => {
  return Math.max(0, Math.min(5, Math.round(rating / 2)))
}

const handleTrailerClick = async () =>{
  await movieStore.openTrailer(props.movie.id);
}

const handleCardClick = async() =>{
  await movieStore.openMovieDetail(props.movie.id);
}
</script>


  <style scoped>
  .movie-card {
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

  .movie-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  }

  .poster-container {
    position: relative;
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: #0f0f0f;


  }

  .poster-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .movie-card:hover .poster-image {
    transform: scale(1.05);
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .movie-card:hover .overlay {
    opacity: 1;
  }

  .play-button {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(255, 0, 68, 0.9);
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
  }

  .play-button:hover {
    background: rgba(255, 0, 68, 1);
    transform: scale(1.1);
  }

  .content {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    margin: 0;
    line-height: 1.3;
    text-overflow: ellipsis;
  }

  .meta {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: #b0b0b0;
  }

  .year {
    background: rgba(255, 0, 68, 0.2);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .rating {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #ffd700;
    font-weight: 600;
  }

  .rating-star {
    display: inline-flex;
    width: 16px;
    height: 16px;
    color: rgba(255, 215, 0, 0.28);
  }

  .rating-star svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  .rating-star.active {
    color: #ffd700;
  }

  .description {
    font-size: 13px;
    color: #a0a0a0;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .genres {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    max-height: 60px; 
    overflow: hidden;
  }

  .genre-tag {
    font-size: 11px;
    background: rgba(255, 0, 68, 0.2);
    color: #ff0044;
    padding: 4px 10px;
    border-radius: 16px;
    font-weight: 500;
  }
  .btn-reaction {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
}

.btn-reaction:hover {
  color: red;
}

  .btn-watch {
    width: 100%;
    padding: 12px 16px;
    background: linear-gradient(135deg, #ff0044 0%, #ff3366 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s ease, transform 0.2s ease;
    margin-top: 8px;
  }

  .btn-watch:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }

  .btn-watch:active {
    transform: scale(0.98);
  }
  .btn-favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  border: none;
  color: white;
  font-size: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-favorite:hover {
  color: red;
}

.actions-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 10px;
}

.btn-watch {
  flex: 1; /* Nút Watch Now sẽ chiếm phần lớn không gian */
  margin-top: 0 !important; /* Ghi đè margin-top cũ nếu có */
}

.reaction-group {
  display: flex;
  gap: 8px;
}

.btn-reaction {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  color: #b0b0b0;
  transition: all 0.3s ease;
}

.btn-reaction:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn-reaction.favorite i.fa-solid {
  color: #ff0044;
}

.btn-reaction.watchlist i.fa-solid {
  color: #ffbd39;
}

.btn-reaction:hover i.fa-heart {
  color: #ff0044;
}

.btn-reaction:hover i.fa-bookmark {
  color: #ffbd39;
}
</style>

<!-- <template>
  <div class="movie-card" @click="$emit('click', movie)">
    <div class="card-thumb">
      <img :src="movie.poster" :alt="movie.title" class="card-img" />

      <span v-if="showHd" class="badge hd">HD</span>

      <span v-if="movie.episode" class="badge ep-badge">EP {{ movie.episode }}</span>

      <span v-if="movie.season" class="badge season-badge">S{{ movie.season }}</span>

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
</style> -->
