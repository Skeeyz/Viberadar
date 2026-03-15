import { defineStore } from 'pinia'

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: [],
  }),
  actions: {
    setMovies(data) {
      this.movies = data
    },
  },
})
