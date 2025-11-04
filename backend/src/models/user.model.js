// Giả sử bạn đã có bảng "users" trong DB
// CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255));

import db from "../config/db.js";

export const findUserByUsername = async (username) => {
  console.log('Finding user by username:', username);
  const rows = await db.query("SELECT * FROM users WHERE user_name = ?", [username]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};