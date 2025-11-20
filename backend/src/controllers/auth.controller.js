// controllers/auth.controller.js
import { findUserByUsername } from "../models/user.model.js";
import { comparePassword } from "../utils/hash.js";
import { createToken } from "../utils/jwt.js";
import { ok, error } from "../middlewares/responseHandler.js";

export const login = async (req, res) => {
  try {
    const { user_name, password } = req.body || {};

    // Kiểm tra dữ liệu đầu vào
    if (!user_name || !password) {
      return error(res, "Thiếu username hoặc password", 400);
    }

    // Tìm user trong DB
    const user = await findUserByUsername(user_name);
    if (!user) {
      return error(res, "Không tìm thấy thông tin người dùng", 401);
    }

    // So sánh mật khẩu
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return error(res, "Sai mật khẩu", 401);
    }

    // Tạo JWT token
    const token = createToken(user);
    const { password: _, ...userSafe } = user; // loại bỏ password khỏi response

    // Trả về kết quả
    return ok(res, { user: userSafe, token}, "Đăng nhập thành công");

  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};
