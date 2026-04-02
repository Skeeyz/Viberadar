import db from '../config/db.js'; // Đảm bảo file db.js sử dụng 'export default'
import axios from 'axios';

const TMDB_API_KEY = process.env.VITE_TMDB_KEY; // Thay bằng Key của bạn
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// 1. Lấy danh sách Favorite của User hiện tại
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ verifyToken middleware

    // 1. Truy vấn danh sách ID từ MySQL
    const [rows] = await db.execute(
      'SELECT tmdb_id, media_type, added_at FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(200).json({ movies: [] });
    }

    // 2. Dùng Promise.all để gọi song song API TMDB cho từng ID
    const movieDetails = await Promise.all(
      rows.map(async (row) => {
        try {
          const type = row.media_type || 'movie';
          const response = await axios.get(`${TMDB_BASE_URL}/${type}/${row.tmdb_id}`, {
            params: {
              api_key: TMDB_API_KEY,
              language: 'en-US' // Lấy thông tin tiếng Việt nếu có vi-VN
            }
          });

          const data = response.data;

          // Trả về dựa vào interface của MovieCard.vue 
          return {
            id: data.id,
            title: data.title || data.name,
            poster: data.poster_path 
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}` 
              : 'https://placehold.co/500x750?text=No+Poster',
            year: new Date(data.release_date || data.first_air_date || Date.now()).getFullYear(),
            rating: data.vote_average,
            description: data.overview,
            genres: data.genres ? data.genres.map(g => g.name) : [],
            type: type,
            added_at: row.added_at
          };
        } catch (error) {
          console.error(`Lỗi lấy phim ID ${row.tmdb_id}:`, error.message);
          return null; 
        }
      })
    );

    // 3. Lọc bỏ các phim bị lỗi (null)
    const finalMovies = movieDetails.filter(m => m !== null);
    
    res.status(200).json({ movies: finalMovies });

  } catch (error) {
    console.error("Lỗi Controller:", error);
    res.status(500).json({ message: "Lỗi Server khi lấy dữ liệu TMDB" });
  }
};

// 2. Thêm hoặc Xóa khỏi Favorite
export const toggleFavorite = async (req, res) => {
  const { tmdb_id, media_type } = req.body;
  const userId = req.user.id;

  try {
    const [existing] = await db.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND tmdb_id = ?',
      [userId, tmdb_id]
    );

    if (existing.length > 0) {
      await db.execute(
        'DELETE FROM favorites WHERE user_id = ? AND tmdb_id = ?', 
        [userId, tmdb_id]
      );
      return res.json({ message: "Đã xóa khỏi yêu thích", status: 'removed' });
    } else {
      await db.execute(
        'INSERT INTO favorites (user_id, tmdb_id, media_type) VALUES (?, ?, ?)',
        [userId, tmdb_id, media_type || 'movie']
      );
      return res.json({ message: "Đã thêm vào yêu thích", status: 'added' });
    }
  } catch (error) {
    console.error("Lỗi toggleFavorite:", error);
    res.status(500).json({ message: "Lỗi xử lý yêu thích" });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ verifyToken middleware

    // 1. Truy vấn danh sách ID từ MySQL
    const [rows] = await db.execute(
      'SELECT tmdb_id, media_type, added_at FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(200).json({ movies: [] });
    }

    // 2. Dùng Promise.all để gọi song song API TMDB cho từng ID
    const movieDetails = await Promise.all(
      rows.map(async (row) => {
        try {
          const type = row.media_type || 'movie';
          const response = await axios.get(`${TMDB_BASE_URL}/${type}/${row.tmdb_id}`, {
            params: {
              api_key: TMDB_API_KEY,
              language: 'en-US' // Lấy thông tin tiếng Việt nếu có vi-VN
            }
          });

          const data = response.data;

          // Trả về dựa vào interface của MovieCard.vue 
          return {
            id: data.id,
            title: data.title || data.name,
            poster: data.poster_path 
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}` 
              : 'https://placehold.co/500x750?text=No+Poster',
            year: new Date(data.release_date || data.first_air_date || Date.now()).getFullYear(),
            rating: data.vote_average,
            description: data.overview,
            genres: data.genres ? data.genres.map(g => g.name) : [],
            type: type,
            added_at: row.added_at
          };
        } catch (error) {
          console.error(`Lỗi lấy phim ID ${row.tmdb_id}:`, error.message);
          return null; 
        }
      })
    );

    // 3. Lọc bỏ các phim bị lỗi (null)
    const finalMovies = movieDetails.filter(m => m !== null);
    
    res.status(200).json({ movies: finalMovies });

  } catch (error) {
    console.error("Lỗi Controller:", error);
    res.status(500).json({ message: "Lỗi Server khi lấy dữ liệu TMDB" });
  }
};

// 2. Thêm hoặc Xóa khỏi WatchList
export const toggleWatchlist = async (req, res) => {
  const { tmdb_id, media_type } = req.body;
  const userId = req.user.id;

  try {
    const [existing] = await db.execute(
      'SELECT id FROM watchlist WHERE user_id = ? AND tmdb_id = ?',
      [userId, tmdb_id]
    );

    if (existing.length > 0) {
      await db.execute(
        'DELETE FROM watchlist WHERE user_id = ? AND tmdb_id = ?', 
        [userId, tmdb_id]
      );
      return res.json({ message: "Đã xóa khỏi danh sách theo dõi", status: 'removed' });
    } else {
      await db.execute(
        'INSERT INTO watchlist (user_id, tmdb_id, media_type) VALUES (?, ?, ?)',
        [userId, tmdb_id, media_type || 'movie']
      );
      return res.json({ message: "Đã thêm vào danh sách theo dõi", status: 'added' });
    }
  } catch (error) {
    console.error("Lỗi toggleWatchList:", error);
    res.status(500).json({ message: "Lỗi xử lý danh sách theo dõi" });
  }
};

export const updateProfileName = async (req, res) => {
  const {newUserName} = req.body;
  const userId = req.user.id;

  try {
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (existing.length > 0) {
      await db.execute(
        'UPDATE users SET name = ? WHERE id = ?', 
        [newUserName, userId]
      );
      return res.json({ message: "Đã cập nhật tên người dùng", status: 'updated' });
    } else {
      return res.json({ message: "Tài khoản không tồn tại trong hệ thống", status: 'updated' });
    }
  } catch (error) {
    console.error("Lỗi updateProfileName:", error);
    res.status(500).json({ message: "Lỗi xử lý cập nhật hồ sơ người dùng" });
  }
};