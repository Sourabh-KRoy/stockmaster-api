import express from 'express';

import inventryController from '../controllers/inventryController.js'
import authmiddleware from '../middleware/authmiddleware.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.get('/category-list',authmiddleware,authorize('admin','operator'),inventryController.getCategories)
router.get('/getallproduct-list',authmiddleware,authorize('admin','operator'),inventryController.getAllProducts)

export default router;