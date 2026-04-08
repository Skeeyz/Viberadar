<template>
  <div class="favorite-page-container">
    <header class="page-header">
      <div class="title-section">
        <h1 class="main-title">My Favorites</h1>
        <div class="count-badge" v-if="filteredMovies.length > 0">
          {{ filteredMovies.length }} items
        </div>
      </div>

      <div class="toolbar">
        <div class="filter-group">
          <div class="dropdown-wrapper">
            <div class="filter-trigger">
              Genres <ChevronDown size="14" class="icon-arrow" />
            </div>
            <div class="dropdown-content glass-ui">
              <div class="genre-grid">
                <button class="chip" @click="resetGenres" :class="{ active: selectedGenres.length === 0 }">
                  All Genres
                </button>
                <button 
                  v-for="genre in availableGenres" 
                  :key="genre" 
                  class="chip" 
                  @click="toggleGenre(genre)"
                >
                  + {{ genre }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="dropdown-wrapper">
            <div class="filter-trigger">
              Sort: <span class="current-val">{{ sortBy === 'desc' ? 'Newest' : 'Oldest' }}</span>
              <ChevronDown size="14" class="icon-arrow" />
            </div>
            <div class="dropdown-content glass-ui sort-mini">
              <div class="sort-opt" :class="{ active: sortBy === 'desc' }" @click="sortBy = 'desc'">
                <Clock size="14" /> Newest Added
              </div>
              <div class="sort-opt" :class="{ active: sortBy === 'asc' }" @click="sortBy = 'asc'">
                <History size="14" /> Oldest Added
              </div>
            </div>
          </div>
        </div>

        <div class="search-box">
          <Search size="18" class="search-icon" />
          <input type="text" placeholder="Search in favorites..." v-model="searchQuery" />
        </div>
      </div>
    </header>

    <div class="tags-row">
      <transition-group name="tag-list">
        <span v-for="genre in selectedGenres" :key="genre" class="active-tag-chip">
          {{ genre }} 
          <X size="14" class="close-tag-icon" @click="toggleGenre(genre)" />
        </span>
      </transition-group>
    </div>

    <main class="content-section">
      <div v-if="isLoading" class="state-ui skeleton-grid" aria-busy="true" aria-label="Loading movies">
        <MovieCardSkeleton v-for="i in 5" :key="i" />
      </div>
      <!-- <div v-if="isLoading" class="state-ui">
        <div class="loader"></div>
        <p>Updating your collection...</p>
      </div> -->

      <div v-else-if="paginatedMovies.length === 0" class="state-ui">
        <div class="empty-icon">📺</div>
        <p>No movies found. Try adjusting your filters.</p>
      </div>

      <MovieGrid 
        v-else 
        :movies="paginatedMovies"
        :viewType="viewType"
      />
    </main>

    <footer class="page-footer" v-if="totalPages > 1">
      <div class="pagination">
        <button class="p-btn" :disabled="currentPage === 1" @click="currentPage--">
          <ChevronLeft size="18" />
        </button>
        
        <button 
          v-for="page in totalPages" 
          :key="page" 
          class="p-num" 
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>

        <button class="p-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <ChevronRight size="18" />
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { ref, onMounted, computed, watch } from 'vue';
import { ChevronDown, Search, X, ChevronLeft, ChevronRight, Clock, History } from 'lucide-vue-next';
import MovieGrid from '@/components/MovieGrid.vue';
import MovieCardSkeleton from '@/components/MovieCardSkeleton.vue'
import { userService } from '@/services/userService';
import { useFavoriteStore } from '@/stores/userStore';

const favoriteStore = useFavoriteStore();
const viewType = "favorites";
const searchQuery = ref('');
const selectedGenres = ref<string[]>([]);
const favoriteMovies = computed(()=>favoriteStore.favorites)
const isLoading = computed(()=>favoriteStore.loading)
const sortBy = ref('desc');
const currentPage = ref(1);
const itemsPerPage = 10;

const allGenres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

const availableGenres = computed(() => allGenres.filter(g => !selectedGenres.value.includes(g)));

watch(currentPage, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const toggleGenre = (genre: string) => {
  const index = selectedGenres.value.indexOf(genre);
  if (index > -1) selectedGenres.value.splice(index, 1);
  else selectedGenres.value.push(genre);
};

const resetGenres = () => selectedGenres.value = [];

const filteredMovies = computed(() => {
  let results = favoriteMovies.value.filter((m: any) => {
    const matchSearch = m.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchGenres = selectedGenres.value.length === 0 
      ? true 
      : selectedGenres.value.every(g => (m.genres || []).includes(g));
    return matchSearch && matchGenres;
  });

  return results.sort((a, b) => {
    const dateA = new Date(a.addedAt).getTime();
    const dateB = new Date(b.addedAt).getTime();
    return sortBy.value === 'desc' ? dateB - dateA : dateA - dateB;
  });
});

const totalPages = computed(() => Math.ceil(filteredMovies.value.length / itemsPerPage));
const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMovies.value.slice(start, start + itemsPerPage);
});

watch([searchQuery, selectedGenres, sortBy], () => { currentPage.value = 1; });

const loadFavorites = async () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  // await sleep(5000);
  await favoriteStore.fetchFavorites();
};

onMounted(loadFavorites);
</script>

<style scoped>

.favorite-page-container {
  max-width: 95%; 
  margin: 0 auto;
  padding: 40px 10px; 
  color: #fff;
  min-height: 100vh;
  transition: max-width 0.3s ease;
}

/* --- Header & Typography --- */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
}

.title-section {
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.main-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #fff, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.count-badge {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* --- Toolbar --- */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 40px;
}

.dropdown-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.filter-trigger {
  color: #94a3b8;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.current-val { color: #22d3ee; }

/* Bridge for smooth hover */
.dropdown-wrapper::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 20px;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px) translateZ(0);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-wrapper:hover .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* --- Polished UI Elements --- */
.glass-ui {
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  padding: 24px;
  width: 480px;
}

.sort-mini { width: 220px; padding: 10px; right: 0; left: auto; }

/* --- Genre Grid & Chips --- */
.genre-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, box-shadow;
}

.chip:hover {
  background: rgba(34, 211, 238, 0.1);
  border-color: rgba(34, 211, 238, 0.4);
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.15);
}

.chip.active {
  background: #22d3ee;
  color: #0f172a;
  border-color: #22d3ee;
}

/* --- Sort Options --- */
.sort-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #94a3b8;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-opt:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  transform: translateX(6px);
}

.sort-opt.active {
  background: rgba(34, 211, 238, 0.1);
  color: #22d3ee;
  font-weight: 700;
}

/* --- Search Box --- */
.search-box {
  position: relative;
  width: 320px;
}

.search-box input {
  width: 100%;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 14px;
  padding: 14px 16px 14px 48px;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: #22d3ee;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.1);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
}

/* --- Active Tags --- */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;
  min-height: 40px;
}

.active-tag-chip {
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  color: #22d3ee;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(34, 211, 238, 0.1);
}

/* --- Content Section --- */
.content-section {
  min-height: 400px;
}

.state-ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #475569;
  gap: 20px;
}

.skeleton-grid {
  display: grid;
  gap: 28px 22px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

/* --- Pagination --- */
.page-footer {
  margin-top: 60px;
  padding-bottom: 40px;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 41, 59, 0.5);
  padding: 6px;
  border-radius: 14px;
}

.p-btn, .p-num {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.p-num.active {
  background: #22d3ee;
  color: #0f172a;
  font-weight: 700;
}

.p-btn:hover:not(:disabled), .p-num:hover:not(.active) {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.p-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* --- Animations --- */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.9); }

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(34, 211, 238, 0.1);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.icon-arrow { transition: transform 0.3s ease; }
.dropdown-wrapper:hover .icon-arrow { transform: rotate(180deg); color: #22d3ee; }
</style>