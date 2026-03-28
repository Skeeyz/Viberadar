<template>
  <div class="search-bar-wrapper" ref="wrapperRef">
    <!-- Dropdown type selector -->
    <div class="type-dropdown" @click="toggleDropdown" ref="dropdownRef">
      <span>{{ selectedLabel }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
      <ul v-if="dropdownOpen" class="dropdown-menu">
        <li
          v-for="opt in options"
          :key="opt.value"
          :class="{ active: selected === opt.value }"
          @click.stop="selectOption(opt)"
        >{{ opt.label }}</li>
      </ul>
    </div>

    <!-- Search input -->
    <input
      v-model="query"
      type="text"
      :placeholder="`Search ${selectedLabel}...`"
      @keyup.enter="handleSearch"
      @input="onInput"
    />

    <!-- Loading spinner -->
    <div v-if="searching" class="input-spinner"></div>

    <!-- Search icon -->
    <button class="search-btn" @click="handleSearch">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </button>

    <!-- Live results dropdown -->
    <div v-if="showResults" class="results-dropdown">
      <!-- Error -->
      <div v-if="searchError" class="result-error">Failed to fetch results.</div>

      <!-- Results -->
      <template v-else-if="results.length > 0">
        <div
          v-for="movie in results"
          :key="movie.id"
          class="result-item"
          @click="goToDetail(movie)"
        >
          <img
            v-if="movie.poster"
            :src="movie.poster"
            :alt="movie.title"
            class="result-poster"
          />
          <div v-else class="result-poster-placeholder">🎬</div>

          <div class="result-info">
            <p class="result-title">{{ movie.title }}</p>
            <p class="result-meta">{{ movie.year }} · ⭐ {{ movie.score }}</p>
          </div>
        </div>

        <!-- See all -->
        <div class="result-footer" @click="handleSearch">
          See all results for <em>"{{ query }}"</em> →
        </div>
      </template>

      <!-- No results -->
      <div v-else class="result-empty">
        No results for <strong>"{{ query }}"</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { searchMovies, searchTVShows } from '@/services/movieService'  // ← thêm searchTVShows

const router      = useRouter()
const wrapperRef  = ref(null)
const dropdownRef = ref(null)

const options = [
  { label: 'TV Show', value: 'tv'     },
  { label: 'Movie',   value: 'movie'  },
  { label: 'Series',  value: 'series' },
]

const selected     = ref('tv')
const dropdownOpen = ref(false)
const query        = ref('')
const results      = ref([])
const searching    = ref(false)
const searchError  = ref(false)
const showResults  = ref(false)

let debounceTimer = null

const selectedLabel = computed(
  () => options.find(o => o.value === selected.value)?.label ?? 'TV Show'
)

// ── Chọn API đúng theo type ──
function fetchByType(q, page = 1) {
  if (selected.value === 'movie') {
    return searchMovies(q, page)
  }
  // tv và series đều dùng /search/tv
  return searchTVShows(q, page)
}

function onInput() {
  clearTimeout(debounceTimer)
  searchError.value = false

  if (!query.value.trim()) {
    showResults.value = false
    results.value     = []
    return
  }

  debounceTimer = setTimeout(() => fetchLiveResults(), 350)
}

async function fetchLiveResults() {
  searching.value = true
  try {
    const data    = await fetchByType(query.value.trim(), 1)  // ← dùng fetchByType
    results.value = (Array.isArray(data) ? data : data.results ?? []).slice(0, 6)
    showResults.value = true
  } catch (err) {
    searchError.value = true
    showResults.value = true
    console.error(err)
  } finally {
    searching.value = false
  }
}

function goToDetail(movie) {
  showResults.value = false
  query.value       = ''
  router.push({ 
    name: 'MovieDetail', 
    params: { id: movie.id },
    query: { type: selected.value }   // ← thêm type vào query
  })
}

function handleSearch() {
  if (!query.value.trim()) return
  showResults.value = false
  router.push({ name: 'SearchResult', query: { q: query.value.trim(), type: selected.value } })
}

function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }

function selectOption(opt) {
  selected.value     = opt.value
  dropdownOpen.value = false
  // Nếu đang hiện kết quả, search lại với type mới
  if (query.value.trim()) fetchLiveResults()
}

function handleClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    dropdownOpen.value = false
    showResults.value  = false
  }
}
onMounted(()  => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.search-bar-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 560px;
  height: 40px;
  background: #1e2230;
  border-radius: 6px;
  overflow: visible;
  position: relative;
}

/* Dropdown type */
.type-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 100%;
  background: #e8003d;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px 0 0 6px;
  white-space: nowrap;
  user-select: none;
  min-width: 110px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: #1a1f2e;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  list-style: none;
  margin: 0; padding: 4px 0;
  min-width: 130px;
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.dropdown-menu li {
  padding: 9px 16px;
  color: #ccc;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dropdown-menu li:hover { background: rgba(255,255,255,0.07); color: #fff; }
.dropdown-menu li.active { color: #e8003d; font-weight: 600; }

/* Input */
.search-bar-wrapper input {
  flex: 1;
  background: transparent;
  border: none; outline: none;
  color: #fff;
  font-size: 0.9rem;
  padding: 0 12px;
  height: 100%;
}
.search-bar-wrapper input::placeholder { color: #666; }

/* Spinner inside input */
.input-spinner {
  width: 14px; height: 14px;
  border: 2px solid #2e3a4a;
  border-top-color: #e8b84b;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
  margin-right: 4px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Search button */
.search-btn {
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none;
  color: #888; cursor: pointer;
  padding: 0 14px; height: 100%;
  transition: color 0.2s;
}
.search-btn:hover { color: #fff; }

/* ── Live results dropdown ── */
.results-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: #141824;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  overflow: hidden;
  z-index: 999;
  box-shadow: 0 12px 32px rgba(0,0,0,0.6);
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.result-item:last-of-type { border-bottom: none; }
.result-item:hover { background: rgba(255,255,255,0.05); }

.result-poster {
  width: 36px; height: 50px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
  background: #1e2530;
}

.result-poster-placeholder {
  width: 36px; height: 50px;
  background: #1e2530;
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}

.result-info { flex: 1; min-width: 0; }

.result-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}

.result-meta {
  font-size: 0.75rem;
  color: #666;
}

.result-footer {
  padding: 10px 14px;
  text-align: center;
  font-size: 0.82rem;
  color: #888;
  cursor: pointer;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid rgba(255,255,255,0.06);
  transition: color 0.15s, background 0.15s;
}
.result-footer:hover { color: #e8b84b; background: rgba(255,255,255,0.04); }
.result-footer em { color: #e8b84b; font-style: normal; }

.result-empty, .result-error {
  padding: 1.2rem;
  text-align: center;
  font-size: 0.85rem;
  color: #555;
}
.result-error { color: #e74c3c; }
</style>