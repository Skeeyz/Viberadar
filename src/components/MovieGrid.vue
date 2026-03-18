<template>
  <section class="movie-section">
  <div class="movie-grid">
    <MovieCard
      v-for="movie in movies"
      :key="movie.title"
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
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.movie-grid{
  display: grid;
 gap: 32px 24px;


  /* desktop */
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  justify-content: center;
}

/* Tablet & Mobile lớn */
@media (max-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
}

/* Mobile nhỏ (Dưới 480px) */
@media (max-width: 480px) {
  .movie-grid {
    /* Ở mobile cực nhỏ, đôi khi để 1 cột (1fr) lại sang trọng hơn 2 cột bị chật chội */
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  }
</style>
