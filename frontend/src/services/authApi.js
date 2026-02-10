import apiClient from './apiClient.js';

export const authApi = {
  login: (credentials) =>
    apiClient.post('/api/auth/login', credentials),

  register: (userData) =>
    apiClient.post('/api/auth/register', userData),

  logout: () =>
    apiClient.post('/api/auth/logout'),

  getMe: () =>
    apiClient.get('/api/auth/me'),

  updateMe: (data) =>
    apiClient.put('/api/auth/me', data),
};
