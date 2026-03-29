<template>
  <div class="movie-page">
    <AppNavbar  />

    <div v-if="loading" class="state-msg">Loading...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <template v-else>
      <MovieHero :movie="movie" @open-trailer="openTrailer" />
      <MovieTabs :movie="movie" />
      <MovieTrailer
          :show="showTrailer"
          :trailer-key="trailerKey"
          @close="showTrailer = false"/>
    </template>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'
import MovieHero from '@/components/MovieHero.vue'
import MovieTabs from '@/components/MovieTabs.vue'
import MovieTrailer from '@/components/MovieTrailer.vue'
import { fetchMovieDetail, fetchMovieVideos } from '@/services/movieService.js'

export default {
  name: 'MovieDetail',
  components: { AppNavbar, MovieHero, MovieTabs, MovieTrailer },

  data() {
    return {
      movie: null,
      loading: true,
      error: null,
      showTrailer: false,   
      trailerKey: null,
    }
  },

  methods: {
    async openTrailer() {
      if (!this.trailerKey) {
        const videos = await fetchMovieVideos(this.movie.id)
        const best = videos.find(v => v.type === 'Trailer' && v.official)
                  ?? videos.find(v => v.type === 'Trailer')
                  ?? videos[0]
        this.trailerKey = best?.key ?? null
      }
      this.showTrailer = true
    }
  },
  async created() {
    try {
      const id   = this.$route.params.id
      const type = this.$route.query.type || 'movie'  // ← đọc type từ URL

      if (type === 'tv') {
        this.movie = await fetchTVShowDetail(id)
      } else {
        this.movie = await fetchMovieDetail(id, true)
      }
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