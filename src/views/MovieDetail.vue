<template>
  <div class="movie-page">
    <AppNavbar :left-links="leftLinks" />

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
      leftLinks: [
        { label: 'HOME', dropdown: true },
        { label: 'MOVIES', dropdown: true },
        { label: 'NEWS', dropdown: true },
        { label: 'COMMUNITY', dropdown: true },
      ],
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
      fetch('https://api.themoviedb.org/3/movie/popular?api_key=45336b063987ba34f54222366bf8ee89')
        .then(response => response.json())
        .then(data => {
         // In toàn bộ dữ liệu ra console
        console.log('Dữ liệu từ TMDB:', data);
    
        // In chi tiết danh sách phim
        console.log('Danh sách phim:', data.results);
    
        // In từng phim một
        data.results.forEach((movie, index) => {
      console.log(`Phim ${index + 1}:`, movie.title, movie.release_date);
    });
    
    // Nếu muốn xem cấu trúc đối tượng rõ hơn, dùng console.dir
    console.dir(data, { depth: null, colors: true });
    
    // Dùng console.table để hiển thị mảng dưới dạng bảng (dễ đọc)
    console.table(data.results);
  })
  .catch(error => console.error('Lỗi:', error));
      console.log('route params:', this.$route.params)  // xem có id không
      console.log('full route:', this.$route)
      // Lấy movieId từ route: /movie/:id
      const movieId = this.$route.params.id
      this.movie = await fetchMovieDetail(movieId,true)
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