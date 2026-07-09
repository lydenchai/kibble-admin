import { apiClient } from "../apiClient";

export const categoryApi = {
  getCategories: (page?: number, limit?: number) => {
    let url = "/categories";
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    return apiClient.get(url);
  },
  getCategoryById: (id: string) => apiClient.get(`/categories/${id}`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createCategory: (data: any) => apiClient.post('/categories', data),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCategory: (id: string, data: any) => apiClient.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/categories/${id}`)
};
