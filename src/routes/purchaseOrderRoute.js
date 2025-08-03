import express from 'express';

import purchaseOrderController from '../controllers/purchaseOrderController.js';
import authmiddleware from '../middleware/authmiddleware.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.post('/create-product-order', authmiddleware, authorize('admin'), purchaseOrderController.purchseFromSupplier)
router.post('/receive-product-order', authmiddleware, authorize('admin'), purchaseOrderController.receivePurchaseOrder)

export default router;