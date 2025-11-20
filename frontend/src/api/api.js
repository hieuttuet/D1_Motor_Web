// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
//   withCredentials: true, // nếu backend dùng HTTP-only refresh token cookie
});

// Interceptor: tự gắn access token từ localStorage
api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.token?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
