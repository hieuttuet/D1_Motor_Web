// routes/user.routes.js
import express from "express";
import { getUsers, addUser, updateUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

// Lấy danh sách user
router.get("/users", getUsers);

// Thêm user
router.post("/users", addUser);

// Cập nhật user
router.put("/users/:user_id", updateUser);

// Xóa user
router.delete("/users/:user_id", deleteUser);

export default router;
