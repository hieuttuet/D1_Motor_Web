// src/services/user.service.js
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  findUserByUsername
} from "../models/user.model.js";

// 🔹 Lấy danh sách user (có thể thêm filter, tìm kiếm...)
export const getAllUsersService = async () => {
  const users = await getAllUsers();
  return users;
};

// 🔹 Thêm user (kiểm tra trùng tên, mã hóa password,...)
export const createUserService = async (userData) => {
  const { user_name } = userData;

  // Kiểm tra trùng username
  const existingUser = await findUserByUsername(user_name);
  if (existingUser) {
    throw new Error("Username already exists");
  }
  return await createUser(userData);
};

// 🔹 Cập nhật user
export const updateUserService = async (user_id, userData) => {
  const user = await findUserByUsername(userData.user_name);
  if (user && user.user_id !== parseInt(user_id)) {
    throw new Error("Username already in use by another user");
  }

  await updateUser(user_id, userData);
};

// 🔹 Xóa user
export const deleteUserService = async (id) => {
  const user = await findUserByUsername(id);
  if (user?.role === "ADMIN") {
    throw new Error("Cannot delete ADMIN user");
  }
  await deleteUser(id);
};
