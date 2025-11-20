import { 
  getAllConsumableSpecs,
   getConsumableSpecByCode,
   createConsumableSpec, 
   updateConsumableSpec, 
   deleteConsumableSpec,
   getMaxConsumableSpecId } from "../models/consumableSpecs.model.js";
import { ok, error } from "../middlewares/responseHandler.js";
// 🔹 Lấy danh sách consumable specs
export const getAllConsumableSpecsController = async (req, res) => {
  try {
    const consumableSpecs = await getAllConsumableSpecs();
    if(!consumableSpecs) {
      return error(res, "Không tìm thấy nguyên vật liệu", 404);
    } else {
      return ok(res, consumableSpecs, "Lấy danh sách nguyên vật liệu thành công"); 
    }
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};
// 🔹 Thêm consumable spec mới
export const createConsumableSpecController = async (req, res) => {
    try {
      const { consumable_code} = req.body;
      const existingSpec = await getConsumableSpecByCode(consumable_code);
      if (existingSpec) {
        return error(res, "Consumable code already exists", 401);
      }
      const maxId = await getMaxConsumableSpecId();
      const nextId = maxId + 1;
      const consumable_spec_id_next = `P${nextId.toString().padStart(5, '0')}`;
      const payload = {
      ...req.body,
      consumable_spec_id: consumable_spec_id_next,
      event_id: "CREATE",
      event_user: req.user.user_name,
      };
      const newSpec = await createConsumableSpec(payload);
      if (!newSpec) {
        return error(res, "Failed to create consumable spec", 401);
      }
      return ok(res, newSpec, "Thêm nguyên vật liệu thành công");
    } catch (err) {
      return error(res, "Lỗi server", 500);
    }
  };    
// 🔹 Cập nhật consumable spec
export const updateConsumableSpecController = async (req, res) => {
    const { consumable_spec_id } = req.params;
    const { consumable_code } = req.body;
    try {
      const spec = await getConsumableSpecByCode(consumable_code);
      if (spec.consumable_spec_id !== consumable_spec_id) {
        return error(res, "Consumable code already exists", 401);
      }
      const payload = {
      ...req.body,
      event_id: "UPDATE",
      event_user: req.user.user_name,
      };
      const updatedSpec = await updateConsumableSpec(consumable_spec_id, payload);
      return ok(res, updatedSpec, "Cap nhat nguyên vật liệu thanh cong");
    } catch (err) {
      return error(res, "Lỗi server", 500);
    }
  };
// 🔹 Xóa consumable spec
export const deleteConsumableSpecController = async (req, res) => {
    const { consumable_spec_id } = req.params;
    try {
    const result = await deleteConsumableSpec(consumable_spec_id);
    return ok(res, result, "Xoa nguyên vật liệu thanh cong");
    } catch (err) {
      return error(res, "Lỗi server", 500);
    }
  };