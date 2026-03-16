<template>
  <MovieCard :movie="movieData" />
</template>

<script setup>
import MovieCard from '@/components/MovieCard.vue'

const movieData = {
  title: 'The Shawshank Redemption',
  poster: 'https://image.tmdb.org/t/p/w500/...',
  year: 1994,
  rating: 9.3,
  description: 'Two imprisoned men bond over a number of years...',
  genres: ['Drama', 'Crime']
}
</script>