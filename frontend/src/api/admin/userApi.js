import axios from 'axios';

const apiUser = axios.create({
  baseURL: '/api', // Sử dụng cùng proxy như login
  timeout: 5000,
});

// Lấy danh sách người dùng
export const getUsers = () => apiUser.get('/users');

// Thêm người dùng mới
export const createUser = (userData) => apiUser.post('/users', userData);

// Cập nhật người dùng
export const updateUser = (user_id, userData) => apiUser.put(`/users/${user_id}`, userData);

// Xóa người dùng
export const deleteUser = (user_id) => apiUser.delete(`/users/${user_id}`);

export default apiUser;
