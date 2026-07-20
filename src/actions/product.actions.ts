"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function createProductAction(payload: any, token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to create a product');
  }

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to create product');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

export async function updateProductAction(id: string, payload: any, token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to update a product');
  }

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
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
      throw new Error(error.error?.message || 'Failed to update product');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to update product:", error);
    throw error;
  }
}

export async function deleteProductAction(id: string, token: string | null) {
  if (!token) {
    throw new Error('You must be logged in to delete a product');
  }

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to delete product');
    }

    if (res.status === 204) {
      return { success: true };
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    throw error;
  }
}

export async function fetchProductsAction(page: number, limit: number, token: string | null) {
  try {
    const res = await fetch(`${API_URL}/products?page=${page}&limit=${limit}&showInactive=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch products');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

export async function fetchProductByIdAction(id: string, token: string | null) {
  try {
    const res = await fetch(`${API_URL}/products/admin/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch product');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    throw error;
  }
}
