"use server";

import { serverFetch } from "@/lib/serverApiClient";

export async function fetchCouponsAction(page: number = 1, limit: number = 10, token?: string | null) {
  return serverFetch(`/marketing/coupons?page=${page}&limit=${limit}`, {
    method: "GET",
    token,
    requireAuth: true,
  });
}

export async function createCouponAction(payload: any, token?: string | null) {
  const res = await serverFetch("/marketing/coupons", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
    requireAuth: true,
  });

  if (!res.success) {
    throw new Error(res.error || "Failed to create coupon");
  }
  return res.data;
}

export async function deleteCouponAction(id: string, token?: string | null) {
  const res = await serverFetch(`/marketing/coupons/${id}`, {
    method: "DELETE",
    token,
    requireAuth: true,
  });

  if (!res.success) {
    throw new Error(res.error || "Failed to delete coupon");
  }
  return { success: true };
}
