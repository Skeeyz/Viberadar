import axios from "axios"

const API_KEY = import.meta.env.VITE_TMDB_KEY
const IMAGE_BASE_URL1 = "https://image.tmdb.org/t/p/w500"

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
    ? `${IMAGE_BASE_URL1}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image",
  year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : 0,
  rating: movie.vote_average ?? 0,
  description: movie.overview || "No description available.",
  genres: (movie.genre_ids || []).map((id) => GENRE_MAP[id]).filter(Boolean)
})

// export const getPopularMovies = async () => {
//   const res = await API.get("/movie/popular", {
//     params: {
//       api_key: API_KEY
//     }
//   })
  
//   return res.data.results.map(mapMovie)
// }
// export const searchMovies = async (query) => {
//   const res = await API.get("/search/movie", {
//     params: {
//       api_key: API_KEY,
//       query
//     }
//   })

//   return res.data.results.map(mapMovie)
// }
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// ── Image size helpers ──────────────────────────────────────────
export const tmdbImage = {
  poster:   (path, size = 'w300')      => path ? `${IMAGE_BASE_URL}/${size}${path}` : null,
  backdrop: (path, size = 'original')  => path ? `${IMAGE_BASE_URL}/${size}${path}` : null,
  avatar:   (path, size = 'w185')      => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${IMAGE_BASE_URL}/${size}${path}`
  },
}

// ── Base fetch ─────────────────────────────────────────────────
async function tmdbFetch(endpoint, params = {}) {
  if (params.page) params.page = Math.min(Number(params.page), 500)
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${res.statusText}`)
  return res.json()
}

// ── Movie APIs ─────────────────────────────────────────────────

// Giữ nguyên hàm gốc (dùng axios - giữ để không phá code cũ)
export const getPopularMovies = () => {
  return axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
}

// Lấy danh sách phim theo type: 'popular' | 'now_playing' | 'upcoming' | 'top_rated'
export async function fetchMovieList(type = 'popular', page = 1) {
  const data = await tmdbFetch(`/movie/${type}`, { page })
  return {
    movies:     data.results.map(mapMovie),
    totalPages: data.total_pages,           // ✅ consistent shape
  }
}

// Lấy danh sách phim theo type, trả về cả total_pages để phân trang
export async function fetchMovieListPaged(type = 'popular', page = 1) {
  const data = await tmdbFetch(`/movie/${type}`, { page })
  return {
    movies:      data.results.map(mapMovie),
    totalPages:   Math.min(data.total_pages, 500),
    totalResults: data.total_results,
    currentPage: data.page,
  }
}

// Lấy chi tiết 1 phim kèm credits + videos, tuỳ chọn reviews
export async function fetchMovieDetail(movieId, includeReviews = false) {
  const promises = [
    tmdbFetch(`/movie/${movieId}`),
    tmdbFetch(`/movie/${movieId}/credits`),
    tmdbFetch(`/movie/${movieId}/videos`),
  ]
  if (includeReviews) {
    promises.push(tmdbFetch(`/movie/${movieId}/reviews`))
  }

  const [detail, credits, videosData, reviewsData] = await Promise.all(promises)
  const movie = normalizeMovieDetail(detail, credits)

  movie.trailer = getBestTrailer(videosData.results)

  if (includeReviews && reviewsData) {
    movie.reviews      = reviewsData.results.map(normalizeReview)
    movie.reviewsTotal = reviewsData.total_results
  }

  return movie
}

// Lấy tất cả video của phim (trailer, teaser, clip...)
export async function fetchMovieVideos(movieId) {
  const data = await tmdbFetch(`/movie/${movieId}/videos`)
  return data.results.map(normalizeVideo)
}

// Lấy danh sách phim tương tự
export async function fetchSimilarMovies(movieId, page = 1) {
  const data = await tmdbFetch(`/movie/${movieId}/similar`, { page })
  return data.results.map(mapMovie)
}

// Lấy phim được đề xuất dựa theo movieId
export async function fetchRecommendedMovies(movieId, page = 1) {
  const data = await tmdbFetch(`/movie/${movieId}/recommendations`, { page })
  return data.results.map(mapMovie)
}

// Tìm kiếm phim theo từ khoá
export async function searchMovies(query, page = 1) {
  const data = await tmdbFetch('/search/movie', { query, page })
  return {
    results:     data.results.map(mapMovie),
    total_pages: data.total_pages,
    total_results: data.total_results,
  }
}

export async function fetchAllMovies(page = 1) {
  return fetchMovieListPaged('popular', page)
}

// Lấy reviews của phim (phân trang)
export async function fetchMovieReviews(movieId, page = 1) {
  const data = await tmdbFetch(`/movie/${movieId}/reviews`, { page })
  return {
    reviews:      data.results.map(normalizeReview),
    totalPages:   data.total_pages,
    totalResults: data.total_results,
  }
}

// Lấy danh sách thể loại phim
export async function fetchGenres() {
  const data = await tmdbFetch('/genre/movie/list')
  return data.genres  // [{ id, name }]
}

// Lấy phim theo thể loại
export async function fetchMoviesByGenre(genreId, page = 1) {
  const data = await tmdbFetch('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page,
  })
  return data.results.map(mapMovie)
}

// ── Normalizers ────────────────────────────────────────────────

function normalizeMovie(movie) {
  return {
    id:       movie.id,
    title:    movie.title,
    poster:   tmdbImage.poster(movie.poster_path),
    backdrop: tmdbImage.backdrop(movie.backdrop_path),
    year:     movie.release_date?.slice(0, 4) ?? '—',
    score:    movie.vote_average?.toFixed(1),
    votes:    formatVotes(movie.vote_count),
    genres:   movie.genre_ids ?? [],
    overview: movie.overview,
    type:     'movie',
  }
}

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
        .map(c => ({ role: CREW_LABEL[c.job] ?? c.job.toUpperCase(), name: c.name })),
    ].filter(Boolean),
  }
}

function normalizeVideo(video) {
  return {
    id:        video.id,
    name:      video.name,
    key:       video.key,
    type:      video.type,       // Trailer | Teaser | Clip | Featurette
    site:      video.site,       // YouTube | Vimeo
    official:  video.official,
    embedUrl:  `https://www.youtube.com/embed/${video.key}`,
    watchUrl:  `https://www.youtube.com/watch?v=${video.key}`,
    thumbnail: `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`,
  }
}

function normalizeReview(review) {
  return {
    id:             review.id,
    author:         review.author,
    authorAvatar:   tmdbImage.avatar(review.author_details?.avatar_path),
    authorUsername: review.author_details?.username,
    rating:         review.author_details?.rating
                      ? (review.author_details.rating * 10).toFixed(0)
                      : null,
    content:        review.content,
    date:           review.created_at
                      ? new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })
                      : '—',
    url: review.url,
  }
}

// ── Private helpers ────────────────────────────────────────────

function getBestTrailer(videos = []) {
  const ytTrailers = videos.filter(v => v.type === 'Trailer' && v.site === 'YouTube')
  return ytTrailers.find(v => v.official) ?? ytTrailers[0] ?? null
}

const CREW_LABEL = {
  'Director of Photography': 'CINEMATOGRAPHY',
  'Original Music Composer': 'MUSIC',
  'Editor':                  'EDITOR',
  'Producer':                'PRODUCER',
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

// Tìm kiếm TV Show
export async function searchTVShows(query, page = 1) {
  const data = await tmdbFetch('/search/tv', { query, page })
  return {
    results:     data.results.map(normalizeTVShow),
    total_pages: data.total_pages,
  }
}

// Normalize TV Show (khác Movie ở chỗ dùng name thay vì title)
function normalizeTVShow(item) {
  return {
    id:       item.id,
    title:    item.name,
    year:     item.first_air_date?.slice(0, 4) ?? '',
    poster:   tmdbImage.poster(item.poster_path),
    backdrop: tmdbImage.backdrop(item.backdrop_path),
    score:    item.vote_average?.toFixed(1) ?? 'N/A',
    votes:    item.vote_count,
    genres:   item.genre_ids ?? [],
    overview: item.overview,
    type:     'tv',
  }
}
export async function fetchTVShowDetail(id) {
  const data = await tmdbFetch(`/tv/${id}`, {
    append_to_response: 'credits,videos',
  })

  return {
    id:           data.id,
    title:        data.name,
    overview:     data.overview,
    year:         data.first_air_date?.slice(0, 4) ?? '',
    poster:       data.poster_path
                    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                    : null,
    backdrop:     data.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
                    : null,
    score:        data.vote_average?.toFixed(1) ?? 'N/A',
    votes:        data.vote_count,
    duration:     `${data.number_of_seasons} Season${data.number_of_seasons > 1 ? 's' : ''}`,
    rating_label: data.adult ? 'TV-MA' : 'TV-PG',
    genres:       data.genres?.map(g => g.name) ?? [],
    cast:         data.credits?.cast?.slice(0, 10).map(c => ({
                    name:      c.name,
                    character: c.character,
                    avatar:    c.profile_path
                                 ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                                 : null,
                  })) ?? [],
    type: 'tv',
  }
}

export async function fetchFilteredMovies(params) {
  const type = params.type || 'movie'
  const query = new URLSearchParams({ api_key: API_KEY, language: 'en-US' })

  if (params.with_genres)           query.set('with_genres', params.with_genres)
  if (params.with_origin_country)   query.set('with_origin_country', params.with_origin_country)
  if (params.primary_release_year)  query.set('primary_release_year', params.primary_release_year)
  if (params.sort_by)               query.set('sort_by', params.sort_by)
  if (params['vote_average.gte'])   query.set('vote_average.gte', params['vote_average.gte'])

  const res = await fetch(`${BASE_URL}/discover/${type}?${query}`)
  const data = await res.json()

  return (data.results || []).map(m => ({
    id:       m.id,
    title:    m.title || m.name,
    poster:   m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
    backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : null,
    year:     (m.release_date || m.first_air_date || '').slice(0, 4),
    score:    m.vote_average?.toFixed(1),
    votes:    m.vote_count,
    genres:   m.genre_ids ?? [],
    type,
  }))
}

export async function fetchTVList(type = 'popular', page = 1) {
  const data = await tmdbFetch(`/tv/${type}`, { page })
  return {
    movies:     data.results.map(normalizeTVShow),  // ✅
    totalPages: data.total_pages,
  }
}
// Thêm vào movieService.js
export async function fetchTVListPaged(type = 'popular', page = 1) {
  const data = await tmdbFetch(`/tv/${type}`, { page })
  return {
    movies:      data.results.map(normalizeTVShow),
    totalPages:   Math.min(data.total_pages, 500),
    totalResults: data.total_results,
    currentPage: data.page,
  }
}
