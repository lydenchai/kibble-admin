"use server";

import { CategoryType } from "@/types/category";
import { serverFetch } from "@/lib/serverApiClient";

export async function fetchCategoriesAction(page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await serverFetch<CategoryType[]>(`/categories${queryString}`, { method: "GET" });

  if (!res.success) {
    throw new Error(res.error || "Failed to fetch categories");
  }

  return {
    data: (res.data || []) as CategoryType[],
    total: res.pagination?.total || 0,
  };
}

export async function fetchCategoryByIdAction(id: string) {
  const res = await serverFetch<CategoryType>(`/categories/${id}`, { method: "GET" });
  if (!res.success) {
    throw new Error(res.error || "Failed to fetch category");
  }
  return res.data;
}

export async function createCategoryAction(payload: any, token?: string | null) {
  const res = await serverFetch("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
    requireAuth: true,
  });

  if (!res.success) {
    throw new Error(res.error || "Failed to create category");
  }
  return res.data;
}

export async function updateCategoryAction(id: string, payload: any, token?: string | null) {
  const res = await serverFetch(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
    requireAuth: true,
  });

  if (!res.success) {
    throw new Error(res.error || "Failed to update category");
  }
  return res.data;
}

export async function deleteCategoryAction(id: string, token?: string | null) {
  const res = await serverFetch(`/categories/${id}`, {
    method: "DELETE",
    token,
    requireAuth: true,
  });

  if (!res.success) {
    throw new Error(res.error || "Failed to delete category");
  }
  return { success: true };
}
