import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ message: "Không có token, vui lòng đăng nhập" });

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    req.user = decoded; // gắn thông tin user vào request
    next();
  });
};
