<template>
  <div class="filter-container">
    <h2 class="filter-title">BỘ LỌC PHIM</h2>

    <!-- Genre -->
    <div class="filter-section">
      <button class="section-header" @click="toggleSection('genre')">
        <span>Thể loại</span>
        <span :class="['arrow', { active: expandedSections.genre }]">⌄</span>
      </button>

      <div v-if="expandedSections.genre" class="section-content">
        <label v-for="genre in genres" :key="genre" class="checkbox-item">
          <input
            type="checkbox"
            :checked="filters.genre.includes(genre)"
            @change="toggleFilter('genre', genre)"
          />
          <span>{{ genre }}</span>
        </label>
      </div>
    </div>

    <!-- Year -->
    <div class="filter-section">
      <button class="section-header" @click="toggleSection('year')">
        <span>Năm</span>
        <span :class="['arrow', { active: expandedSections.year }]">⌄</span>
      </button>

      <div v-if="expandedSections.year" class="section-content">
        <div class="year-range">
          <button @click="changeYearRange(-1)">←</button>
          <span>{{ filters.yearRange[0] }} - {{ filters.yearRange[1] }}</span>
          <button @click="changeYearRange(1)">→</button>
        </div>

        <div class="year-options">
          <button
            v-for="year in yearOptions"
            :key="year"
            @click="selectYear(year)"
            :class="{ active: filters.selectedYear === year }"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </div>

<!-- Rating -->
<div class="filter-section">
  <button class="section-header" @click="toggleSection('rating')">
    <span>Đánh giá</span>
    <span :class="['arrow', { active: expandedSections.rating }]">⌄</span>
  </button>

  <div v-if="expandedSections.rating" class="section-content">
    <div v-for="rate in ratings" :key="rate" class="rating-item">
      <span
        v-for="star in 5"
        :key="star"
        class="star"
        :class="{ active: star <= rate && filters.rating.includes(rate) }"
        @click="changeRating('rating', rate)"
      >
        ★
      </span>
    </div>
  </div>
</div>
    <!-- Buttons -->
    <div class="actions">
      <button class="btn apply" @click="applyFilters">Áp dụng</button>
      <button class="btn reset" @click="resetFilters">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// UI state
const expandedSections = ref({
  genre: true,
  year: true,
  rating: true
})

// Data
const genres = ['Action', 'Adventure', 'Sci-Fi', 'Thriller']
const ratings = [1,2,3,4,5]
const yearOptions = [2010, 2015, 2020, 2023]

// Filters
const filters = reactive({
  genre : [] as string[],
  yearRange: [2000, 2024],
  selectedYear: null as number | null,
  rating: [] as number[],
})

// Toggle section
const toggleSection = (key: string) => {
  expandedSections.value[key] = !expandedSections.value[key]
}


// Toggle checkbox
const toggleFilter = (type: 'genre' , value: string) => {
  const arr = filters[type]
  const index = arr.indexOf(value)

  if (index > -1) arr.splice(index, 1)
  else arr.push(value)
}

const changeRating = (type: 'rating' , value: number) => {
  const arr = filters[type]
  const index = arr.indexOf(value)

  if (index > -1) arr.splice(index, 1)
  else arr.push(value)
}
// Change year range
const changeYearRange = (direction: number) => {
  const [start, end] = filters.yearRange

  if (direction === -1 && start > 1990) {
    filters.yearRange = [start - 10, end - 10]
  }

  if (direction === 1 && end < 2034) {
    filters.yearRange = [start + 10, end + 10]
  }
}

// Select year
const selectYear = (year: number) => {
  filters.selectedYear =
    filters.selectedYear === year ? null : year
}




// Apply
const applyFilters = () => {
  console.log('Filters:', filters)
}

// Reset
const resetFilters = () => {
  filters.genre = []
  filters.rating = [0,6]
  filters.yearRange = [2000, 2024]
  filters.selectedYear = null
}
</script>
<style  scoped>
.filter-container {
  width: 320px;
  background: #0f172a;
  padding: 20px;
  border-radius: 10px;
  color: #ccc;
  border: 1px solid #1e293b;
}

/* Title */
.filter-title {
  color: #f59e0b;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Section */
.filter-section {
  border-bottom: 1px solid #1e293b;
  margin-bottom: 15px;
}

/* Header */
.section-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
}

.section-header:hover {
  color: white;
}

/* Arrow */
.arrow {
  transition: 0.3s;
}

.arrow.active {
  transform: rotate(180deg);
}

/* Content */
.section-content {
  padding: 10px 0;
}

/* Checkbox */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  cursor: pointer;
}

/* Year */
.year-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.year-range button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}

.year-range button:hover {
  color: white;
}

/* Year options */
.year-options {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.year-options button {
  padding: 5px 10px;
  border: 1px solid #334155;
  background: transparent;
  color: #888;
  cursor: pointer;
  border-radius: 4px;
}

.year-options button:hover {
  color: white;
  border-color: #f59e0b;
}

.year-options button.active {
  background: #f59e0b;
  color: black;
}

/* Buttons */
.actions {
  margin-top: 15px;
}

.btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 8px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

.btn.apply {
  background: #f59e0b;
  color: black;
}

.btn.reset {
  background: #1e293b;
  color: #ccc;
}

.btn:hover {
  opacity: 0.9;
}
.star {
  cursor: pointer;
  font-size: 18px;
  color: #ccc;
  transition: 0.2s;
}

.star.active {
  color: #f5b50a; /* vàng */
}

.star:hover {
  transform: scale(1.2);
}
</style>

