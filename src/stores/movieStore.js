// stores/movieStore.js
import { defineStore } from 'pinia'
import {
  fetchMovieList,
  fetchMovieDetail,
} from '../services/movieService'

export const useMovieStore = defineStore('movie', {
  state: () => ({
    // Giữ lại movies gốc của bạn
    movies: [],

    // Thêm các section cho Home
    featured:        null,
    newMovies:       [],
    newSeries:       [],
    recommended:     [],
    recentlyUpdated: [],

    // Chi tiết phim
    currentMovie:    null,

    loading: false,
    error:   null,
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
        const [nowPlaying, upcoming, popular] = await Promise.all([
          fetchMovieList('now_playing'),  // New Release - Movies
          fetchMovieList('upcoming'),     // New Release - Series
          fetchMovieList('popular'),      // Recommended + Recently Updated
        ])

        this.newMovies       = nowPlaying.slice(0, 8)
        this.newSeries       = upcoming.slice(0, 8)
        this.recommended     = popular.slice(0, 8)
        this.recentlyUpdated = popular.slice(0, 6).map(m => ({
          ...m,
          episode: 'Movie',
          date:    m.year,
        }))

        // Featured = phim đầu tiên, fetch thêm chi tiết
        if (nowPlaying[0]) {
          this.featured = await fetchMovieDetail(nowPlaying[0].id)
        }

      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
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
  },
})
