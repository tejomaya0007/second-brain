import apiClient from "./apiClient";

export const knowledgeApi = {
  getAll: (params) => apiClient.get("/knowledge", { params }),
  getById: (id) => apiClient.get(`/knowledge/${id}`),
  create: (data) => apiClient.post("/knowledge", data),
  update: (id, data) => apiClient.put(`/knowledge/${id}`, data),
  delete: (id) => apiClient.delete(`/knowledge/${id}`),
  search: (q) =>
    apiClient.get("/knowledge/search", { params: { q } }),
  chat: (question) =>
    apiClient.post("/knowledge/chat", { question }),
  summarize: (content) =>
    apiClient.post("/knowledge/summarize", { content }),
  generateTags: (content) =>
    apiClient.post("/knowledge/tags", { content }),
};
