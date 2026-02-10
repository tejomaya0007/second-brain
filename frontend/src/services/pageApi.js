import apiClient from './apiClient.js';
import api from "../lib/api";

export const pageApi = {
  // Create a new page in a notebook
  create: (data) => apiClient.post('/knowledge/pages', data),

  // Get a single page
  getById: (id) => apiClient.get(`/knowledge/pages/${id}`),

  // Update a page
  update: (id, data) => apiClient.put(`/knowledge/pages/${id}`, data),

  // Delete a page
  delete: (id) => apiClient.delete(`/knowledge/pages/${id}`),
};
