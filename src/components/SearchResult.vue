<template>
  <section class="search-page">
    <div class="search-header">
      <p class="eyebrow">Search Results</p>
      <h1>Kết quả tìm kiếm</h1>
      <p class="search-summary">
        Đã tìm thấy {{ movies.length }} kết quả cho "<strong>{{ searchKeyword }}</strong>"
      </p>
    </div>

    <div v-if="movies.length > 0" class="search-results">
      <MovieGrid :movies="movies" />
    </div>

    <div v-else class="no-results">
      <h2>Không tìm thấy phim phù hợp</h2>
      <p>Hãy thử lại với tên phim khác, thể loại khác hoặc từ khóa ngắn hơn.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import MovieGrid from '@/components/MovieGrid.vue'
import { ref } from 'vue'

interface Movie {
  id: number
  title: string
  poster: string
  year: number
  rating: number
  description: string
  genres: string[]
}

const searchKeyword = ref('Inception')

const movies = ref<Movie[]>([
  {
    id: 1,
    title: 'Inception',
    poster: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
    year: 2010,
    rating: 10,
    description: 'Dream inside dream',
    genres: ['Sci-Fi', 'Action'],
  },
  {
    id: 2,
    title: 'Interstellar',
    poster: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    year: 2014,
    rating: 8.6,
    description: 'Space travel',
    genres: ['Sci-Fi', 'Drama'],
  },
  {
    id: 3,
    title: 'The Dark Knight',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    year: 2008,
    rating: 9,
    description: 'Batman vs Joker',
    genres: ['Action', 'Crime'],
  },
])
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-header {
  padding: 28px 30px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(15, 23, 42, 0.78)),
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.18), transparent 42%);
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 0.76rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f59e0b;
}

.search-header h1 {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
}

.search-summary {
  margin: 12px 0 0;
  color: #cbd5e1;
  line-height: 1.6;
}

.search-summary strong {
  color: #f8fafc;
}

.search-results {
  border-radius: 24px;
  padding: 24px;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.no-results {
  padding: 40px 24px;
  text-align: center;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px dashed rgba(148, 163, 184, 0.2);
}

.no-results h2 {
  margin: 0 0 10px;
  color: #f8fafc;
  font-size: 1.4rem;
}

.no-results p {
  margin: 0;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .search-header,
  .search-results,
  .no-results {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
