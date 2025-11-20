import api from '../api';

// lay danh sach consumable spec
export const getConsumables = () => api.get('/consumable-specs');
// them consumable spec moi
export const addConsumable = (consumableData) => api.post('/consumable-specs', consumableData);
// cap nhat consumable spec
export const updateConsumable = (consumableData) => api.put(`/consumable-specs/${consumableData.consumable_spec_id}`, consumableData);
// xoa consumable spec
export const deleteConsumable = (consumable_spec_id) => api.delete(`/consumable-specs/${consumable_spec_id}`);
