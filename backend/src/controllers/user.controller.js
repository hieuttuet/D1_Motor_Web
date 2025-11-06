// src/controllers/user.controller.js
import {
  getAllUsersService,
  createUserService,
  updateUserService,
  deleteUserService
} from "../services/user.service.js";

// 🟢 Lấy danh sách user
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (err) {
    console.error("❌ Error getting users:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟡 Thêm user
export const addUser = async (req, res) => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(400).json({ error: err.message });
  }
};

// 🟠 Cập nhật user
export const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    await updateUserService(user_id, req.body);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(400).json({ error: err.message });
  }
};

// 🔴 Xóa user
export const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    await deleteUserService(user_id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(400).json({ error: err.message });
  }
};
