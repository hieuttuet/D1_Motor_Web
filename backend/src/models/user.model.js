import db from "../config/db.js";

//login
export const findUserByUsername = async (username) => {
  const rows = await db.query("SELECT * FROM users WHERE user_name = ?", [username]);
  return rows[0];
};
export const findUserById = async (user_id) => {
  const rows = await db.query("SELECT * FROM users WHERE user_id = ?", [user_id]);
  return rows[0];
}
// Admin - User Management
export const getAllUsers = async () => {
  const rows = await db.query("SELECT user_id, user_name, password, full_name, role FROM users");
  return rows;
};
export const createUser = async (userData) => {
  const { user_name, password, full_name, role } = userData;
  const result = await db.query("INSERT INTO users (user_name, password, full_name, role) VALUES (?, ?, ?,?)", [user_name, password, full_name,role]);
  return result;
};

export const updateUser = async (user_id, userData) => {
  const { user_name, password, role,full_name } = userData;
  await db.query("UPDATE users SET user_name = ?, password = ?, role = ?, full_name = ? WHERE user_id = ?", [user_name, password, role, full_name, user_id]);
};
export const deleteUser = async (user_id) => {
  await db.query("DELETE FROM users WHERE user_id = ?", [user_id]);
};