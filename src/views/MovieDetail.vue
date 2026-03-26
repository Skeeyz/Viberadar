<template>
  <div class="movie-page">
    <AppNavbar :left-links="leftLinks" />

    <div v-if="loading" class="state-msg">Loading...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <template v-else>
      <MovieHero :movie="movie" />
      <MovieTabs :movie="movie" />
    </template>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'
import MovieHero from '@/components/MovieHero.vue'
import MovieTabs from '@/components/MovieTabs.vue'
import { fetchMovieDetail } from '@/services/movieService.js'

export default {
  name: 'MovieDetail',
  components: { AppNavbar, MovieHero, MovieTabs },

  data() {
    return {
      movie: null,
      loading: true,
      error: null,
      leftLinks: [
        { label: 'HOME', dropdown: true },
        { label: 'MOVIES', dropdown: true },
        { label: 'NEWS', dropdown: true },
        { label: 'COMMUNITY', dropdown: true },
      ],
    }
  },

  async created() {
    try {
      console.log('route params:', this.$route.params)  // xem có id không
      console.log('full route:', this.$route)
      // Lấy movieId từ route: /movie/:id
      const movieId = this.$route.params.id
      this.movie = await fetchMovieDetail(movieId)
    } catch (err) {
      this.error = 'Không thể tải dữ liệu phim. Vui lòng thử lại.'
      console.error(err)
    } finally {
      this.loading = false
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.movie-page {
  background-color: #0d1720;
  min-height: 100vh;
  color: #e0eaf3;
  font-family: 'Barlow', sans-serif;
}
.state-msg { color: #8899aa; padding: 60px 32px; font-size: 1rem; }
.state-msg.error { color: #e8193c; }
</style>