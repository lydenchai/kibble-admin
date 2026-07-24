"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function updateSettingsAction(payload: any, token: string | null) {
  if (!token) {
    return { success: false, error: 'You must be logged in to update settings', isAuthError: true };
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
      const error = await res.json().catch(() => ({}));
      const msg = error.error?.message || error.message || 'Failed to update settings';
      const isAuth = res.status === 401 || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('expired');
      return { success: false, error: msg, isAuthError: isAuth };
    }

    const data = await res.json();
    return { success: true, data: data.data || data };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { success: false, error: error.message || 'Failed to update settings' };
  }
}

export async function fetchSettingsAction(token: string | null) {
  if (!token) {
    return { success: false, error: 'You must be logged in to fetch settings', isAuthError: true };
  }

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
      const msg = error.error?.message || error.message || 'Failed to fetch settings';
      const isAuth = res.status === 401 || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('expired');
      return { success: false, error: msg, isAuthError: isAuth };
    }

    const data = await res.json();
    return { success: true, data: data.data || data };
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return { success: false, error: error.message || 'Failed to fetch settings' };
  }
}
