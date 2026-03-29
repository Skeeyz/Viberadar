<template>
  <MainLayout>
    <div class="movie-list-page">

      <!-- Header + Search bar -->
      <div class="page-top">
        <Header :title="pageTitle" />
        <div class="search-bar">
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search movies..."
            @keyup.enter="doSearch"
          />
          <button @click="doSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <button v-if="isSearching" class="clear-btn" @click="clearSearch">✕</button>
        </div>
      </div>

      <!-- States -->
      <div v-if="loading" class="state-msg">Searching...</div>
      <div v-else-if="error" class="state-msg error">{{ error }}</div>
      <div v-else-if="isSearching && movies.length === 0" class="state-msg">
        No results for <strong>"{{ query }}"</strong>
      </div>

      <!-- Grid -->
      <div v-else class="movie-grid">
        <MovieCard
          v-for="movie in displayMovies"
          :key="movie.id"
          :movie="movie"
          @click="goToDetail"
        />
      </div>

      <!-- Pagination: hiện cả khi browse lẫn khi search -->
      <Pagination
        v-if="isSearching ? totalPages > 1 : allTotalPages > 1"
        :current="isSearching ? currentPage : allPage"
        :total-pages="isSearching ? totalPages : allTotalPages"
        @change="isSearching ? changePage($event) : fetchAll($event)"
      />

    </div>
  </MainLayout>
</template>

<script>
import MainLayout        from '../layouts/MainLayout.vue'
import MovieCard         from '../components/MovieCard.vue'
import Header            from '../components/Header.vue'
import Pagination         from '@/components/Pagination.vue' 
import { useMovieStore } from '../stores/movieStore'
import { searchMovies, fetchAllMovies }  from '../services/movieService'

export default {
  name: 'MovieList',
  components: { MainLayout, MovieCard, Header, Pagination },

  setup() {
    const store = useMovieStore()
    return { store }
  },

  data() {
    return {
      searchInput: '',
      query:       '',
      movies:      [],       // kết quả search
      allMovies:    [], 
      loading:     false,
      error:       null,
      currentPage: 1,
      totalPages:  1,
    }
  },

  computed: {
    pageTitle() {
    return this.isSearching
      ? `Results for "${this.query}"`
      : 'All Movies'
  },
    isSearching() {
      return this.query.trim().length > 0
    },
    displayMovies() {
      // Nếu đang search → dùng kết quả search, ngược lại dùng store
      return this.isSearching ? this.movies : this.allMovies
    },
  },

  mounted() {
    // Nếu có query trên URL (?q=...) thì search luôn
    const q = this.$route?.query?.q
    if (q) {
      this.searchInput = q
      this.query = q
      this.fetchSearch()
    } else  {
      this.fetchAll()
    }
  },

  methods: {
    doSearch() {
      const q = this.searchInput.trim()
      if (!q) return this.clearSearch()
      this.query = q
      this.currentPage = 1
      this.fetchSearch()
    },

    async fetchSearch() {
      this.loading = true
      this.error   = null
      try {
        const data      = await searchMovies(this.query, this.currentPage)
        this.movies     = data.results       // ✅ luôn là array
        this.totalPages = data.total_pages   // ✅ luôn có giá trị
      } catch (err) {
        this.error = 'Search failed. Please try again.'
      } finally {
        this.loading = false
      }
},

    changePage(page) {
      this.currentPage = page
      this.fetchSearch()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    clearSearch() {
      this.searchInput = ''
      this.query       = ''
      this.movies      = []
      this.currentPage = 1
      this.totalPages  = 1
      this.error       = null
    },

    goToDetail(movie) {
      this.$router.push({ name: 'MovieDetail', params: { id: movie.id } })
    },

    async fetchAll(page = 1) {
      this.loading = true
      try {
        const data        = await fetchAllMovies(page)
        this.allMovies    = data.movies
        this.allPage      = page
        this.allTotalPages = data.totalPages
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.movie-list-page { padding: 1.5rem 2rem; }

.page-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}
.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);  /* ← cố định 5 cột */
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 1200px) { .movie-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 900px)  { .movie-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px)  { .movie-grid { grid-template-columns: repeat(2, 1fr); } }

/* Search bar */
.search-bar {
  display: flex;
  align-items: center;
  background: #1e2530;
  border: 1px solid #2e3a4a;
  border-radius: 8px;
  overflow: hidden;
  height: 38px;
}

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.88rem;
  padding: 0 12px;
  width: 220px;
}

.search-bar input::placeholder { color: #555; }

.search-bar button {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.search-bar button:hover { color: #e8b84b; }

.clear-btn {
  border-left: 1px solid #2e3a4a !important;
  font-size: 0.78rem !important;
  color: #666 !important;
}

/* Grid */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

/* States */
.state-msg { padding: 3rem 0; text-align: center; color: #666; }
.state-msg.error  { color: #e74c3c; }
.state-msg strong { color: #e0e0e0; }

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  background: #1e2530;
  border: 1px solid #2e3a4a;
  color: #ccc;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.83rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) { background: #e8b84b; color: #000; border-color: #e8b84b; }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.page-info { color: #666; font-size: 0.83rem; min-width: 55px; text-align: center; }

@media (max-width: 768px) {
  .movie-list-page { padding: 1rem; }
  .page-top { flex-direction: column; align-items: flex-start; }
  .search-bar input { width: 160px; }
}
</style>