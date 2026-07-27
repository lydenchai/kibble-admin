"use server";

import { serverFetch } from "@/lib/serverApiClient";

export async function updateOrderAction(orderId: string, updates: any, token?: string | null) {
  return serverFetch(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify(updates),
    token,
    requireAuth: true,
  });
}

export async function fetchOrdersAction(token?: string | null) {
  const res = await serverFetch<any[]>("/orders", {
    method: "GET",
    token,
    requireAuth: true,
  });
  return {
    ...res,
    data: res.data || [],
  };
}

export async function fetchOrderByIdAction(orderId: string, token?: string | null) {
  return serverFetch(`/orders/${orderId}`, {
    method: "GET",
    token,
    requireAuth: true,
  });
}
