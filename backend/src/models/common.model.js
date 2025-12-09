import db from "../config/db.js";

//lay thong tin thời gian trên server
export const getServerTime = async () => {
  const [rows] = await db.query("SELECT NOW() AS server_time");
  return rows; // => { server_time: '2025-11-19 10:20:30' }
};