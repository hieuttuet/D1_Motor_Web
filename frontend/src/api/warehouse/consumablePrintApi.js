import api from '../api';

// lay thong tin consumable theo id
export const getConsumableSpecByCode = (consumable_code) => api.get(`/consumable-label-print/${consumable_code}`);
// update thông tin consumable
export const updateConsumableInfo = (payload) => api.put(`/consumable-label-print/${payload.consumable_code}`, payload);
//update thong tin tọa độ in ZPL
export const updateZPLPosition = (payload) => api.put(`/consumable-label-print/zpl-position/${payload.label_id}`, payload);
// lay tọa độ in ZPL
export const getZPLPosition = (label_id) => api.get(`/consumable-label-print/zpl-position/${label_id}`);