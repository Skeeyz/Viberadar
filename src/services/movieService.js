import axios from "axios"

const API_KEY = import.meta.env.VITE_TMDB_KEY
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western"
}

const API = axios.create({
  baseURL: "https://api.themoviedb.org/3"
})

const mapMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  poster: movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image",
  year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : 0,
  rating: movie.vote_average ?? 0,
  description: movie.overview || "No description available.",
  genres: (movie.genre_ids || []).map((id) => GENRE_MAP[id]).filter(Boolean)
})

export const getPopularMovies = async () => {
  const res = await API.get("/movie/popular", {
    params: {
      api_key: API_KEY
    }
  })
  
  return res.data.results.map(mapMovie)
}
export const searchMovies = async (query) => {
  const res = await API.get("/search/movie", {
    params: {
      api_key: API_KEY,
      query
    }
  })

  return res.data.results.map(mapMovie)
}
