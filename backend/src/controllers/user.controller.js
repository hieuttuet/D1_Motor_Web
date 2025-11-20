import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  findUserByUsername,
  findUserById,
} from "../models/user.model.js";
import { ok, error } from "../middlewares/responseHandler.js";

// 🔹 Lấy danh sách user (có thể thêm filter, tìm kiếm...)
export const getUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    return ok(res, users, "Lấy danh sách user thành công");
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};

// 🔹 Thêm user (kiểm tra trùng tên, mã hóa password,...)
export const addUserController = async (req,res) => {
  try { 
    const userData = req.body;
  // Kiểm tra trùng username
  const existingUser = await findUserByUsername(userData.user_name);
  if (existingUser) {
    return error(res, "Username đã tồn tại", 401);
  }
  const newUser = await createUser(userData);
  return ok(res, newUser, "Tạo user thành công");
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};

// 🔹 Cập nhật user
export const updateUserController = async (req,res) => {
  try {
    const user_id = req.params.user_id;
    const userData = req.body;
    const user = await findUserByUsername(userData.user_name);
  if (user && user.user_id !== parseInt(user_id)) {
    return error(res, "Username đã tồn tại", 401);
  }
  const updatedUser = await updateUser(user_id, userData);
  return ok(res, updatedUser, "Cập nhật user thành công");
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};

// 🔹 Xóa user
export const deleteUserController = async (req,res) => {
  try {
    const user_id = req.params.user_id;
    const user = await findUserById(user_id);
  if (!user) {
    return error(res, "User không tồn tại", 401);
  }
  await deleteUser(user_id);
  return ok(res, null, "Xóa user thành công");
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};
