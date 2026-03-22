<template>
  <div class="search-component">
    <form class="search-input-group" @submit.prevent="handleSearch">
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
        <button v-if="searchQuery" type="button" @click="clearSearch" class="clear-btn">
          ✕
        </button>

        <!-- dropdown -->
        <div v-if="showDropdown && searchQuery.trim()" class="search-dropdown">
          <div
            v-for="movie in searchResults"
            :key="movie.id"
            class="dropdown-item"
            @click="selectMovie(movie.title)"
          >
            {{ movie.title }}
          </div>

          <p v-if="isSearching" class="no-result">
            Đang tìm...
          </p>

          <p v-else-if="searchResults.length === 0" class="no-result">
            Không có kết quả
          </p>
        </div>
      </div>

      <button type="submit" class="search-btn-main">Tìm</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { searchMovies } from '@/services/movieService'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface Movie {
  id: number
  title: string
  poster: string
  year: number
  rating: number
  description: string
  genres: string[]
}
const searchQuery = ref('')
const showDropdown = ref(false)
const searchResults = ref<Movie[]>([])
const isSearching = ref(false)
const router = useRouter()
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const handleSearch = async () => {
  const query = searchQuery.value.trim()
  if (query) {
    showDropdown.value = false
    await router.push({ path: '/search', query: { q: query } })
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  showDropdown.value = false
  searchResults.value = []
}

const selectMovie = async (title: string) => {
  searchQuery.value = title
  await handleSearch()
}

watch(searchQuery, (value) => {
  if (searchTimeout) clearTimeout(searchTimeout)

  const query = value.trim()
  if (!query) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  searchTimeout = setTimeout(async () => {
    isSearching.value = true

    try {
      searchResults.value = (await searchMovies(query)).slice(0, 5)
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.search-component {
  width: 100%;
}

/* group */
.search-input-group {
  display: flex;
  gap: 12px;
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

.search-btn-main {
  min-width: 88px;
  height: 40px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: #08111f;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.search-btn-main:hover {
  opacity: 0.95;
  transform: translateY(-1px);
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
  .search-btn-main {
    width: 100%;
    height: 50px;
  }
  .hero-title { font-size: 1.8rem; }
}
</style>
