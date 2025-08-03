import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.patch('/change-password', authMiddleware, authController.changePassword);

export default router;
