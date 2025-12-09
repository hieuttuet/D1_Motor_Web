import api from '../api';

// them thong tin machine moi
export const createMachineInput = (payload) => api.post(`/machines-input`, payload);