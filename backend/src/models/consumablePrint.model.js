import db from "../config/db.js";

//lay thong tin thời gian trên server
export const getServerTime = async () => {
  const [rows] = await db.query("SELECT NOW() AS server_time");
  return rows; // => { server_time: '2025-11-19 10:20:30' }
};
// lấy tọa độ in ZPL
export const getZPLPositionModel = async (label_id) => {
  const rows = await db.query("SELECT position_x, position_y FROM zpl_specs WHERE label_id = ? LIMIT 1", [label_id]);
  return rows[0];
} 
//lay thong tin zpl code
export const getZPLCodeModel = async (label_id) => {
  const rows = await db.query("SELECT zpl_code, position_x, position_y FROM zpl_specs WHERE label_id = ? LIMIT 1", [label_id]);
  return rows[0];
}
//lay thong tin sequence consumable_code trong ngay
export const getSequenceConsumableCode = async (consumable_code) => {
  const rows = await db.query("SELECT MAX(sequence) AS max_seq FROM consumables WHERE consumable_code = ? AND event_time >= CURDATE() AND event_time < CURDATE() + INTERVAL 1 DAY;",[consumable_code]);
  return rows[0];
}
// Insert consumable với transaction
export const insertConsumableWithHistory = async (consumableData) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { 
      consumable_spec_id, consumable_id, consumable_code, consumable_type,
      zpl_data, expiration, sequence, quantity, event_id, event_user,
    } = consumableData;

    // 1. Insert consumables
    const consumableResult = await connection.query(
      `INSERT INTO consumables 
       (consumable_spec_id, consumable_id, consumable_code, consumable_type,zpl_data, expiration, sequence, quantity, event_id, event_user)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        consumable_spec_id, consumable_id, consumable_code, consumable_type,
        zpl_data, expiration, sequence, quantity, event_id, event_user
      ]
    );

    // 2. Insert consumable_history
    await connection.query(
      `INSERT INTO consumable_history 
       (consumable_spec_id, consumable_id, consumable_code, consumable_type, zpl_data, expiration, sequence, quantity, event_id, event_user)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        consumable_spec_id, consumable_id, consumable_code, consumable_type,
        zpl_data, expiration, sequence, quantity, event_id, event_user
      ]
    );

    await connection.commit();

    return {
      success: true
    };

  } catch (error) {
    console.log("loi eror",error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
// Cập nhật tọa độ in ZPL
export const updateZPLPositionModel = async (label_id, position_x, position_y) => {
  const result = await db.query(    
    "UPDATE zpl_specs SET position_x = ?, position_y = ? WHERE label_id = ?",
    [position_x, position_y, label_id]
  );
  return result;
};
