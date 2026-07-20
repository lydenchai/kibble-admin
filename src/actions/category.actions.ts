"use server";

import { CategoryType } from "@/app/_types/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchCategoriesAction(page?: number, limit?: number) {
  let url = `${API_URL}/categories`;
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Type': 'admin'
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error?.message || "Failed to fetch categories");
  }

  const data = await res.json();
  return {
    data: data.data as CategoryType[],
    total: data.pagination?.total || 0,
  };
}

export async function fetchCategoryByIdAction(id: string) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Type': 'admin'
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error?.message || "Failed to fetch category");
  }

  const data = await res.json();
  return data.data as CategoryType;
}

export async function createCategoryAction(payload: any, token: string | null) {
  if (!token) throw new Error("You must be logged in to create a category");
  
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-App-Type': 'admin'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error?.message || "Failed to create category");
  }

  const data = await res.json();
  return data.data;
}

export async function updateCategoryAction(id: string, payload: any, token: string | null) {
  if (!token) throw new Error("You must be logged in to update a category");
  
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-App-Type': 'admin'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error?.message || "Failed to update category");
  }

  const data = await res.json();
  return data.data;
}

export async function deleteCategoryAction(id: string, token: string | null) {
  if (!token) throw new Error("You must be logged in to delete a category");
  
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-App-Type': 'admin'
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error?.message || "Failed to delete category");
  }

  if (res.status === 204) return { success: true };

  const data = await res.json();
  return data;
}
