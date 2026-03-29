<template>
  <MainLayout>
    <div class="viewall-page">
      <div class="page-header">
        <button class="back-btn" @click="$router.back()">← Back</button>
        <h1 class="page-title">{{ sectionTitle }}</h1>
      </div>

      <div v-if="loading" class="state-msg">Loading...</div>
      <div v-else-if="error" class="state-msg error">{{ error }}</div>

      <template v-else>
        <div class="movie-grid">
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            @click="goToDetail"
          />
        </div>

        <Pagination
          :current="currentPage"
          :total-pages="totalPages"
          @change="onPageChange"
        />
      </template>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import MovieCard  from '../components/MovieCard.vue'
import Pagination from '../components/Pagination.vue'
import { fetchMovieListPaged, fetchTVListPaged } from '../services/movieService'

const SECTION_CONFIG = {
  'new-release':    { label: 'New Release - Movies', type: 'movie', listType: 'now_playing' },
  'upcoming':       { label: 'Upcoming - Movies',    type: 'movie', listType: 'upcoming'    },
  'recommended':    { label: 'Recommended Movies',   type: 'movie', listType: 'popular'     },
  'recommended-tv': { label: 'Recommended TV Shows', type: 'tv',    listType: 'popular'     },
}

export default {
  name: 'ViewAllPage',
  components: { MainLayout, MovieCard, Pagination },

  data() {
    return {
      movies:      [],
      currentPage: 1,
      totalPages:  1,
      loading:     false,
      error:       null,
    }
  },

  computed: {
    section() {
      return this.$route.params.section   // e.g. 'new-release'
    },
    config() {
      return SECTION_CONFIG[this.section] ?? SECTION_CONFIG['new-release']
    },
    sectionTitle() {
      return this.config.label
    },
  },

  watch: {
    // Re-fetch nếu section thay đổi
    section() {
      this.currentPage = 1
      this.fetchPage(1)
    },
  },

  mounted() {
    // Đọc page từ query ?page=2 (optional)
    this.currentPage = Number(this.$route.query.page) || 1
    this.fetchPage(this.currentPage)
  },

  methods: {
    async fetchPage(page) {
      this.loading = true
      this.error   = null
      try {
        const fetcher = this.config.type === 'tv' ? fetchTVListPaged : fetchMovieListPaged
        const data    = await fetcher(this.config.listType, page)
        this.movies     = data.movies
        this.totalPages = data.totalPages
        this.currentPage = page
        // Sync URL query
        this.$router.replace({ query: { page } })
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    onPageChange(page) {
      this.fetchPage(page)
    },

    goToDetail(movie) {
      this.$router.push({ name: 'MovieDetail', params: { id: movie.id } })
    },
  },
}
</script>

<style scoped>
.viewall-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: #1a2030;
  border: 1px solid #2a3040;
  color: #aaa;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  white-space: nowrap;
}
.back-btn:hover { background: #e8b84b; color: #000; border-color: #e8b84b; }

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.state-msg { padding: 4rem; text-align: center; color: #888; font-size: 1rem; }
.state-msg.error { color: #e74c3c; }

@media (max-width: 1200px) { .movie-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 900px)  { .movie-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px)  { .movie-grid { grid-template-columns: repeat(2, 1fr); } }
</style>