import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

// Use withCredentials so cookies (JWT token) are sent on knowledge requests too
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const knowledgeApi = {
  getAll: (params) => api.get('/knowledge', { params }),
  getById: (id) => api.get(`/knowledge/${id}`),
  create: (data) => api.post('/knowledge', data),
  update: (id, data) => api.put(`/knowledge/${id}`, data),
  delete: (id) => api.delete(`/knowledge/${id}`),
  search: (q) => api.get('/knowledge/search', { params: { q } }),
  chat: (question) => api.post('/knowledge/chat', { question }),
  summarize: (content) => api.post('/knowledge/summarize', { content }),
  generateTags: (content) => api.post('/knowledge/tags', { content }),
};

export default api;
