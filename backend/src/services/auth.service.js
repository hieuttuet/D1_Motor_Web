import { findUserByUsername } from "../models/user.model.js";
import { comparePassword } from "../utils/hash.js";
import { createToken } from "../utils/jwt.js";

export const loginService = async (username, password) => {
  try {
    const user = await findUserByUsername(username);
  if (!user) return null;

  const isMatch = comparePassword(password,user.password);
  if (!isMatch) return null;
  
  const token = createToken(user);
  return { user, token };

  } catch (err) {
    return res.status(500).json({ message: "Lỗi login" });
  }
};
