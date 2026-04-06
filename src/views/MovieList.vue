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

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import Header from '../components/Header.vue';
import Pagination from '@/components/Pagination.vue';
import { useMovieStore } from '../stores/movieStore';
import { searchMovies, fetchAllMovies } from '../services/movieService';

// Giải pháp cho lỗi ReferenceError: Load MovieCard không đồng bộ
const MovieCard = defineAsyncComponent(() => import('../components/MovieCard.vue'));

// Định nghĩa kiểu dữ liệu cho Movie (Bạn có thể đưa vào file types.ts)
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  [key: string]: any; // Cho các trường còn lại
}

// Khởi tạo các công cụ
const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();

// State (Reactive Data)
const searchInput = ref('');
const query = ref('');
const movies = ref<Movie[]>([]); // Kết quả search
const allMovies = ref<Movie[]>([]); // Toàn bộ phim
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);

// Computed (Logic thay cho computed cũ)
const isSearching = computed(() => query.value.trim().length > 0);

const pageTitle = computed(() => 
  isSearching.value ? `Results for "${query.value}"` : 'All Movies'
);

const displayMovies = computed(() => 
  isSearching.value ? movies.value : allMovies.value
);

// Methods (Functions)
const fetchSearch = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await searchMovies(query.value, currentPage.value);
    movies.value = data.results;
    totalPages.value = data.total_pages;
  } catch (err) {
    error.value = 'Search failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

const fetchAll = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    const data = await fetchAllMovies(page);
    allMovies.value = data.movies;
    totalPages.value = data.totalPages;
    currentPage.value = page;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch movies.';
  } finally {
    loading.value = false;
  }
};

const doSearch = () => {
  const q = searchInput.value.trim();
  if (!q) return clearSearch();
  query.value = q;
  currentPage.value = 1;
  fetchSearch();
};

const clearSearch = () => {
  searchInput.value = '';
  query.value = '';
  movies.value = [];
  currentPage.value = 1;
  error.value = null;
  fetchAll(1); // Load lại danh sách gốc khi xóa search
};

const changePage = (page: number) => {
  currentPage.value = page;
  if (isSearching.value) {
    fetchSearch();
  } else {
    fetchAll(page);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const goToDetail = (movieId: number) => {
  router.push({ name: 'MovieDetail', params: { id: movieId } });
};

// Lifecycle Hooks
onMounted(() => {
  const q = route.query.q as string;
  if (q) {
    searchInput.value = q;
    query.value = q;
    fetchSearch();
  } else {
    fetchAll();
  }
});
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