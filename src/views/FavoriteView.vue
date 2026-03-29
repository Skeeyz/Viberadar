<template>
  <div class="favorite-page-container">
    <div class="favorite-card-frame">
      <h1 class="favorite-title">
        <span class="title-text">Your Favorite Movies</span>
      </h1>

      <div class="toolbar">
        <div class="filter-group">
          <div class="genre-filter-wrapper">
            <div class="filter-trigger">Genres <ChevronDown size="14" /></div>
            <div class="genre-dropdown-content">
              <div class="genre-selection-grid">
                <button class="genre-chip-item" @click="resetGenres">All</button>
                <button v-for="genre in availableGenres" :key="genre" class="genre-chip-item" @click="toggleGenre(genre)">
                  + {{ genre }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="sort-dropdown-wrapper">
            <div class="filter-trigger">
              Sort: <span class="current-sort">{{ sortBy === 'desc' ? 'Newest' : 'Oldest' }}</span>
              <ChevronDown size="14" class="icon-arrow" />
            </div>
            <div class="sort-dropdown-content">
              <div class="sort-option" :class="{ active: sortBy === 'desc' }" @click="sortBy = 'desc'">
                <Clock size="14" /> Newest Added
              </div>
              <div class="sort-option" :class="{ active: sortBy === 'asc' }" @click="sortBy = 'asc'">
                <History size="14" /> Oldest Added
              </div>
            </div>
          </div>
        </div>

        <div class="search-box">
          <input type="text" placeholder="Search Favorites..." v-model="searchQuery" />
          <Search size="18" class="search-icon" />
        </div>
      </div>

      <div class="status-bar">
        <div class="tags-list">
          <transition-group name="list">
            <span v-for="genre in selectedGenres" :key="genre" class="active-tag">
              {{ genre }} <X size="14" class="btn-close-tag" @click="toggleGenre(genre)" />
            </span>
          </transition-group>
        </div>
      </div>

      <div class="movie-display-section">
        <div v-if="isLoading" class="state-message">
          <div class="loader"></div>
          <p>Loading your favorite vibes...</p>
        </div>

        <div v-else-if="paginatedMovies.length === 0" class="state-message">
          <p>No movies found. Start exploring!</p>
        </div>

        <MovieGrid 
          v-else 
          :movies="paginatedMovies" 
          @remove="removeFromList"
        />
      </div>

      <div v-if="totalPages > 1" class="pagination-wrapper">
        <button class="nav-btn" :disabled="currentPage === 1" @click="currentPage--">
          <ChevronLeft size="18" />
        </button>
        
        <button 
          v-for="page in totalPages" 
          :key="page" 
          class="page-link" 
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>

        <button class="nav-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <ChevronRight size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { ChevronDown, Search, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import MovieGrid from '@/components/MovieGrid.vue';
import { userService } from '@/services/userService';

const searchQuery = ref('');
const selectedGenres = ref<string[]>([]);
const favoriteMovies = ref([]);
const isLoading = ref(false);
const sortBy = ref('desc');

const currentPage = ref(1);
const itemsPerPage = 8;

const allGenres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family',
 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

const availableGenres = computed(() => {
  return allGenres.filter(g => !selectedGenres.value.includes(g));
});

const toggleGenre = (genre: string) => {
  const index = selectedGenres.value.indexOf(genre);
  if (index > -1) selectedGenres.value.splice(index, 1);
  else selectedGenres.value.push(genre);
};

const resetGenres = () => selectedGenres.value = [];

// Logic lọc kết hợp: Search + Genres + Sort theo addedAt
const filteredMovies = computed(() => {
  let results = favoriteMovies.value.filter((m: any) => {
    const matchSearch = m.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchGenres = selectedGenres.value.length === 0 
      ? true 
      : selectedGenres.value.every(g => (m.genres || []).includes(g));
    return matchSearch && matchGenres;
  });

  // Sắp xếp theo thuộc tính ẩn addedAt
  return results.sort((a, b) => {
    const dateA = new Date(a.addedAt).getTime();
    const dateB = new Date(b.addedAt).getTime();
    return sortBy.value === 'desc' ? dateB - dateA : dateA - dateB;
  });
});

const totalPages = computed(() => Math.ceil(filteredMovies.value.length / itemsPerPage));
const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredMovies.value.slice(start, end);
});

// Reset về trang 1 khi người dùng thay đổi bộ lọc hoặc tìm kiếm
watch([searchQuery, selectedGenres, sortBy], () => {
  currentPage.value = 1;
});

const loadFavorites = async () => {
  isLoading.value = true;
  try {
    const data = await userService.getFavorites();
    favoriteMovies.value = data.movies; 
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    isLoading.value = false;
  }
};

const removeFromList = async (movieId: number) => {
  try {
    await userService.removeFavorite(movieId);
    favoriteMovies.value = favoriteMovies.value.filter(m => m.id !== movieId);
  } catch (error) {
    alert("Delete failed!");
  }
};

onMounted(loadFavorites);
</script>

<style scoped>
/* CSS Reset & Layout */
.favorite-page-container { width: 90%; margin: 60px auto; color: #fff; }
.favorite-card-frame {
  position: relative; border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 24px; background: rgba(15, 23, 42, 0.6);
  padding: 60px 40px 40px; backdrop-filter: blur(12px);
}

/* Title Styling */
.favorite-title {
  position: absolute; top: 0; left: 50%; transform: translate(-50%, -50%);
  z-index: 10;
}
.title-text {
  color: #22d3ee; font-size: 28px; font-weight: 900; text-transform: uppercase;
  letter-spacing: 6px; padding: 10px 30px; border-radius: 12px;
  background: #0f172a; border: 1px solid rgba(34, 211, 238, 0.3);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.2);
}

/* Toolbar & Filters */
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.filter-group {
  display: flex;
  align-items: center; /* Quan trọng: Căn giữa tất cả các item theo chiều dọc */
  gap: 30px;
  height: 40px; /* Cố định chiều cao để các item không nhảy */
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.page-link, .nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  background: rgba(30, 41, 59, 0.5);
  color: #94a3b8;
  cursor: pointer;
  transition: 0.3s;
}

.page-link:hover:not(.active), .nav-btn:hover:not(:disabled) {
  border-color: #22d3ee;
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.1);
}

.page-link.active {
  background: #22d3ee;
  color: #0f172a;
  border-color: #22d3ee;
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
  font-weight: bold;
}

.nav-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

/* Genre Dropdown Logic */
.genre-filter-wrapper { position: relative; }
.filter-trigger, .filter-select-ui { 
  color: #94a3b8; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 15px; 
}
.genre-filter-wrapper:hover .genre-dropdown-content { opacity: 1; visibility: visible; transform: translateY(0); }
.genre-dropdown-content {
  position: absolute; top: 120%; left: 0; width: 400px;
  background: #1e293b; border: 1px solid #334155; border-radius: 12px;
  padding: 20px; z-index: 100; opacity: 0; visibility: hidden;
  transform: translateY(10px); transition: all 0.3s ease;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}
.genre-selection-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.genre-chip-item {
  background: #0f172a; border: 1px solid #334155; color: #94a3b8;
  padding: 5px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;
}
.genre-chip-item:hover { border-color: #22d3ee; color: #22d3ee; }

/* Sort Styling */
/* Container chính cho Sort */
.sort-dropdown-wrapper {
  position: relative;
}

/* Chữ hiển thị mặc định */
.current-sort {
  color: #22d3ee;
  font-weight: 600;
  margin-left: 4px;
}

/* Hiệu ứng mũi tên xoay khi hover */
.sort-dropdown-wrapper:hover .icon-arrow {
  transform: rotate(180deg);
  color: #22d3ee;
}

/* Nội dung Dropdown ẩn */
.sort-dropdown-content {
  position: absolute;
  top: 100%;
  right: 0; /* Căn lề phải cho đẹp */
  width: 180px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(12px);
  z-index: 100;
  
  /* Hiệu ứng ẩn hiện */
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

/* Hiện lên khi Hover */
.sort-dropdown-wrapper:hover .sort-dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Các lựa chọn bên trong */
.sort-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  color: #94a3b8;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.sort-option:hover {
  background: rgba(34, 211, 238, 0.1);
  color: #fff;
}

/* Trạng thái đang được chọn */
.sort-option.active {
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.15);
  font-weight: 600;
}
.filter-select-native {
  position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; z-index: 2;
}

/* Status Bar & Tags */
.status-bar { display: flex; margin-bottom: 40px; min-height: 40px; }
.active-tag {
  background: rgba(34, 211, 238, 0.1); border: 1px solid #22d3ee; color: #22d3ee;
  padding: 6px 14px; border-radius: 10px; margin-right: 12px;
  font-size: 13px; display: inline-flex; align-items: center; gap: 8px;
}
.btn-close-tag { cursor: pointer; opacity: 0.7; }
.btn-close-tag:hover { opacity: 1; }

/* Search Box */
.search-box { position: relative; width: 320px; }
.search-box input {
  width: 100%; background: rgba(30, 41, 59, 0.5); border: 1px solid #334155;
  border-radius: 12px; color: #fff; padding: 12px 40px 12px 15px; outline: none;
}
.search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #475569; }

/* States */
.loader { 
  width: 40px; height: 40px; border: 3px solid rgba(34, 211, 238, 0.1);
  border-top-color: #22d3ee; border-radius: 50%; animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-message { display: flex; flex-direction: column; align-items: center; padding: 100px 0; color: #64748b; }

/* List Animations */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-20px); }

/* Footer */
.footer-hint { text-align: center; margin-top: 40px; color: #475569; }
.highlight-link { color: #22d3ee; font-weight: bold; margin-left: 8px; text-decoration: none; }
</style>