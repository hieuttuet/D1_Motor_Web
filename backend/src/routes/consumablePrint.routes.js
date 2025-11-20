import express from 'express';
import { getConsumableByCodeController as getConsumableByCode,
    updateConsumableAndPrintZPLController as printZPLLabel,
    updateZPLLabelPositionController as updateZPLLabelPosition,
    getZPLPositionController as getZPLLabelPosition
 } from '../controllers/consumablePrint.controller.js';
 import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();
router.get('/consumable-label-print/zpl-position/:label_id',authMiddleware, getZPLLabelPosition);
router.get('/consumable-label-print/:consumable_code',authMiddleware, getConsumableByCode);
router.put('/consumable-label-print/:consumable_code', authMiddleware, printZPLLabel);
router.put('/consumable-label-print/zpl-position/:label_id', authMiddleware, updateZPLLabelPosition);
export default router;