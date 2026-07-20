"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchDashboardAnalyticsAction(token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to fetch analytics');
  }

  try {
    const res = await fetch(`${API_URL}/analytics/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch dashboard analytics');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch dashboard analytics:", error);
    throw error;
  }
}
