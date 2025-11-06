import { loginService } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { user_name, password } = req.body || {}; // tránh crash
    console.log(user_name, password);
    const result = await loginService(user_name, password);
    if (!result) return res.status(401).json({ message: "Sai username hoặc password" });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};
