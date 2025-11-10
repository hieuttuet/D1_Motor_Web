import express from 'express';
import {
  createConsumableSpecController as createConsumableSpec,
  getAllConsumableSpecsController as getAllConsumableSpecs,
  updateConsumableSpecController as updateConsumableSpec,
  deleteConsumableSpecController as deleteConsumableSpec
} from '../controllers/consumableSpecs.controller.js';

const router = express.Router();

router.get('/consumable-specs', getAllConsumableSpecs);
router.post('/consumable-specs', createConsumableSpec);
router.put('/consumable-specs/:consumable_spec_id', updateConsumableSpec);
router.delete('/consumable-specs/:consumable_spec_id', deleteConsumableSpec);

export default router;