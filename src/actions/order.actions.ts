"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function updateOrderAction(orderId: string, updates: any, token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to update order');
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
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to update order status');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    throw error;
  }
}

export async function fetchOrdersAction(token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to fetch orders');
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
      throw new Error(error.error?.message || 'Failed to fetch orders');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
}

export async function fetchOrderByIdAction(orderId: string, token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to fetch order details');
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
      throw new Error(error.error?.message || 'Failed to fetch order details');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch order details:", error);
    return { success: false, error: error.message };
  }
}
