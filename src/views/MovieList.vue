<template>
  <MainLayout>
    <div class="movie-list-page">
      <Header title="All Movies" />

      <div v-if="store.loading" class="state-msg">Loading...</div>
      <div v-else-if="store.error" class="state-msg error">{{ store.error }}</div>

      <div v-else class="movie-grid">
        <MovieCard
          v-for="movie in store.newMovies"
          :key="movie.id"
          :movie="movie"
          @click="goToDetail"
        />
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import MovieCard  from '../components/MovieCard.vue'
import Header     from '../components/Header.vue'
import { useMovieStore } from '../stores/movieStore'

export default {
  name: 'MovieList',
  components: { MainLayout, MovieCard, Header },
  setup() {
    const store = useMovieStore()
    return { store }
  },
  mounted() {
    if (!this.store.newMovies.length) this.store.fetchHome()
  },
  methods: {
    goToDetail(movie) {
      this.$router.push({ name: 'MovieDetail', params: { id: movie.id } })
    },
  },
}
</script>

<style scoped>
.movie-list-page { padding: 1.5rem 2rem; }
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.state-msg { padding: 2rem 0; text-align: center; color: #888; }
.state-msg.error { color: #e74c3c; }
</style>

