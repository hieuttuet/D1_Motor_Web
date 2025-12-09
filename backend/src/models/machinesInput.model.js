import db from "../config/db.js";

// thêm thông tin machine input vào DB
export const addMachineInput = async (data, files) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const machine = await db.query(
      `INSERT INTO machines
      (machine_name, serial_number, invoice, delivery_date, model, asset_code, machine_status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.machineName,
        data.serialNumber,
        data.invoice,
        data.deliveryDate,
        data.model,
        data.assetCode,
        data.machineStatus,
        data.description,
      ]
    );
    const machineId = machine.insertId;

    // 2️⃣ Insert từng ảnh vào bảng images
    for (const file of files) {
      await conn.query(
        `INSERT INTO machine_images (machine_id, url, file_name)
         VALUES (?, ?, ?)`,
        [machineId, file.path, file.filename]
      );
    }

    await conn.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
