<template>
  <div class="movie-card">
    <div class="poster-container">
      <img
        :src="posterSrc"
        :alt="movieTitle"
        class="poster-image"
      />

      <button
        class="btn-favorite"
        type="button"
        :aria-pressed="props.isFavorite"
        :aria-label="favoriteLabel"
        @click="emit('favorite', props.movie.id)"
      >
        <i :class="props.isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
      </button>

      <div class="overlay">
        <button
          class="play-button"
          type="button"
          :aria-label="`Watch ${movieTitle}`"
          @click="emit('watch', props.movie.id)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="content">
      <h3 class="title">{{ movieTitle }}</h3>

      <div class="meta">
        <span class="year">{{ movieYear }}</span>
        <div class="rating" :aria-label="`Rating: ${movieRating} out of 10`">
          <span
            v-for="star in 5"
            :key="star"
            class="rating-star"
            :class="{ active: star <= getStarCount(movieRating) }"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52 6.12 20.61l1.12-6.55L2.48 9.42l6.58-.96L12 2.5z"
              />
            </svg>
          </span>
        </div>
      </div>

      <p class="description">{{ movieDescription }}</p>

      <div v-if="movieGenres.length" class="genres">
        <span
          v-for="(genre, index) in movieGenres"
          :key="`${props.movie.id}-${genre}-${index}`"
          class="genre-tag"
        >
          {{ genre }}
        </span>
      </div>

      <button class="btn-watch" type="button" @click="emit('watch', props.movie.id)">Watch Now</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface Movie {
  id: number
  title: string
  poster?: string
  year?: number | string | null
  rating?: number | null
  description?: string | null
  genres?: string[]
}

defineOptions({
  name: "MovieCard"
})

const props = withDefaults(defineProps<{
  movie: Movie
  isFavorite?: boolean
}>(), {
  isFavorite: false
})

const emit = defineEmits<{
  (e: "watch", movieId: number): void
  (e: "favorite", movieId: number): void
}>()

const posterSrc = computed(() => props.movie.poster || "https://via.placeholder.com/500x750?text=No+Image")
const movieTitle = computed(() => props.movie.title || "Untitled movie")
const movieYear = computed(() => props.movie.year || "N/A")
const movieRating = computed(() => props.movie.rating ?? 0)
const movieDescription = computed(() => props.movie.description || "No description available.")
const movieGenres = computed(() => props.movie.genres || [])
const favoriteLabel = computed(() =>
  props.isFavorite
    ? `Remove ${movieTitle.value} from favorites`
    : `Add ${movieTitle.value} to favorites`
)

const getStarCount = (rating: number) => {
  return Math.max(0, Math.min(5, Math.round(rating / 2)))
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
  inset: 0;
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
}

.genres {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.genre-tag {
  font-size: 11px;
  background: rgba(255, 0, 68, 0.2);
  color: #ff0044;
  padding: 4px 10px;
  border-radius: 16px;
  font-weight: 500;
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
  background: rgba(0, 0, 0, 0.6);
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
  z-index: 1;
}

.btn-favorite:hover {
  color: red;
}
</style>
