import express from 'express'
import healthCheckContoller from '../controllers/healthCheckController.js'

const router = express.Router();

router.get('/', healthCheckContoller.healthcheck);

export default router