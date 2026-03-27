import axios from "axios"

export const getPopularMovies = () => {
  return API.get("/movie/popular")
}

// ── Image size helpers ──────
export const tmdbImage = {
  poster: (path, size = 'w300') => path ? `${IMAGE_BASE_URL}/${size}${path}` : null,
  backdrop: (path, size = 'original') => path ? `${IMAGE_BASE_URL}/${size}${path}` : null,
  avatar: (path, size = 'w185') => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },
};


const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'


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

export async function fetchMovieList(type = 'popular', page = 1) {
  const data = await tmdbFetch(`/movie/${type}`, { page })
  return data.results.map(normalizeMovie)
}

export async function fetchMovieDetail(movieId, includeReviews = false) {
  const promises = [
    tmdbFetch(`/movie/${movieId}`),
    tmdbFetch(`/movie/${movieId}/credits`),
    tmdbFetch(`/movie/${movieId}/videos`),   // ← thêm vào đây
  ];
  if (includeReviews) {
    promises.push(tmdbFetch(`/movie/${movieId}/reviews`));
  }

  const [detail, credits, videosData, reviewsData] = await Promise.all(promises);
  const movie = normalizeMovieDetail(detail, credits);

  // Gắn trailer vào movie detail
  movie.trailer = getBestTrailer(videosData.results);

  if (includeReviews && reviewsData) {
    movie.reviews = reviewsData.results.map(normalizeReview);
    movie.reviewsTotal = reviewsData.total_results;
  }

  return movie;
}

/**
 * Lấy danh sách tất cả video của phim (trailer, teaser, clip...)
 */
export async function fetchMovieVideos(movieId) {
  const data = await tmdbFetch(`/movie/${movieId}/videos`)
  return data.results.map(normalizeVideo)
}

export async function searchMovies(query, page = 1) {
  const data = await tmdbFetch('/search/movie', { query, page })
  return data.results.map(normalizeMovie)
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
        .map(c => ({
          role: CREW_LABEL[c.job] ?? c.job.toUpperCase(),
          name: c.name,
        })),
    ].filter(Boolean),
  }
}

/**
 * Chuẩn hoá 1 video từ TMDB
 */
function normalizeVideo(video) {
  return {
    id:         video.id,
    name:       video.name,
    key:        video.key,                                          // YouTube video ID
    type:       video.type,                                         // Trailer | Teaser | Clip | Featurette
    site:       video.site,                                         // YouTube | Vimeo
    official:   video.official,
    embedUrl:   `https://www.youtube.com/embed/${video.key}`,
    watchUrl:   `https://www.youtube.com/watch?v=${video.key}`,
    thumbnail:  `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`,
  }
}

/**
 * Chọn trailer tốt nhất: ưu tiên official Trailer trên YouTube
 */
function getBestTrailer(videos = []) {
  const ytTrailers = videos.filter(v => v.type === 'Trailer' && v.site === 'YouTube')
  return ytTrailers.find(v => v.official) ?? ytTrailers[0] ?? null
}

// ── Utils ──────────────────────────────────────────────────────
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
    url:            review.url,
  }
}

export async function fetchMovieReviews(movieId, page = 1) {
  const data = await tmdbFetch(`/movie/${movieId}/reviews`, { page });
  return {
    reviews:      data.results.map(normalizeReview),
    totalPages:   data.total_pages,
    totalResults: data.total_results,
  };
}