<template>
  <div class="search-container">
    <!-- Background -->
    <div class="search-bg"></div>

    <!-- Content -->
    <div class="search-wrapper">
      <div class="search-header">
        <h1 class="search-title">Find Your Next Adventure</h1>
        <p class="search-subtitle">Explore thousands of movies and shows</p>
      </div>

      <div class="search-input-wrapper">
        <div class="search-input-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search movies, shows, genres..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <button @click="handleSearch" class="search-btn">Search</button>
      </div>

      <!-- Recent Searches -->
      <div v-if="recentSearches.length > 0" class="recent-searches">
        <p class="recent-title">Recent</p>
        <div class="tags-container">
          <button
            v-for="(search, index) in recentSearches"
            :key="index"
            @click="searchQuery = search; handleSearch()"
            class="tag"
          >
            {{ search }}
          </button>
        </div>
      </div>

      <!-- Popular Searches -->
      <div class="popular-searches">
        <p class="popular-title">Popular Now</p>
        <div class="tags-container">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="searchQuery = tag; handleSearch()"
            class="tag"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const recentSearches = ref<string[]>([])
const popularTags = [
  'Action',
  'Drama',
  'Sci-Fi',
  'Thriller',
  'Comedy',
  'Horror',
  'Animation',
  'Adventure'
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Add to recent searches
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value)
      if (recentSearches.value.length > 5) {
        recentSearches.value.pop()
      }
    }

    // Emit search event
    console.log('Searching for:', searchQuery.value)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<style scoped>
.search-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.search-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0f1f3c 0%, #1a2f5a 50%, #0f1f3c 100%);
  z-index: -1;
}

.search-wrapper {
  width: 100%;
  max-width: 700px;
  padding: 2rem;
}

.search-header {
  text-align: center;
  margin-bottom: 3rem;
}

.search-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.5px;
}

.search-subtitle {
  font-size: 1rem;
  color: #a0afc9;
  margin: 0.5rem 0 0 0;
}

.search-input-wrapper {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.search-input-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0 1rem;
  transition: all 0.3s ease;
}

.search-input-box:focus-within {
  background: rgba(255, 255, 255, 0.12);
  border-color: #ff1b6d;
  box-shadow: 0 0 20px rgba(255, 27, 109, 0.2);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #a0afc9;
  flex-shrink: 0;
  margin-right: 0.75rem;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 1rem;
  padding: 1rem 0;
  font-family: inherit;
}

.search-input::placeholder {
  color: #6b7a94;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #a0afc9;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: #ff1b6d;
}

.clear-btn svg {
  width: 18px;
  height: 18px;
}

.search-btn {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #ff1b6d 0%, #ff4a8e 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 27, 109, 0.3);
  white-space: nowrap;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 27, 109, 0.4);
}

.search-btn:active {
  transform: translateY(0);
}

.recent-searches,
.popular-searches {
  margin-bottom: 2rem;
}

.recent-title,
.popular-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #a0afc9;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 1rem 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  padding: 0.6rem 1.2rem;
  background: rgba(255, 27, 109, 0.15);
  color: #ff1b6d;
  border: 1.5px solid rgba(255, 27, 109, 0.4);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.tag:hover {
  background: rgba(255, 27, 109, 0.3);
  border-color: #ff1b6d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 27, 109, 0.2);
}

.tag:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .search-wrapper {
    padding: 1.5rem;
  }

  .search-title {
    font-size: 1.875rem;
  }

  .search-input-wrapper {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }

  .search-input-box {
    padding: 0 0.75rem;
  }

  .search-icon {
    width: 18px;
    height: 18px;
  }

  .search-input {
    font-size: 0.95rem;
  }
}
</style>
