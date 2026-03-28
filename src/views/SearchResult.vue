<template>
  <MainLayout>
    <div class="search-result-page">

      <!-- Header -->
      <div class="page-top">
        <div class="title-block">
          <h2 class="page-title">
            <span v-if="query">Results for <em>"{{ query }}"</em></span>
            <span v-else>Search</span>
          </h2>
          <p v-if="!loading && movies.length > 0" class="result-count">
            {{ movies.length }} movies found
          </p>
        </div>

        <!-- Search bar inline -->
        <div class="search-bar">
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search again..."
            @keyup.enter="doSearch"
          />
          <button @click="doSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-msg">
        <div class="spinner"></div>
        Searching...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-msg error">{{ error }}</div>

      <!-- No query -->
      <div v-else-if="!query" class="state-msg">
        Enter a keyword to search.
      </div>

      <!-- No results -->
      <div v-else-if="movies.length === 0" class="state-msg">
        No results found for <strong>"{{ query }}"</strong>
      </div>

      <!-- Results grid -->
      <template v-else>
        <div class="movie-grid">
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            @click="goToDetail(movie)"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >← Prev</button>

          <div class="page-numbers">
            <button
              v-for="p in visiblePages"
              :key="p"
              class="page-num"
              :class="{ active: p === currentPage, dots: p === '...' }"
              :disabled="p === '...'"
              @click="p !== '...' && changePage(p)"
            >{{ p }}</button>
          </div>

          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >Next →</button>
        </div>
      </template>

    </div>
  </MainLayout>
</template>

<script>
import MainLayout       from '../layouts/MainLayout.vue'
import MovieCard        from '../components/MovieCard.vue'
import { searchMovies, searchTVShows } from '../services/movieService'

export default {
  name: 'SearchResult',
  components: { MainLayout, MovieCard },

  data() {
    return {
      searchInput: '',
      query:       '',
      movies:      [],
      loading:     false,
      error:       null,
      currentPage: 1,
      totalPages:  1,
      searchType: 'movie',
    }
  },

  computed: {
    // Hiển thị tối đa 5 số trang, có dấu "..."
    visiblePages() {
      const pages = []
      const total = this.totalPages
      const cur   = this.currentPage

      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)
        if (cur > 3)          pages.push('...')
        for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) {
          pages.push(i)
        }
        if (cur < total - 2)  pages.push('...')
        pages.push(total)
      }
      return pages
    },
  },

  watch: {
    // Re-fetch khi URL thay đổi (navigate từ MovieSearch)
    '$route.query': {
      immediate: true,
      handler(q) {
        const query = q?.q?.trim()
        if (query) {
          this.searchInput = query
          this.query       = query
          this.searchType  = q.type || 'movie'
          this.currentPage = parseInt(q.page) || 1
          this.fetchResults()
        }
      },
    },
  },

  methods: {
    async fetchResults() {
      this.loading = true
      this.error   = null
      try {
        const fetcher = (this.searchType === 'tv' || this.searchType === 'series')
            ? searchTVShows
            : searchMovies
        const data = await fetcher(this.query, this.currentPage)
        this.movies     = Array.isArray(data) ? data : (data.results ?? [])
        this.totalPages = data.total_pages ?? 1
      } catch (err) {
        this.error = 'Search failed. Please try again.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    doSearch() {
      const q = this.searchInput.trim()
      if (!q) return
      this.$router.push({ name: 'SearchResult', query: { q }, type: this.searchType })
    },

    changePage(page) {
      this.$router.push({
        name:  'SearchResult',
        query: { q: this.query, page, type: this.searchType },

      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    goToDetail(movie) {
      this.$router.push({ name: 'MovieDetail', params: { id: movie.id }, query:  { type: this.searchType }  })
    },
  },
}
</script>

<style scoped>
.search-result-page { padding: 1.5rem 2rem; min-height: 60vh; }

/* Top */
.page-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e0e0e0;
  margin-bottom: 4px;
}

.page-title em {
  color: #e8b84b;
  font-style: normal;
}

.result-count {
  color: #555;
  font-size: 0.82rem;
}

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

/* States */
.state-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 4rem 0;
  text-align: center;
  color: #666;
  font-size: 0.95rem;
}

.state-msg.error  { color: #e74c3c; }
.state-msg strong { color: #e0e0e0; }

/* Spinner */
.spinner {
  width: 28px; height: 28px;
  border: 3px solid #2e3a4a;
  border-top-color: #e8b84b;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Grid */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
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

.page-numbers { display: flex; gap: 0.4rem; }

.page-num {
  width: 34px; height: 34px;
  background: #1e2530;
  border: 1px solid #2e3a4a;
  color: #ccc;
  border-radius: 6px;
  font-size: 0.83rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.page-num:hover:not(.dots):not(.active) { background: #2a3348; color: #fff; }
.page-num.active { background: #e8b84b; color: #000; border-color: #e8b84b; font-weight: 700; }
.page-num.dots { cursor: default; border-color: transparent; background: transparent; }

@media (max-width: 768px) {
  .search-result-page { padding: 1rem; }
  .page-top { flex-direction: column; }
  .search-bar input { width: 160px; }
  .movie-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>