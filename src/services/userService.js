import axios from 'axios';

// Khởi tạo instance axios để dùng chung cấu hình
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Tự động đính kèm token vào mọi request gửi đi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const userService = {
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // 2. Lấy danh sách phim yêu thích (đổ vào FavoriteView)
  async getFavorites() {
    try {
      const response = await api.get('/favorites');

      const movies = response.data.movies.map(item => ({
        id: item.id,
        title: item.title,
        poster: item.poster,
        year: item.year,
        rating: item.rating,
        genres: item.genres,
        description: item.description,
        type: item.type,
        addedAt: item.added_at
      }));

      return { movies };
    } catch (error) {
      console.error("Lỗi khi gọi API favorites:", error);
      throw error;
    }
  },

  async toggleFavorite({ tmdbId, mediaType }) {
    const response = await api.post('/user/favorites/toggle', { tmdb_id: tmdbId , media_type: mediaType});
    return response.data;
  },

  // 5. Quản lý Watchlist (Tương tự Favorites)

  async getWatchlist() {
    try {
      const response = await api.get('/watchlist');

      const movies = response.data.movies.map(item => ({
        id: item.id,
        title: item.title,
        poster: item.poster,
        year: item.year,
        rating: item.rating,
        genres: item.genres,
        description: item.description,
        type: item.type,
        addedAt: item.added_at
      }));

      return { movies };
    } catch (error) {
      console.error("Lỗi khi gọi API watchlist:", error);
      throw error;
    }
  },

  async toggleWatchlist({ tmdbId, mediaType }) {
    const response = await api.post('/user/watchlist/toggle', { tmdb_id: tmdbId , media_type: mediaType });
    return response.data;
  },

  async updateProfileName(newUserName){
    const response = await api.post('/user/profile/update', {newUserName : newUserName});
    return response;
  },

  async changePassword({password, newPassword}){
    const response = await api.post('/auth/user/profile/change-password', {password : password, newPassword: newPassword});
    return response;
  },

};