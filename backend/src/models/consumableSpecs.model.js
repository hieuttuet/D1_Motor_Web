import db from "../config/db.js";

//lay thong tin consumable specs
export const getAllConsumableSpecs = async () => {
  const rows = await db.query("SELECT consumable_spec_id, consumable_type, description, expiration FROM consumable_specs");
  console.log(rows);
  return rows;
};
//lay thong tin 1 consumable spec
export const getConsumableSpecById = async (consumable_spec_id) => {
    const rows = await db.query("SELECT consumable_spec_id, consumable_type, description, expiration FROM consumable_specs WHERE consumable_spec_id = ?", [consumable_spec_id]);
    return rows[0];
}
//them consumable spec moi
export const createConsumableSpec = async (consumableData) => {
  const { consumable_spec_id, consumable_type, description, expiration, event_id, event_user } = consumableData;
  const result = await db.query("INSERT INTO consumable_specs (consumable_spec_id, consumable_type, description, expiration, event_id, event_user) VALUES (?, ?, ?, ?, ?, ?)", [consumable_spec_id, consumable_type, description, expiration, event_id, event_user]);
  return { consumable_spec_id, consumable_type, description, expiration, event_id, event_user };
};
//cap nhat consumable spec
export const updateConsumableSpec = async (consumable_spec_id, consumableData) => {
  const { consumable_type, description, expiration, event_id, event_user } = consumableData;
  await db.query("UPDATE consumable_specs SET consumable_type = ?, description = ?, expiration = ?, event_id = ?, event_user = ? WHERE consumable_spec_id = ?", [consumable_type, description, expiration, event_id, event_user, consumable_spec_id]);
};  
//xoa consumable spec
export const deleteConsumableSpec = async (consumable_spec_id) => {
  await db.query("DELETE FROM consumable_specs WHERE consumable_spec_id = ?", [consumable_spec_id]);
};