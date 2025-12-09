import api from './api';

// lay ngay hien tai
export const fetchCurrentDate = () => api.get(`/current-date`);