import express from 'express';
import {
  createConsumableSpecController as createConsumableSpec,
  getAllConsumableSpecsController as getAllConsumableSpecs,
  updateConsumableSpecController as updateConsumableSpec,
  deleteConsumableSpecController as deleteConsumableSpec
} from '../controllers/consumableSpecs.controller.js';
 import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get('/consumable-specs', authMiddleware, getAllConsumableSpecs);
router.post('/consumable-specs', authMiddleware, createConsumableSpec);
router.put('/consumable-specs/:consumable_spec_id', authMiddleware, updateConsumableSpec);
router.delete('/consumable-specs/:consumable_spec_id', authMiddleware, deleteConsumableSpec);

export default router;