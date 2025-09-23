import axios from 'axios';

// Base configuration
const httpClient = axios.create({
  baseURL: 'http://localhost/LibManage/backend/api',
});

// Attach Authorization header from localStorage token
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;



