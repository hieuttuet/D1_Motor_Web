import {getAllConsumableSpecsService, createConsumableSpecService, updateConsumableSpecService, deleteConsumableSpecService } from "../services/consumableSpecs.service.js";
// 🔹 Lấy danh sách consumable specs
export const getAllConsumableSpecsController = async (req, res) => {
  try {
    const specs = await getAllConsumableSpecsService();
    res.json(specs);
  } catch (err) {
    console.error("❌ Error getting consumable specs:", err);
    res.status(500).json({ error: err.message });
  }
};
// 🔹 Thêm consumable spec mới
export const createConsumableSpecController = async (req, res) => {
    try {
      const newSpec = await createConsumableSpecService(req.body);
      res.status(201).json(newSpec);
    } catch (err) {
      console.error("❌ Error creating consumable spec:", err);
      res.status(400).json({ error: err.message });
    }
  };    
// 🔹 Cập nhật consumable spec
export const updateConsumableSpecController = async (req, res) => {
    const { consumable_spec_id } = req.params;
    try {
      const updatedSpec = await updateConsumableSpecService(consumable_spec_id, req.body);
      res.json(updatedSpec);
    } catch (err) {
      console.error("❌ Error updating consumable spec:", err);
      res.status(400).json({ error: err.message });
    }
  };
// 🔹 Xóa consumable spec
export const deleteConsumableSpecController = async (req, res) => {
    const { consumable_spec_id } = req.params;
    try {
      await deleteConsumableSpecService(consumable_spec_id);
      res.json({ message: "Consumable spec deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting consumable spec:", err);
      res.status(400).json({ error: err.message });
    }
  };