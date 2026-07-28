"use server";

import { serverFetch } from "@/lib/serverApiClient";

export async function createProductAction(payload: any, token?: string | null) {
  const res = await serverFetch("/products", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
    requireAuth: true,
  });

  if (!res.success) {
    throw new Error(res.error || "Failed to create product");
  }
  return res.data;
}

export async function updateProductAction(id: string, payload: any, token?: string | null) {
  const res = await serverFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
    requireAuth: true,
  });

  if (!res.success) {
    throw new Error(res.error || "Failed to update product");
  }
  return res.data;
}

export async function deleteProductAction(id: string, token?: string | null) {
  const res = await serverFetch(`/products/${id}`, {
    method: "DELETE",
    token,
    requireAuth: true,
  });

  if (!res.success) {
    throw new Error(res.error || "Failed to delete product");
  }
  return res;
}

export async function fetchProductsAction(page: number, limit: number, token?: string | null, search?: string) {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  return serverFetch(`/products?page=${page}&limit=${limit}&showInactive=true&sort=-createdAt${searchParam}`, {
    method: "GET",
    token,
  });
}

export async function fetchProductByIdAction(id: string, token?: string | null) {
  return serverFetch(`/products/admin/${id}`, {
    method: "GET",
    token,
  });
}
