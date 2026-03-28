<template>
  <MainLayout>
    <!-- Loading / Error -->
    <div v-if="store.loading" class="state-msg">Loading...</div>
    <div v-else-if="store.error" class="state-msg error">{{ store.error }}</div>

    <template v-else>
      <!-- Hero -->
      <MovieHero
        v-if="store.featured"
        :movie="store.featured"
        @rate="handleRate"
        @open-trailer="openTrailer"

      />
      <!-- Trailer modal -->
    <MovieTrailer
      :show="showTrailer"
      :trailer-key="trailerKey"
      @close="showTrailer = false"
    />
    <div class="search-area">
      <MovieSearch />
    </div>

      <!-- Recently Updated -->
      <section class="list-section">
        <Header title="Recently Updated" />
        <div class="recent-list">
          <div
            v-for="item in store.recentlyUpdated"
            :key="item.title"
            class="recent-card"
            @click="goToDetail(item)"
          >
            <img :src="item.poster" :alt="item.title" class="recent-poster" />
            <div class="recent-info">
              <p class="recent-title">{{ item.title }}</p>
              <p class="recent-episode">{{ item.episode }}</p>
              <p class="recent-date">{{ item.date }}</p>
              
            </div>
          </div>
          <button class="scroll-btn">→</button>
        </div>
      </section>

      <!-- New Release - Movies -->
      <section class="movie-section">
        <Header title="New Release - Movies" :view-all="true" />
        <div class="movie-grid">
          <MovieCard
            v-for="movie in store.newMovies"
            :key="movie.id"
            :movie="movie"
            @click="goToDetail"
          />
        </div>
      </section>

      <!-- New Release - Series -->
      <section class="movie-section">
        <Header title="New Release - Series" :view-all="true" />
        <div class="movie-grid">
          <MovieCard
            v-for="series in store.newSeries"
            :key="series.id"
            :movie="series"
            @click="goToDetail"
          />
        </div>
      </section>

      <!-- Recommended -->
      <section class="movie-section">
        <Header title="Recommended" :view-all="true">
          <div class="filter-tabs">
            <button
              v-for="tab in tabs"
              :key="tab"
              class="tab-btn"
              :class="{ active: activeTab === tab }"
              @click="activeTab = tab"
            >{{ tab }}</button>
          </div>
        </Header>
        <div class="movie-grid">
          <MovieCard
            v-for="movie in store.recommended"
            :key="movie.id"
            :movie="movie"
            @click="goToDetail"
          />
        </div>
      </section>
    </template>
  </MainLayout>
</template>

<script>
import MainLayout   from '../layouts/MainLayout.vue'
import MovieHero    from '../components/MovieHero.vue'
import MovieCard    from '../components/MovieCard.vue'
import Header       from '../components/Header.vue'
import MovieTrailer from '../components/MovieTrailer.vue' 
import MovieSearch from '@/components/MovieSearch.vue'
import { useMovieStore } from '../stores/movieStore'
import { fetchMovieVideos } from '../services/movieService'

export default {
  name: 'Home',
  components: { MainLayout, MovieHero, MovieCard, Header, MovieTrailer, MovieSearch },
  setup() {
    const store = useMovieStore()
    return { store }
  },
  data() {
    return {
      activeTab: 'Movies',
      tabs: ['Movies', 'Series', 'Animation'],
      showTrailer: false,   
      trailerKey: null,
      currentTrailerMovieId: null,
    }
  },
  mounted() {
    this.store.fetchHome()
  },
  methods: {
    goToDetail(movie) {
      this.$router.push({ name: 'MovieDetail', params: { id: movie.id } })
    },
    async openTrailer() {
    const featured = this.store.featured;
    if (!featured) return;

    // Fetch new trailer if the featured movie changed or no key is cached
    if (!this.trailerKey || this.currentTrailerMovieId !== featured.id) {
      try {
        const videos = await fetchMovieVideos(featured.id);
        const best = videos.find(v => v.type === 'Trailer' && v.official)
                  ?? videos.find(v => v.type === 'Trailer')
                  ?? videos[0];
        this.trailerKey = best?.key ?? null;
        this.currentTrailerMovieId = featured.id;
      } catch (error) {
        console.error('Failed to fetch trailer:', error);
        this.trailerKey = null;
      }
    }
    this.showTrailer = true;
},
    handleRate(stars) {
      console.log('Rated:', stars)
    },
  },
}
</script>

<style scoped>
.list-section, .movie-section {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #1a2030;
}

.state-msg { padding: 3rem 2rem; text-align: center; color: #888; }
.state-msg.error { color: #e74c3c; }

.recent-list { display: flex; align-items: center; gap: 1.2rem; }
.recent-card { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
.recent-card:hover { opacity: 0.8; }
.recent-poster { width: 55px; height: 70px; object-fit: cover; border-radius: 4px; }
.recent-title { font-size: 0.82rem; font-weight: 600; color: #e0e0e0; }
.recent-episode, .recent-date { font-size: 0.72rem; color: #888; }

.scroll-btn {
  margin-left: auto;
  width: 42px; height: 42px;
  border-radius: 50%;
  background: #2a3040; border: none;
  color: #fff; font-size: 1.1rem; cursor: pointer;
}
.scroll-btn:hover { background: #e8b84b; color: #000; }

.movie-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.filter-tabs { display: flex; gap: 0.4rem; }
.tab-btn {
  background: transparent; border: 1px solid #2e3a4a;
  color: #aaa; padding: 0.3rem 0.9rem;
  border-radius: 20px; font-size: 0.78rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.tab-btn.active, .tab-btn:hover { background: #e8b84b; color: #000; border-color: #e8b84b; }
.search-area {
  display: flex;
  justify-content: center;
  padding: 50px 0;
}

@media (max-width: 900px) {
  .movie-grid { grid-template-columns: repeat(2, 1fr); }
  .list-section, .movie-section { padding: 1rem; }
}
</style>
