<template>
  <div class="favorite-page-container">
    <div class="favorite-card-frame">
      <h1 class="favorite-title">
        <span class="title-text">My Watchlist</span>
      </h1>

      <div class="toolbar">
        <div class="filter-group">
          <div class="filter-select">Genres <ChevronDown size="14" /></div>
          <div class="filter-select">Status <ChevronDown size="14" /></div>
          <div class="filter-select">Rating <ChevronDown size="14" /></div>
        </div>

        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search Watchlist..." 
            v-model="searchQuery"
          />
          <Search size="18" class="search-icon" />
        </div>
      </div>

      <div class="status-bar">
        <div class="tags-list">
          <span class="active-tag">To Watch <X size="14" class="btn-close-tag" /></span>
        </div>
        
        <div class="sort-box">
          <span class="sort-label">Sort by:</span>
          <div class="filter-select">Recently Added <ChevronDown size="14" /></div>
        </div>
      </div>

      <div class="movie-display-section">
        <div v-if="isLoading" class="state-message">
          <div class="loader"></div>
          <p>Loading your watchlist...</p>
        </div>

        <div v-else-if="watchlistMovies.length === 0" class="state-message">
          <p>Your watchlist is empty. Add some movies to watch later!</p>
        </div>

        <MovieGrid 
          v-else 
          :movies="filteredMovies" 
          @remove="removeFromList"
        />
      </div>

      <div v-if="watchlistMovies.length > 0" class="pagination-wrapper">
        <button class="nav-btn"><ChevronLeft size="18" /></button>
        <button class="page-link active">1</button>
        <span class="page-spacer">...</span>
        <button class="nav-btn"><ChevronRight size="18" /></button>
      </div>
    </div>

    <div class="footer-hint">
      Planning a movie marathon? <router-link to="/" class="highlight-link">Discover more!</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ChevronDown, Search, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import MovieGrid from '@/components/MovieGrid.vue';
import { userService } from '@/services/userService';

const searchQuery = ref('');
const watchlistMovies = ref([]);
const isLoading = ref(false);

const loadWatchlist = async () => {
  isLoading.value = true;
  try {
    // Gọi hàm getWatchlist thay vì getFavorites
    const data = await userService.getWatchlist();
    
    watchlistMovies.value = data.movies.map((movie: any) => {
      // Logic mapping tương tự như Favorite
      const finalPoster = movie.poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '');

      return {
        id: movie.id || movie.tmdb_id,
        title: movie.title,
        poster: finalPoster || 'https://placehold.co/500x750?text=No+Poster',
        type: movie.type || movie.media_type,
        rating: movie.rating || 0,
        year: movie.year || (movie.added_at ? new Date(movie.added_at).getFullYear() : 2024)
      };
    });
    console.log("Watchlist loaded:", watchlistMovies.value);
  } catch (error) {
    console.error("Lỗi khi tải Watchlist:", error);
  } finally {
    isLoading.value = false;
  }
};

const filteredMovies = computed(() => {
  if (!searchQuery.value) return watchlistMovies.value;
  return watchlistMovies.value.filter((m: any) => 
    m.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const removeFromList = async (movieId: number) => {
  try {
    // Bạn có thể dùng chung hàm xóa hoặc tạo hàm riêng tùy Backend
    await userService.removeFavorite(movieId); // Hoặc userService.removeWatchlist nếu bạn đã tách
    watchlistMovies.value = watchlistMovies.value.filter(m => m.id !== movieId);
  } catch (error) {
    alert("Không thể xóa khỏi danh sách chờ!");
  }
};

onMounted(loadWatchlist);
</script>

<style scoped>
/* Reuse lại toàn bộ CSS của FavoriteView để đảm bảo tính đồng bộ (Consistency) */
.favorite-page-container {
  width: 90%;
  margin: 40px auto 0;
}

.favorite-card-frame {
  position: relative;
  border: 2px solid rgba(34, 211, 238, 0.5);
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.4);
  padding: 60px 40px 40px;
  backdrop-filter: blur(8px);
  min-height: 500px;
}

.favorite-title {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  white-space: nowrap;
  z-index: 10;
}

.title-text {
  color: #22d3ee;
  font-size: 26px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 4px;
  padding: 0 20px;
  background: radial-gradient(circle at top, rgba(245, 158, 11, 0.12), transparent 100%),
              linear-gradient(180deg, #08111f 0%, #0b1424 38%);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.filter-group { display: flex; gap: 30px; }
.filter-select {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 15px;
  cursor: pointer;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #334155;
  color: white;
  padding: 8px 30px 8px 5px;
  outline: none;
}

.search-icon { position: absolute; right: 5px; top: 50%; transform: translateY(-50%); color: #475569; }

.status-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.active-tag {
  border: 1px solid #22d3ee;
  color: #22d3ee;
  padding: 5px 15px;
  border-radius: 8px;
  margin-right: 12px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.movie-display-section {
  min-height: 300px;
}

.state-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #64748b;
  gap: 20px;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(34, 211, 238, 0.1);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
}

.page-link, .nav-btn {
  width: 42px; height: 42px;
  border-radius: 12px;
  border: 1px solid #1e293b;
  background: #0f172a;
  color: #94a3b8;
  cursor: pointer;
}

.page-link.active {
  border-color: #22d3ee;
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.1);
}

.footer-hint { text-align: center; margin-top: 35px; color: #475569; }
.highlight-link { color: #f59e0b; text-decoration: none; font-weight: bold; margin-left: 6px; }
</style>