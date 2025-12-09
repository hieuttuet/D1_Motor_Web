import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

// ------------------------------------------------------
// 📁 TẠO FOLDER UPLOAD NẾU CHƯA CÓ
// ------------------------------------------------------
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads/machines")
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁 Đã tạo folder:", dir);
  }
});
// ------------------------------------------------------

// Phục vụ các file tĩnh từ React build
app.use(express.static(path.join(__dirname, "../frontend/dist")));
console.log("Dist exists:", fs.existsSync(path.join(__dirname, "../frontend/dist/index.html")));

// Fallback: tất cả request không khớp /api/... sẽ trả về index.html
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next(); // bỏ qua các route API
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
