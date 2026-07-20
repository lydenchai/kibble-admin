"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchCustomersAction(page: number, limit: number, search: string, token: string | null) {
  if (!token) throw new Error("Unauthorized");

  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search) queryParams.append('search', search);

  const res = await fetch(`${API_URL}/customers?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-App-Type": "admin",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to fetch customers");
  }

  return res.json();
}
