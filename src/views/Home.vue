 <!-- <template>
  <MovieCard :movie="movieData" />
</template>

<script setup>
import MovieCard from '@/components/MovieCard.vue';
defineOptions({
  name: "HomePage"
})

const movieData = {
  title: 'The Shawshank Redemption',
  poster: 'https://image.tmdb.org/t/p/w500/...',
  year: 1994,
  rating: 9.3,
  description: 'Two imprisoned men bond over a number of years...',
  genres: ['Drama', 'Crime']
}
</script>  -->
<!-- <template>
  <SkeletonCard />
</template>

<script setup>
defineOptions({
  name: "HomePage"
})

import SkeletonCard from '@/components/SkeletonCard.vue'
</script>
-->
<template>
  <div class="home">
    <h2 class="section-title">Trending Movies</h2>

    <MovieGrid :movies="movies" />
  </div>
</template>

 <script setup lang="ts">
import MovieGrid from "@/components/MovieGrid.vue"

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
    rating: 8.8,
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
    id: 3,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    year: 2008,
    rating: 9.0,
    description: "Batman vs Joker",
    genres: ["Action", "Crime"]
  },
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
    id: 3,
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
  }

]
</script>

 <style scoped>
.home{
  padding: 30px 20px;
}

.movie-grid{
  max-width: 1200px;
  margin: 0 auto;
}

.section-title{
  font-size: 24px;
  margin-bottom: 20px;
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
