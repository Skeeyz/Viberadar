import axios from "axios"

const API = axios.create({
  baseURL: "https://api.themoviedb.org/3"
})

export const getPopularMovies = () => {
  return API.get("/movie/popular")
}