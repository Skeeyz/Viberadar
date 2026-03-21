<template>
  <div class="search-component">
    <div class="search-input-group">

      <div class="search-input-box" :class="{ 'is-focused': showDropdown }">
        <!-- icon -->
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <!-- input -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm phim..."
          class="search-input"
          @focus="showDropdown = true"
        />

        <!-- clear -->
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
          ✕
        </button>

        <!-- dropdown -->
        <div v-if="showDropdown && searchQuery" class="search-dropdown">
          <div
            v-for="movie in searchResults.slice(0, 5)"
            :key="movie.id"
            class="dropdown-item"
            @click="selectMovie(movie)"
          >
            {{ movie.title }}
          </div>

          <p v-if="searchResults.length === 0" class="no-result">
            Không có kết quả
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// Giữ nguyên logic Script của bạn, chỉ thêm handle close dropdown khi click ngoài nếu cần
import { computed, ref } from 'vue'

const searchQuery = ref('')
const showDropdown = ref(false)
const hasSearched = ref(false)

const recentSearches = ref<string[]>([])

const movies = ref([
  { id: 1, title: "Avengers: Endgame", genre: "Hành động" },
  { id: 2, title: "Your Name", genre: "Hoạt hình" },
  { id: 3, title: "Interstellar", genre: "Viễn tưởng" },
  { id: 4, title: "Joker", genre: "Tình cảm" },
  { id: 5, title: "Inception", genre: "Viễn tưởng" }
])

const searchResults = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase()
  return movies.value.filter(m =>
    m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q)
  )
})

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  hasSearched.value = true
  showDropdown.value = false

  if (!recentSearches.value.includes(searchQuery.value)) {
    recentSearches.value.unshift(searchQuery.value)
    if (recentSearches.value.length > 5) recentSearches.value.pop()
  }
}

const selectMovie = (movie: any) => {
  searchQuery.value = movie.title
  handleSearch()
}


const clearSearch = () => {
  searchQuery.value = ''
  hasSearched.value = false
  showDropdown.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.search-component {
  width: 100%;
}

/* group */
.search-input-group {
  display: flex;
}

/* box */
.search-input-box {
  position: relative;
  flex: 1;
  height: 40px;
  background: rgba(255,255,255,0.08);
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

/* input */
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  outline: none;
  font-size: 14px;
}

/* icon */
.search-icon {
  color: #aaa;
  margin-right: 8px;
}

/* clear */
.clear-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
}

/* dropdown */
.search-dropdown {
  position: absolute;
  top: 45px;
  left: 0;
  right: 0;
  background: #111;
  border-radius: 10px;
  padding: 8px;
  z-index: 20;
}

.dropdown-item {
  padding: 8px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #222;
}

.no-result {
  padding: 8px;
  color: #777;
}
@media (max-width: 600px) {
  .search-input-group { flex-direction: column; }
  .search-btn-main { height: 50px; }
  .hero-title { font-size: 1.8rem; }
}
</style>
