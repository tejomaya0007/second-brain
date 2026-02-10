import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001',
  timeout: 15000,
  withCredentials: true, // Important for cookies
});

export default apiClient;
