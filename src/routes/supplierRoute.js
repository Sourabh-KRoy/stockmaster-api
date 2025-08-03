import express from 'express';
import supplier from '../controllers/supplierController.js';
import authenticateAdmin from '../middleware/authmiddleware.js';
import authorize from '../middleware/authorize.js';
const router = express.Router();

router.get('/list',authenticateAdmin,authorize('admin','operator'), supplier.getAllSuppliers); 
router.post('/add',authenticateAdmin,authorize('admin'), supplier.addSupplier); 

export default router;
