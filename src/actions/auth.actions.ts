"use server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || null;
}

export async function loginAction(credentials: any) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Type': 'admin'
      },
      body: JSON.stringify(credentials)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to login');
    }

    const data = await res.json();
    const cookieStore = await cookies();

    // Store Access Token as HttpOnly cookie
    if (data.data?.accessToken) {
      cookieStore.set('accessToken', data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });
    }

    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      const match = setCookieHeader.match(/admin_refresh_token=([^;]+)/);
      if (match) {
        cookieStore.set('admin_refresh_token', match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60
        });
      }
    }

    cookieStore.set('is_authenticated', 'true', {
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return data;
  } catch (error: any) {
    console.error("Failed to login:", error);
    throw error;
  }
}

export async function logoutAction(token?: string | null) {
  const cookieStore = await cookies();
  const authToken = token || cookieStore.get('accessToken')?.value || null;

  try {
    if (authToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-App-Type': 'admin'
        }
      });
    }
  } catch (err) {
    console.error("Logout API call error:", err);
  } finally {
    cookieStore.delete('accessToken');
    cookieStore.delete('admin_refresh_token');
    cookieStore.delete('is_authenticated');
  }

  return { success: true };
}

export async function fetchProfileAction(token?: string | null) {
  const cookieStore = await cookies();
  const authToken = token || cookieStore.get('accessToken')?.value || null;

  if (!authToken) throw new Error("You must be logged in to fetch profile");

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to fetch profile');
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
}
