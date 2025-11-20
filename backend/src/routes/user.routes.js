// routes/user.routes.js
import express from "express";
import { getUsersController, addUserController, updateUserController, deleteUserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Lấy danh sách user
router.get("/users", authMiddleware,getUsersController);

// Thêm user
router.post("/users", authMiddleware, addUserController);

// Cập nhật user
router.put("/users/:user_id", authMiddleware, updateUserController);

// Xóa user
router.delete("/users/:user_id", authMiddleware, deleteUserController);

export default router;
