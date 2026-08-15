import { Router } from 'express';
import { healthController } from '../controllers/index.js';

const router = Router();

router.get('/', healthController.getHealth);

export default router;
