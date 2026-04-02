const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Middleware kiểm tra Token

// GET: Lấy danh sách phim yêu thích
// router.get('/favorites', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id; // Lấy từ Token đã giải mã qua middleware
    
//     // Giả sử bạn dùng Sequelize hoặc Knex để query DB
//     const favorites = await db('favorites')
//       .join('movies', 'favorites.movie_id', '=', 'movies.id')
//       .where('favorites.user_id', userId);

//     res.json({ movies: favorites });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server rồi!" });
//   }
// });

// // DELETE: Xóa khỏi danh sách (Nút X trên giao diện)
// router.delete('/favorites/:movieId', authMiddleware, async (req, res) => {
//   try {
//     const { movieId } = req.params;
//     const userId = req.user.id;

//     await db('favorites').where({ user_id: userId, movie_id: movieId }).del();
    
//     res.json({ message: "Đã xóa khỏi yêu thích!" });
//   } catch (error) {
//     res.status(500).json({ message: "Xóa thất bại!" });
//   }
// });

module.exports = router;