<template>
  <div class="home-page-wrapper">
    <button 
      class="floating-filter-btn glass-ui pulse-hover" 
      @click="toggleFilter" 
      title="Open Filters"
    >
      <Filter size="20" />
      <span>Filter</span>
    </button>

    <transition name="drawer-slide">
      <aside v-if="isFilterOpen" class="filter-drawer glass-ui-dark">
        <div class="drawer-header">
          <h3 class="drawer-title">Advanced Filter</h3>
          <button class="close-drawer-btn" @click="closeFilter">
            <X size="22" />
          </button>
        </div>
        <div class="drawer-body">
          <MovieFilter @apply="onFilterApply" @reset="onFilterReset" />
        </div>
      </aside>
    </transition>

    <transition name="fade">
      <div v-if="isFilterOpen" class="drawer-backdrop" @click="closeFilter"></div>
    </transition>

    <div v-if="store.loading" class="state-msg">
      <div class="mini-loader"></div>
      <p>Loading VibeRadar...</p>
    </div>
    <div v-else-if="store.error" class="state-msg error">{{ store.error }}</div>

    <template v-else>
      <main class="content-main" :class="{ 'body-scroll-lock': isFilterOpen }">
        
        <transition name="page-fade">
          <section v-if="store.filteredMovies.length" id="filter-result" class="movie-section results-section glass-ui">
            <Header title="Filter Results" />
            <div v-if="store.filterLoading" class="state-msg">
              <div class="mini-loader"></div>
            </div>
            <div v-else class="movie-grid">
              <MovieCard
                v-for="movie in store.filteredMovies"
                :key="movie.id"
                :movie="movie"
                @click="goToDetail"
              />
            </div>
          </section>
        </transition>

        <section v-show="!store.filteredMovies.length" class="list-section">
          <Header title="Recently Updated" />
          <transition name="fade">
            <button v-show="showLeft" class="scroll-btn left glass-ui" @click="scrollLeft">
              <ChevronLeft size="24" />
            </button>
          </transition>
          <div class="recent-list" ref="listRef" @scroll="checkScroll">
            <div
              v-for="item in store.recentlyUpdated"
              :key="item.title"
              class="recent-card-wrapper"
              @click="goToDetail(item)"
            >
              <div class="recent-card glass-ui-light hover-pop">
                <img :src="item.poster" :alt="item.title" class="recent-poster" loading="lazy" />
                <div class="recent-info">
                  <p class="recent-title">{{ item.title }}</p>
                  <p class="recent-episode">{{ item.episode }}</p>
                  <p class="recent-date">{{ item.date }}</p>
                </div>
              </div>
            </div>
          </div>
          <transition name="fade">
            <button v-show="showRight" class="scroll-btn right glass-ui" @click="scrollRight">
              <ChevronRight size="24" />
            </button>
          </transition>
        </section>

        <section v-if="!store.filteredMovies.length" class="movie-section">
          <Header title="New Release - Movies" :view-all="true" section="new-release" />
          <div class="movie-grid">
            <MovieCard
              v-for="movie in store.newMovies"
              :key="movie.id"
              :movie="movie"
              @click="goToDetail"
            />
          </div>
          <Pagination
            :current="store.newMoviesPage"
            :total-pages="store.newMoviesTotalPages"
            @change="p => store.changePage('new', p)"
          />
        </section>

        <section v-if="!store.filteredMovies.length" class="movie-section">
          <Header title="Upcomming - Movies" :view-all="true" section="upcoming" />
          <div class="movie-grid">
            <MovieCard
              v-for="upcoming in store.upcomingMovie"
              :key="upcoming.id"
              :movie="upcoming"
              @click="goToDetail"
            />
          </div>
          <Pagination
            :current="store.upcomingPage"
            :total-pages="store.upcomingTotalPages"
            @change="p => store.changePage('upcoming', p)"
          />
        </section>

        <section class="movie-section recommended-section glass-ui">
          <Header title="Recommended" :view-all="true" :section="activeTab === 'Movies' ? 'recommended' : 'recommended-tv'">
            <div class="filter-tabs glass-ui-light">
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
              v-for="movie in store[activeTab === 'Movies' ? 'recommended' : 'recommendedTV']"
              :key="movie.id" 
              :movie="movie" 
              @click="goToDetail" 
            />
          </div>
          <Pagination
            :current="activeTab === 'Movies' ? store.recommendedPage : store.recommendedTVPage"
            :total-pages="activeTab === 'Movies' ? store.recommendedTotalPages : store.recommendedTVTotalPages"
            @change="p => store.changePage(activeTab === 'Movies' ? 'recommended' : 'recommendedTV', p)"
          />
        </section>

      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
// Thêm icon mới
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';

import MovieCard from "../components/MovieCard.vue";
import Header from "../components/Header.vue";
import MovieTrailer from "../components/MovieTrailer.vue";
import MovieFilter from "@/components/MovieFilter.vue";
import Pagination from "@/components/Pagination.vue";

import { useMovieStore } from "../stores/movieStore";

// ===== Store & Router =====
const store = useMovieStore();
const router = useRouter();

// ===== State =====
const showLeft = ref(false);
const showRight = ref(true);
const isFilterOpen = ref(false); // Trạng thái đóng mở Filter

const activeTab = ref<"Movies" | "TV Show">("Movies");
const tabs = ["Movies", "TV Show"];

// ===== Ref =====
const listRef = ref<HTMLElement | null>(null);

// ===== Methods =====
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const closeFilter = () => {
  isFilterOpen.value = false;
};

const scrollRight = () => {
  listRef.value?.scrollBy({ left: 400, behavior: "smooth" });
};

const scrollLeft = () => {
  listRef.value?.scrollBy({ left: -400, behavior: "smooth" });
};

const checkScroll = () => {
  const el = listRef.value;
  if (!el) return;
  const scrollLeftValue = Math.round(el.scrollLeft);
  const maxScroll = Math.round(el.scrollWidth - el.clientWidth);
  showLeft.value = scrollLeftValue > 10; 
  showRight.value = scrollLeftValue < maxScroll - 10; 
};

const setupScroll = async () => {
  await nextTick();
  const el = listRef.value;
  if (!el) return;
  el.removeEventListener("scroll", checkScroll);
  el.addEventListener("scroll", checkScroll);
  checkScroll();
};

// ===== Lifecycle =====
onMounted(() => {
  store.fetchHome();
  // Khóa scroll body khi mở drawer trên mobile
  watch(isFilterOpen, (n) => {
    document.body.style.overflow = n ? 'hidden' : '';
  });
});

watch(() => store.recentlyUpdated, () => { setupScroll(); });

onUnmounted(() => {
  listRef.value?.removeEventListener("scroll", checkScroll);
  document.body.style.overflow = '';
});

// ===== Methods =====
const goToDetail = (movie: any) => {
  router.push({ name: "MovieDetail", params: { id: movie.id } });
};

const onFilterApply = ({ params }: any) => {
  store.fetchFiltered(params);
  closeFilter(); // Đóng drawer sau khi apply
  nextTick(() => {
    document.getElementById("filter-result")?.scrollIntoView({ behavior: "smooth" });
  });
};

const onFilterReset = () => {
  store.resetFiltered();
  closeFilter();
};
</script>

<style scoped>
/* --- TỐI ƯU CẤU TRÚC NỀN TẢNG (PERFORMANCE) --- */
.home-page-wrapper {
  min-height: 100vh;
  background: #020617; /* Màu tối sâu, giảm tải cho GPU */
  background-image: radial-gradient(circle at top right, rgba(34, 211, 238, 0.03), transparent);
  -webkit-font-smoothing: antialiased;
}

.content-main {
  flex: 1;
  min-width: 0;
  transition: opacity 0.3s ease;
}

/* Khóa scroll nội dung chính khi mở filter */
.body-scroll-lock {
  opacity: 0.5;
  pointer-events: none;
}

/* --- ĐỊNH NGHĨA GLASSMORPHISM (CHUẨN UX) --- */
.glass-ui {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
}

.glass-ui-light {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.glass-ui-dark {
  background: rgba(10, 15, 25, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

/* --- FLOATING FILTER BUTTON (KÍNH MỜ) --- */
.floating-filter-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  color: #22d3ee;
  font-weight: 700;
  border: none;
  cursor: pointer;
  z-index: 90; /* Nằm dưới header nhưng trên nội dung */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.floating-filter-btn:hover {
  background: rgba(34, 211, 238, 0.1);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 30px rgba(34, 211, 238, 0.2);
}

/* --- FILTER DRAWER (SIDEBAR TRƯỢT KÍNH MỜ) --- */
.filter-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 100vh;
  z-index: 100; /* Nằm trên cùng */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.5);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-title { font-size: 18px; font-weight: 800; color: #fff; margin: 0; }

.close-drawer-btn {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  transition: 0.2s;
  padding: 5px;
  border-radius: 8px;
}
.close-drawer-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}
.drawer-body::-webkit-scrollbar { width: 4px; }
.drawer-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

/* Backdrop */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 95;
}

/* --- SECTIONS (TỐI ƯU LAYOUT) --- */
.list-section, .movie-section {
  position: relative;
  padding: 2rem 3rem; /* Tăng padding cho rộng rãi */
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

/* Đặc biệt cho phần kết quả và Recommended */
.results-section, .recommended-section {
  margin: 2rem 3rem;
  padding: 2rem;
}

/* State messages mượt hơn */
.state-msg { padding: 4rem 2rem; text-align: center; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

/* --- RECENTLY UPDATED (TỐI ƯU CUỘN) --- */
.recent-list {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch; /* Cuộn mượt trên iOS */
}
.recent-list::-webkit-scrollbar { display: none; }

.recent-card-wrapper { flex-shrink: 0; }

.recent-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 12px;
  cursor: pointer;
  transition: 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  width: 260px; /* Cố định chiều rộng để chống giật bố cục */
}

.recent-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: scale(1.02);
}

.recent-poster {
  width: 55px; height: 75px;
  object-fit: cover;
  border-radius: 10px;
}

.recent-info { display: flex; flex-direction: column; gap: 4px; }
.recent-title { font-size: 14px; font-weight: 700; color: #fff; margin: 0; line-height: 1.3; }
.recent-episode, .recent-date { font-size: 12px; color: #94a3b8; margin: 0; }

/* Scroll Button (Kính mờ, tròn) */
.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 46px; height: 46px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
}
.scroll-btn:hover { background: #22d3ee; color: #0f172a; border-color: #22d3ee; }
.scroll-btn.left { left: 20px; }
.scroll-btn.right { right: 20px; }

/* --- MOVIE GRID (TỐI ƯU RESPONSIVE) --- */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Tự động chia cột mượt hơn */
  gap: 1.5rem;
  padding: 1.5rem 0;
}

/* --- RECOMMENDED TABS (KÍNH MỜ LIGHT) --- */
.filter-tabs { display: flex; gap: 5px; padding: 5px; border-radius: 30px; }
.tab-btn {
  background: transparent; border: none;
  color: #94a3b8; padding: 8px 20px;
  border-radius: 20px; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: 0.3s;
}
.tab-btn.active { background: #22d3ee; color: #0f172a; }
.tab-btn:hover:not(.active) { color: #fff; background: rgba(255,255,255,0.05); }

/* --- ANIMATIONS (GPU ACCELERATED) --- */
/* Drawer Slide */
.drawer-slide-enter-active, .drawer-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.drawer-slide-enter-from, .drawer-slide-leave-to {
  transform: translateX(100%);
}

/* Page Fade */
.page-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-fade-enter-from { opacity: 0; transform: translateY(20px); }

/* Reset mini-loader cho mượt */
.mini-loader {
  border-width: 2px;
  width: 24px; height: 24px;
  color: #22d3ee;
}

/* --- RESPONSIVE --- */
@media (max-width: 1024px) {
  .list-section, .movie-section, .results-section, .recommended-section { padding: 1.5rem; margin: 1.5rem; }
}

@media (max-width: 768px) {
  .movie-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
  .filter-drawer { width: 100%; }
  .list-section, .movie-section, .results-section, .recommended-section { padding: 1rem; margin: 1rem 0; border-radius: 0; }
  .floating-filter-btn { bottom: 20px; right: 20px; padding: 10px 18px; font-size: 14px; }
}
</style>