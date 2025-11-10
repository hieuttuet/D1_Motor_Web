import axios from 'axios';

const apiConsumableSpec = axios.create({
  baseURL: '/api', // Sử dụng cùng proxy như login
  timeout: 5000,
});
// lay danh sach consumable spec
export const getConsumables = () => apiConsumableSpec.get('/consumable-specs');
// them consumable spec moi
export const addConsumable = (consumableData) => apiConsumableSpec.post('/consumable-specs', consumableData);
// cap nhat consumable spec
export const updateConsumable = (consumableData) => apiConsumableSpec.put(`/consumable-specs/${consumableData.consumable_spec_id}`, consumableData);
// xoa consumable spec
export const deleteConsumable = (consumable_spec_id) => apiConsumableSpec.delete(`/consumable-specs/${consumable_spec_id}`);
