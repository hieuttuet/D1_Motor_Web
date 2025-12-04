import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { getConsumableSpecByIdController as getConsumableSpecById,
    updateConsumableInfoController as updateConsumableInfo
 } from "../controllers/consumableMove.controller.js";

const router = express.Router();
router.get("/consumable-move/:consumable_id", authMiddleware, getConsumableSpecById);
router.put("/consumable-move/:consumable_id", authMiddleware, updateConsumableInfo);
export default router;