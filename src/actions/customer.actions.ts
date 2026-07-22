"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchCustomersAction(page: number, limit: number, search: string, token: string | null) {
  if (!token) return { success: false, error: "Unauthorized" };

  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search) queryParams.append('search', search);

  try {
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
      return { success: false, error: errorData.error?.message || "Failed to fetch customers" };
    }

    return res.json();
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch customers" };
  }
}
