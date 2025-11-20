import db from "../config/db.js";

//lay thong tin consumable specs
export const getAllConsumableSpecs = async () => {
  const rows = await db.query("SELECT consumable_spec_id, consumable_code, consumable_type, description, expiration FROM consumable_specs");
  return rows;
};
//lay thong tin 1 consumable spec
export const getConsumableSpecByCode = async (consumable_code) => {
    const rows = await db.query("SELECT consumable_spec_id, consumable_code, consumable_type, description, expiration FROM consumable_specs WHERE consumable_code = ?", [consumable_code]);
    return rows[0];
}
//them consumable spec moi
export const createConsumableSpec = async (consumableData) => {
  const { consumable_spec_id, consumable_code, consumable_type, description, expiration, event_id, event_user } = consumableData;
  const result = await db.query("INSERT INTO consumable_specs (consumable_spec_id, consumable_code, consumable_type, description, expiration, event_id, event_user) VALUES (?, ?, ?, ?, ?, ?, ?)", [consumable_spec_id, consumable_code ,consumable_type, description, expiration, event_id, event_user]);
  return result;
};
// lay thong tin consumable_spec_id lớn nhất trên database
export const getMaxConsumableSpecId = async () => {
  const rows = await db.query("SELECT MAX(CAST(SUBSTRING(consumable_spec_id, 2) AS UNSIGNED)) AS max_consumable_spec_id FROM consumable_specs");
  return rows[0];
}
//cap nhat consumable spec
export const updateConsumableSpec = async (consumable_spec_id, consumableData) => {
  const { consumable_code,consumable_type, description, expiration, event_id, event_user } = consumableData;
  await db.query("UPDATE consumable_specs SET consumable_code = ?, consumable_type = ?, description = ?, expiration = ?, event_id = ?, event_user = ? WHERE consumable_spec_id = ?", [consumable_code, consumable_type, description, expiration, event_id, event_user, consumable_spec_id]);
};  
//xoa consumable spec
export const deleteConsumableSpec = async (consumable_spec_id) => {
  await db.query("DELETE FROM consumable_specs WHERE consumable_spec_id = ?", [consumable_spec_id]);
};