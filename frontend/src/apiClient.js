import axios from 'axios';

// Get the user's auth info (token) from localStorage
// Your frontend login function is responsible for storing this.
const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const api = axios.create({
  // Set your backend's base URL
  // This is the URL where your Express app is running
  baseURL: 'http://localhost:5000', // Or your deployed URL
});

// This is an "interceptor"
// It runs BEFORE every single request is sent
api.interceptors.request.use(
  (config) => {
    if (userInfo) {
      // Add the "Authorization: Bearer <token>" header
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;