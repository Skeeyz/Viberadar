import express from 'express';
// Import toàn bộ movieController theo dạng object
import * as movieController from '../controllers/movie.controller.js';
// Import Named Export từ middleware (nhớ dùng ngoặc nhọn)
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// 1. Routes cho Favorites
router.get('/favorites', verifyToken, movieController.getFavorites);
router.post('/user/favorites/toggle', verifyToken, movieController.toggleFavorite);
// 2. Routes cho Watchlist
router.get('/watchlist', verifyToken, movieController.getWatchlist);
router.post('/user/watchlist/toggle', verifyToken, movieController.toggleWatchlist);

export default router;