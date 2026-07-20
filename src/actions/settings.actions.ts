"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function updateSettingsAction(payload: any, token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to update settings');
  }

  try {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to update settings');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    throw error;
  }
}

export async function fetchSettingsAction(token: string | null) {
  if (!token) throw new Error('You must be logged in to fetch settings');

  try {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch settings');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    throw error;
  }
}
