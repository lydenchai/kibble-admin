"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function updateOrderAction(orderId: string, updates: any, token: string | null) {
  if (!token) {
    return { success: false, error: 'You must be logged in to update order', isAuthError: true };
  }

  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      },
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      const msg = error.error?.message || error.message || 'Failed to update order status';
      const isAuth = res.status === 401 || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('expired');
      return { success: false, error: msg, isAuthError: isAuth };
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return { success: false, error: error.message || 'Failed to update order status' };
  }
}

export async function fetchOrdersAction(token: string | null) {
  if (!token) {
    return { success: false, error: 'You must be logged in to fetch orders', isAuthError: true, data: [] };
  }

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      const msg = error.error?.message || error.message || 'Failed to fetch orders';
      const isAuth = res.status === 401 || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('expired');
      return { success: false, error: msg, isAuthError: isAuth, data: [] };
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    return { success: false, error: error.message || 'Failed to fetch orders', data: [] };
  }
}

export async function fetchOrderByIdAction(orderId: string, token: string | null) {
  if (!token) {
    return { success: false, error: 'You must be logged in to fetch order details', isAuthError: true };
  }

  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      const msg = error.error?.message || error.message || 'Failed to fetch order details';
      const isAuth = res.status === 401 || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('expired');
      return { success: false, error: msg, isAuthError: isAuth };
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch order details:", error);
    return { success: false, error: error.message || 'Failed to fetch order details' };
  }
}
