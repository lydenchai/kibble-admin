"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchCouponsAction(page: number, limit: number, token: string | null) {
  if (!token) throw new Error("Unauthorized");

  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  const res = await fetch(`${API_URL}/marketing/coupons?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-App-Type": "admin",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to fetch coupons");
  }

  return res.json();
}

export async function createCouponAction(data: any, token: string | null) {
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/marketing/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-App-Type": "admin",
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to create coupon");
  }

  return res.json();
}

export async function deleteCouponAction(id: string, token: string | null) {
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/marketing/coupons/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-App-Type": "admin",
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to delete coupon");
  }

  return { success: true };
}
