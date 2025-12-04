import api from '../api';

// lay thong tin consumable theo id
export const getConsumableSpecById = (consumable_id) => api.get(`/consumable-move/${consumable_id}`);
// update thong tin consumable
export const updateConsumableInfo = (payload) => api.put(`/consumable-move/${payload.consumable_id}`, payload);