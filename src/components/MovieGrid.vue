<template>
  <section class="movie-section">
  <div class="movie-grid">
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      :movie="movie"
    />
  </div>
</section>
</template>

<script setup lang="ts">
import MovieCard from "./MovieCard.vue"

interface Movie {
  id: number
  title: string
  poster: string
  year: number
  rating: number
  description: string
  genres: string[]
}

defineProps<{
  movies: Movie[]
}>()
</script>

<style scoped>
.movie-section{
  width: 100%;
}

.movie-grid{
  display: grid;
  gap: 28px 22px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

@media (max-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
