import api from '../api';

// Lấy danh sách người dùng
export const getUsers = () => api.get('/users');

// Thêm người dùng mới
export const createUser = (userData) => api.post('/users', userData);

// Cập nhật người dùng
export const updateUser = (user_id, userData) => api.put(`/users/${user_id}`, userData);

// Xóa người dùng
export const deleteUser = (user_id) => api.delete(`/users/${user_id}`);

