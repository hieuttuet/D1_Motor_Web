import db from "../config/db.js";

// lấy thông tin consumable theo consumable id
export const getConsumableSpecById = async (consumable_id) => {      
   const [rows] = await db.query("SELECT * FROM consumables WHERE consumable_id = ?", [consumable_id]);
   return rows;
}
// update thong tin consumable và insert consumable history
// update consumable và insert vào history tự động
export const updateConsumableInfo = async (payload) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1️⃣ Lấy thông tin consumable hiện tại
    const [rows] = await connection.query(
      `SELECT * FROM consumables WHERE consumable_id = ?`,
      [payload.consumable_id]
    );

    if (rows.length === 0) {
      throw new Error("Consumable không tồn tại");
    }

    const consumable = rows;

    // 2️⃣ Update event_id và event_user
    await connection.query(
      `UPDATE consumables 
       SET event_id = ?, event_time = ?, event_user = ?
       WHERE consumable_id = ?`,
      [payload.event_id, payload.event_time, payload.event_user, payload.consumable_id]
    );

    // 3️⃣ Insert vào consumable_history
    await connection.query(
      `INSERT INTO consumable_history 
        (consumable_spec_id, consumable_id, consumable_code, consumable_type, zpl_data, expiration, sequence, quantity, event_id, event_time, event_user)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        consumable.consumable_spec_id,
        consumable.consumable_id,
        consumable.consumable_code,
        consumable.consumable_type,
        consumable.zpl_data,
        consumable.expiration,
        consumable.sequence,
        consumable.quantity,
        payload.event_id,    // event mới
        payload.event_time,   // thoi gian di chuyen
        payload.event_user   // user thao tác
      ]
    );

    await connection.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
