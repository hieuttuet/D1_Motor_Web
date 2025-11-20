import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createToken = (user) => {
  const expiresIn = "1d";  // sau 2h thi token hết hạn

  // Tạo token trước
  const token = jwt.sign(
    { user_id: user.user_id, user_name: user.user_name },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  // Decode để lấy "exp"
  const { exp } = jwt.decode(token);

  return {
    token,
    expires_at: new Date(exp * 1000).toISOString()
  };
};

