import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.post('/facebook-login', authController.facebookLogin);
router.post('/google-login', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', verifyToken, authController.getProfile);
router.post('/user/profile/change-password', verifyToken, authController.changePassword);


export default router;