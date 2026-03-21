<template>
  <div class="home">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">VibeRadar Picks</p>
        <h1 class="hero-title">Khám phá những bộ phim đang tạo sóng tuần này</h1>
        <p class="hero-text">
          Từ sci-fi, hành động đến crime thriller, danh sách này gom những tựa phim nổi bật
          nhất để bạn mở là xem ngay.
        </p>
      </div>

      <div class="hero-stats">
        <div class="stat-card">
          <span class="stat-value">{{ movies.length }}</span>
          <span class="stat-label">Phim nổi bật</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">5★</span>
          <span class="stat-label">Hiển thị theo sao</span>
        </div>
      </div>
    </section>

    <section class="catalog-section">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Trending Now</p>
          <h2 class="section-title">Danh sách đề cử hôm nay</h2>
        </div>
      </div>

      <MovieGrid :movies="movies" />
      <SkeletonCard  v-for="i in 4" :key="i" />
    </section>
  </div>
</template>

 <script setup lang="ts">
import MovieGrid from "@/components/MovieGrid.vue"
import SkeletonCard from "@/components/SkeletonCard.vue"

interface Movie {
  id: number
  title: string
  poster: string
  year: number
  rating: number
  description: string
  genres: string[]
}

const movies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    year: 2010,
    rating: 10,
    description: "Dream inside dream",
    genres: ["Sci-Fi", "Action"]
  },
  {
    id: 2,
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    year: 2014,
    rating: 8.6,
    description: "Space travel",
    genres: ["Sci-Fi", "Drama"]
  },
  {
    id: 4,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 9.0,
    description: "Batman vs Joker",
    genres: ["Action", "Crime"]
  },
  {
    id: 5,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 9.0,
    description: "Batman vs Joker",
    genres: ["Action", "Crime"]
  },
  {
    id: 6,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 9.0,
    description: "Batman vs Joker",
    genres: ["Action", "Crime"]
  }
  ,
  {
    id: 7,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 9.0,
    description: "Batman vs Joker",
    genres: ["Action", "Crime"]
  }
  ,
  {
    id: 8,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 9.0,
    description: "Batman vs Joker",
    genres: ["Action", "Crime"]
  }
  ,
  {
    id: 3,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 9.0,
    description: "Batman vs Joker",
    genres: ["Action", "Crime"]
  },
  {
    id: 44,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 9.0,
    description: "Batman vs Joker",
    genres: ["Action", "Crime"]
  }

]
</script>

 <style scoped>
.home{
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(260px, 0.9fr);
  gap: 24px;
  padding: 32px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72)),
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.2), transparent 40%);
  box-shadow: 0 24px 60px rgba(2, 8, 23, 0.28);
}

.eyebrow,
.section-kicker {
  margin: 0 0 10px;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #f59e0b;
}

.hero-title {
  margin: 0;
  max-width: 12ch;
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 1.02;
  color: #f8fafc;
}

.hero-text {
  margin: 18px 0 0;
  max-width: 62ch;
  line-height: 1.7;
  color: #cbd5e1;
}

.hero-stats {
  display: grid;
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 140px;
  padding: 24px;
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.stat-value {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 700;
  color: #f8fafc;
}

.stat-label {
  margin-top: 8px;
  color: #94a3b8;
}

.catalog-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
}

.section-title{
  margin: 0;
  font-size: clamp(1.5rem, 2.2vw, 2.1rem);
  color: #f8fafc;
}

.section-subtitle {
  margin: 0;
  max-width: 420px;
  color: #94a3b8;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .section-heading {
    flex-direction: column;
    align-items: start;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 24px 20px;
    border-radius: 22px;
  }
}
</style>
<!-- <template>
  <SearchBar />
</template>

<script setup>
import SearchBar from '@/components/SearchBar.vue';
</script> -->
<!-- <template>
  <div class="home">
    <h1 class="title">Home Page</h1>
    <p class="subtitle">Test Application Layout</p>

    <div class="grid">
      <div class="card" v-for="i in 30" :key="i">
        <h3>Card {{ i }}</h3>
        <p>This is a sample content to test layout spacing.</p>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}
</style> -->
