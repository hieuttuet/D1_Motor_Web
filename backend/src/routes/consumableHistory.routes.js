import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { getConsumableHistoryController as getConsumableHistory,
        downloadConsumableHistoryController as downloadConsumableHistory
 } from "../controllers/consumableHistory.controller.js";

const router = express.Router();
router.get("/consumable-history/lookup", authMiddleware, getConsumableHistory);
router.get("/consumable-history/download", authMiddleware, downloadConsumableHistory);
export default router;
