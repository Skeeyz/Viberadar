// stores/movieStore.js
import { defineStore } from 'pinia'
import {
  fetchMovieList,
  fetchMovieDetail,
  fetchFilteredMovies,
  fetchTVList,  
  fetchTVListPaged, 
  fetchMovieListPaged,
} from '../services/movieService'

export const useMovieStore = defineStore('movie', {
  state: () => ({
    // Giữ lại movies gốc của bạn
    movies: [],

    // Thêm các section cho Home
    featured:        null,
    newMovies:       [],
    upcomingMovie:       [],
    recommended:     [],   // movies
    recommendedTV:   [],   // TV shows
    recentlyUpdated: [],

    // Chi tiết phim
    currentMovie:    null,

    filteredMovies: [],
    filterLoading: false,

    loading: false,
    error:   null,

    newMoviesPage:      1,  newMoviesTotalPages:    1,
    upcomingPage:       1,  upcomingTotalPages:     1,
    recommendedPage:    1,  recommendedTotalPages:  1,
    recommendedTVPage:  1,  recommendedTVTotalPages:1,
  }),

  actions: {
    // Giữ lại action gốc của bạn
    setMovies(data) {
      this.movies = data
    },

    // Fetch toàn bộ data cho trang Home
    async fetchHome() {
      this.loading = true
      this.error   = null
      try {
        const [nowPlaying, upcoming, popular, popularTV] = await Promise.all([
          fetchMovieList('now_playing', 1),  // New Release - Movies
          fetchMovieList('upcoming', 1),     // Upcomming - Movies
          fetchMovieList('popular', 1),    
          fetchTVList('popular', 1),    
        ])

      this.newMovies            = nowPlaying.movies.slice(0, 8)
      this.newMoviesTotalPages  = nowPlaying.totalPages

      this.upcomingMovie        = upcoming.movies.slice(0, 8)
      this.upcomingTotalPages   = upcoming.totalPages

      this.recommended          = popular.movies.slice(0, 8)
      this.recommendedTotalPages= popular.totalPages

      this.recommendedTV            = popularTV.movies.slice(0, 8)   // ✅ no more Array.isArray guard
      this.recommendedTVTotalPages  = popularTV.totalPages
      this.recommendedTVTotalPages = 500 // TMDB thường có ~500 pages

      this.recentlyUpdated = popular.movies.slice(0, 15).map(m => ({
        ...m, episode: 'Movie', date: m.year,
      }))

      if (nowPlaying.movies[0]) {
        this.featured = await fetchMovieDetail(nowPlaying.movies[0].id)
      }
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
  }},
    async changePage(section, page) {
  // section: 'new' | 'upcoming' | 'recommended' | 'recommendedTV'
      const map = {
        new:           { type: 'movie', listType: 'now_playing', stateKey: 'newMovies',    pageKey: 'newMoviesPage', isTV: false     },
        upcoming:      { type: 'movie', listType: 'upcoming',    stateKey: 'upcomingMovie', pageKey: 'upcomingPage', isTV: false      },
        recommended:   { type: 'movie', listType: 'popular',     stateKey: 'recommended',   pageKey: 'recommendedPage', isTV: false   },
        recommendedTV: { type: 'tv',    listType: 'popular',     stateKey: 'recommendedTV', pageKey: 'recommendedTVPage', isTV: true },
      }
      const cfg = map[section]
      if (!cfg) return

      try {
    const data = cfg.isTV
      ? await fetchTVListPaged(cfg.listType, page)
      : await fetchMovieListPaged(cfg.listType, page)

      this[cfg.stateKey] = data.movies.slice(0, 5)
      this[cfg.pageKey]  = page

      // Cập nhật totalPages nếu cần
      if (section === 'recommendedTV') this.recommendedTVTotalPages = data.totalPages

    } catch (err) {
      console.error(err)
    }
},

    // Fetch chi tiết 1 phim (dùng cho trang MovieDetail)
    async fetchMovieDetail(id) {
      this.loading = true
      this.error   = null
      try {
        this.currentMovie = await fetchMovieDetail(id, true)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async fetchFiltered(params) {
      this.filterLoading = true
      try {
        this.filteredMovies = await fetchFilteredMovies(params)
      } finally {
        this.filterLoading = false
      }
},
    resetFiltered() {
      this.filteredMovies = []
      this.filterLoading = false
    },
  },
})
