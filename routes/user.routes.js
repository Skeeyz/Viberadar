import express from 'express';
import * as movieController from '../controllers/movie.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// 1. Routes cho Favorites
router.get('/favorites', verifyToken, movieController.getFavorites);
router.post('/user/favorites/toggle', verifyToken, movieController.toggleFavorite);
// 2. Routes cho Watchlist
router.get('/watchlist', verifyToken, movieController.getWatchlist);
router.post('/user/watchlist/toggle', verifyToken, movieController.toggleWatchlist);
//3 . Routes cho Profile
router.post('/user/profile/update', verifyToken, movieController.updateProfileName);

export default router;