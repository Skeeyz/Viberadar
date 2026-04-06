<template>
  <div class="movie-filter">
    <div class="filter-header">
      <span class="filter-label">FILTERS</span>
      <button class="btn-reset" @click="resetFilters">
        <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
          <path d="M10 2L2 10M2 2l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Reset
      </button>
    </div>

    <!-- Row 1: Dropdowns -->
    <div class="filter-row">
      <div class="select-wrap">
        <select v-model="filters.type" class="filter-select">
          <option value="movie">Movies</option>
          <option value="tv">TV Show</option>
        </select>
        <svg class="select-arrow" width="10" height="6" fill="none" viewBox="0 0 10 6">
          <path d="M1 1l4 4 4-4" stroke="#8a8fa8" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="select-wrap">
        <select v-model="filters.country" class="filter-select">
          <option value="">Country</option>
          <option value="US">USA</option>
          <option value="KR">South Korea</option>
          <option value="JP">Japan</option>
          <option value="CN">China</option>
          <option value="VN">Vietnam</option>
          <option value="GB">UK</option>
          <option value="FR">France</option>
          <option value="IN">India</option>
        </select> 
        <svg class="select-arrow" width="10" height="6" fill="none" viewBox="0 0 10 6">
          <path d="M1 1l4 4 4-4" stroke="#8a8fa8" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="select-wrap">
        <select v-model="filters.year" class="filter-select">
          <option value="">Release year</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
        <svg class="select-arrow" width="10" height="6" fill="none" viewBox="0 0 10 6">
          <path d="M1 1l4 4 4-4" stroke="#8a8fa8" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="select-wrap">
        <select v-model="filters.sort" class="filter-select">
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest</option>
          <option value="release_date.asc">Oldest</option>
          <option value="title.asc">Title A–Z</option>
        </select>
        <svg class="select-arrow" width="10" height="6" fill="none" viewBox="0 0 10 6">
          <path d="M1 1l4 4 4-4" stroke="#8a8fa8" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <br>
    <!-- Row 2: Genres (TMDB official IDs) -->
    <div class="filter-section">
      <p class="section-label">Genres</p>
      <div class="genre-tags">
        <span
          v-for="genre in currentGenres"
          :key="genre.id"
          class="genre-tag"
          :class="{ active: filters.genres.includes(genre.id) }"
          @click="toggleGenre(genre.id)"
        >
          {{ genre.name }}
        </span>
      </div>
    </div>

    <!-- Row 3: Rating Slider -->
    <div class="filter-section">
      <p class="section-label">Minimum TMDB rating</p>
      <div class="rating-row">
        <span class="rating-bound">0</span>
        <div class="slider-wrap">
          <div class="slider-track">
            <div class="slider-fill" :style="{ width: (filters.minRating / 10 * 100) + '%' }"></div>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            v-model.number="filters.minRating"
            class="rating-slider"
          />
        </div>
        <span class="rating-bound">10</span>
        <span class="rating-value">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="#f5c518" style="vertical-align:middle;margin-right:3px;margin-top:-1px">
            <path d="M6 1l1.4 2.8 3.1.5-2.2 2.2.5 3.1L6 8.2l-2.8 1.4.5-3.1L1.5 4.3l3.1-.5z"/>
          </svg>
          {{ filters.minRating.toFixed(1) }}+
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="filter-actions">
      <span class="result-count">
        Selected <strong>{{ filters.genres.length }}</strong> Genres
      </span>
      <button class="btn-apply" @click="applyFilters">
        <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
          <path d="M1 3h12M4 7h6M6 11h2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script>
// ============================================================
// TMDB Official Genre IDs
// Source: https://developers.themoviedb.org/3/genres
// ============================================================
const MOVIE_GENRES = [
  { id: 28,    name: 'Action' },
  { id: 12,    name: 'Adventure' },
  { id: 16,    name: 'Animation' },
  { id: 35,    name: 'Comedy' },
  { id: 80,    name: 'Crime' },
  { id: 99,    name: 'Documentary' },
  { id: 18,    name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14,    name: 'Fantasy' },
  { id: 36,    name: 'History' },
  { id: 27,    name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648,  name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878,   name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53,    name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37,    name: 'Western' },
];

const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16,    name: 'Animation' },
  { id: 35,    name: 'Comedy' },
  { id: 80,    name: 'Crime' },
  { id: 99,    name: 'Documentary' },
  { id: 18,    name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648,  name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37,    name: 'Western' },
];

export default {
  name: 'MovieFilter',

  props: {
    initialFilters: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['apply', 'reset'],

  data() {
    return {
      filters: {
        type: 'movie',
        country: '',
        year: '',
        sort: 'popularity.desc',
        genres: [],
        minRating: 6,
        ...this.initialFilters
      }
    }
  },

  computed: {
    currentGenres() {
      return this.filters.type === 'tv' ? TV_GENRES : MOVIE_GENRES
    }
  },

  watch: {
    'filters.type'() {
      this.filters.genres = []
    }
  },

  methods: {
    toggleGenre(id) {
      const idx = this.filters.genres.indexOf(id)
      if (idx === -1) {
        this.filters.genres.push(id)
      } else {
        this.filters.genres.splice(idx, 1)
      }
    },

    applyFilters() {
      const params = {
        type: this.filters.type,               // 'movie' | 'tv'
        with_genres: this.filters.genres.join(','),
        with_origin_country: this.filters.country,
        primary_release_year: this.filters.year,
        sort_by: this.filters.sort,
        'vote_average.gte': this.filters.minRating,
      }
      this.$emit('apply', { params })
},
    resetFilters() {
      this.filters = {
        type: 'movie',
        country: '',
        year: '',
        sort: 'popularity.desc',
        genres: [],
        minRating: 6
      }
      this.$emit('reset')
    }
  }
}
</script>

<style scoped>
.movie-filter {
  background: #0d1117;
  padding: 16px 14px 18px;
  margin: 14px 10px 14px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.filter-label {
  font-size: 11px;
  letter-spacing: 2px;
  color: #8a8fa8;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #8a8fa8;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
}

.btn-reset:hover { color: #f0f0f0; }

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 0;
}

.select-wrap {
  position: relative;
  width: 100%;
}

.filter-select {
  width: 100%;
  appearance: none;
  background: #252a38;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #f0f0f0;
  font-size: 12px;
  padding: 7px 28px 7px 10px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:hover { border-color: rgba(255, 255, 255, 0.2); }
.filter-select:focus { outline: none; border-color: #E53935; }
.filter-select option { background: #1a1e27; }

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.filter-section { margin-bottom: 12px; }

.section-label {
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #8a8fa8;
  margin-bottom: 8px;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.genre-tag {
  background: #252a38;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #8a8fa8;
  font-size: 11px;
  padding: 4px 11px;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  transition: all 0.18s;
}

.genre-tag:hover {
  border-color: rgba(229, 57, 53, 0.4);
  color: #f0f0f0;
}

.genre-tag.active {
  background: rgba(229, 57, 53, 0.15);
  border-color: #E53935;
  color: #E53935;
  font-weight: 500;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-bound {
  font-size: 12px;
  color: #8a8fa8;
  min-width: 10px;
}

.slider-wrap {
  flex: 1;
  position: relative;
  height: 18px;
  display: flex;
  align-items: center;
}

.slider-track {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: #252a38;
  border-radius: 2px;
}

.slider-fill {
  height: 100%;
  background: #E53935;
  border-radius: 2px;
}

.rating-slider {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  margin: 0;
}

.rating-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #E53935;
  cursor: pointer;
  border: 2px solid #111318;
}

.rating-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #E53935;
  cursor: pointer;
  border: 2px solid #111318;
}

.rating-value {
  font-size: 13px;
  font-weight: 600;
  color: #E53935;
  min-width: 52px;
  text-align: right;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 4px;
}

.result-count {
  font-size: 12px;
  color: #8a8fa8;
}

.result-count strong {
  color: #E53935;
  font-weight: 600;
}

.btn-apply {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  background: #E53935;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 9px 0;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.2s, transform 0.1s;
}

.btn-apply:hover { background: #C62828; }
.btn-apply:active { transform: scale(0.97); }

@media (max-width: 640px) {
  .movie-filter { padding: 16px 1rem 20px; }
  .select-wrap { min-width: 45%; }
  .filter-actions { flex-direction: column; gap: 12px; align-items: stretch; }
  .btn-apply { justify-content: center; }
}
</style>