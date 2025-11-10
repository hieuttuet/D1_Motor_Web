import { getAllConsumableSpecs, getConsumableSpecById,createConsumableSpec, updateConsumableSpec, deleteConsumableSpec } from "../models/consumableSpecs.model.js";
// 🔹 Lấy danh sách consumable specs
export const getAllConsumableSpecsService = async () => {
  const specs = await getAllConsumableSpecs();
  return specs;
};

// 🔹 Them consumable spec moi  
export const createConsumableSpecService = async (consumableData) => {
    const spec = await getConsumableSpecById(consumableData.consumable_spec_id);
    if (spec) {
        throw new Error("Consumable Spec ID already exists");
    }
    const payload = {
    ...consumableData,
    event_id: "CREATE",
    };
    return await createConsumableSpec(payload);
}
// 🔹 Cap nhat consumable spec
export const updateConsumableSpecService = async (consumable_spec_id, consumableData) => {
    const spec = await getConsumableSpecById(consumable_spec_id);
    if (!spec) {
        throw new Error("Consumable Spec not found");
    }
    const payload = {
    ...consumableData,
    event_id: "UPDATE",
    };   
    return await updateConsumableSpec(consumable_spec_id, payload);
};
// 🔹 Xoa consumable spec
export const deleteConsumableSpecService = async (consumable_spec_id) => {
    return await deleteConsumableSpec(consumable_spec_id);
};