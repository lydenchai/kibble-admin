"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchAuditLogsAction(token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to fetch audit logs');
  }

  try {
    const res = await fetch(`${API_URL}/audit-logs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch audit logs');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch audit logs:", error);
    throw error;
  }
}
