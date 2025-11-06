import axios from 'axios';

const apiLogin = axios.create({
  baseURL: '/api', // vite proxy sẽ chuyển tiếp
  timeout: 5000,
});

export const loginUser = (credentials) => apiLogin.post('/login', credentials); // credentials là dữ liệu gửi đến backend
export const logoutUser = () => apiLogin.post('/logout');

export default apiLogin;
