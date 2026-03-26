import axios from "axios"

export const getPopularMovies = () => {
  return API.get("/movie/popular")
}

// services/tmdbService.js

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// ── Image size helpers ──────────────────────────────────────────
export const tmdbImage = {
  poster: (path, size = 'w300')      => path ? `${IMAGE_BASE_URL}/${size}${path}` : null,
  backdrop: (path, size = 'original') => path ? `${IMAGE_BASE_URL}/${size}${path}` : null,
  avatar: (path, size = 'w185')      => path ? `${IMAGE_BASE_URL}/${size}${path}` : null,
}

// ── Base fetch ─────────────────────────────────────────────────
async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${res.statusText}`)
  return res.json()
}

// ── Movie APIs ─────────────────────────────────────────────────

/**
 * Lấy danh sách phim đang chiếu / phổ biến / top rated
 * type: 'now_playing' | 'popular' | 'top_rated' | 'upcoming'
 */
export async function fetchMovieList(type = 'popular', page = 1) {
  const data = await tmdbFetch(`/movie/${type}`, { page })
  return data.results.map(normalizeMovie)
}

/**
 * Lấy chi tiết 1 phim theo ID
 */
export async function fetchMovieDetail(movieId) {
  const [detail, credits] = await Promise.all([
    tmdbFetch(`/movie/${movieId}`),
    tmdbFetch(`/movie/${movieId}/credits`),
  ])
  return normalizeMovieDetail(detail, credits)
}

/**
 * Tìm kiếm phim theo tên
 */
export async function searchMovies(query, page = 1) {
  const data = await tmdbFetch('/search/movie', { query, page })
  return data.results.map(normalizeMovie)
}

// ── Normalizers ────────────────────────────────────────────────

/**
 * Chuẩn hoá dữ liệu cho MovieCard (danh sách)
 */
function normalizeMovie(movie) {
  return {
    id:          movie.id,
    title:       movie.title,
    poster:      tmdbImage.poster(movie.poster_path),
    backdrop:    tmdbImage.backdrop(movie.backdrop_path),
    year:        movie.release_date?.slice(0, 4) ?? '—',
    score:       movie.vote_average?.toFixed(1),
    votes:       formatVotes(movie.vote_count),
    genres:      movie.genre_ids ?? [],
    overview:    movie.overview,
  }
}

/**
 * Chuẩn hoá dữ liệu cho MovieDetail (trang chi tiết)
 */
function normalizeMovieDetail(movie, credits) {
  const director = credits.crew.find(c => c.job === 'Director')
  const writers  = credits.crew.filter(c => ['Screenplay', 'Writer', 'Story'].includes(c.job))

  return {
    id:           movie.id,
    title:        movie.title,
    backdrop:     tmdbImage.backdrop(movie.backdrop_path),
    poster:       tmdbImage.poster(movie.poster_path, 'w342'),
    rating_label: movie.adult ? 'R' : 'PG-13',
    year:         movie.release_date?.slice(0, 4) ?? '—',
    duration:     formatRuntime(movie.runtime),
    score:        movie.vote_average?.toFixed(1),
    votes:        formatVotes(movie.vote_count),
    genres:       movie.genres.map(g => g.name),
    synopsis:     movie.overview,
    director:     director?.name ?? '—',
    writers:      writers.map(w => w.name).join(', ') || '—',
    release_date: formatDate(movie.release_date),
    box_office:   movie.revenue ? `$${(movie.revenue / 1e6).toFixed(1)}M` : '—',
    cast: credits.cast.slice(0, 10).map(actor => ({
      name:  actor.name,
      role:  actor.character,
      photo: tmdbImage.avatar(actor.profile_path),
      size:  '120×120',
    })),
    crew: [
      director && { role: 'DIRECTOR', name: director.name },
      ...writers.map(w => ({ role: w.job.toUpperCase(), name: w.name })),
      ...credits.crew
        .filter(c => ['Director of Photography', 'Original Music Composer', 'Editor', 'Producer'].includes(c.job))
        .map(c => ({
          role: CREW_LABEL[c.job] ?? c.job.toUpperCase(),
          name: c.name,
        })),
    ].filter(Boolean),
  }
}

// ── Utils ──────────────────────────────────────────────────────
const CREW_LABEL = {
  'Director of Photography':      'CINEMATOGRAPHY',
  'Original Music Composer':      'MUSIC',
  'Editor':                       'EDITOR',
  'Producer':                     'PRODUCER',
}

function formatRuntime(minutes) {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

function formatVotes(count) {
  if (!count) return '0'
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return String(count)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}