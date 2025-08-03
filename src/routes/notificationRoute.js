import express from 'express';

const router = express.Router();
import notificationController from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authmiddleware.js';
import authorize from '../middleware/authorize.js';


// Routes
router.get('/fetch-all', authMiddleware, notificationController.getNotifications);

router.patch('/mark-as-read', authMiddleware, notificationController.markAsRead);

export default router;