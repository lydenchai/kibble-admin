"use server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    
    // We get refresh_token as a Set-Cookie header from the backend.
    // In server actions, passing it along to the client via a response is handled automatically by NextJS 
    // if we forward cookies, but since fetch in Server Action won't automatically set the cookie on the user's browser,
    // we need to manually extract it and set it using Next.js cookies(), or the backend handles it.
    // Wait, since the backend sends a Set-Cookie header, does fetch in Server Action forward it?
    // Not automatically. We must read the Set-Cookie header and set it.
    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      // Very basic parsing for development. In production use a library.
      const match = setCookieHeader.match(/admin_refresh_token=([^;]+)/);
      if (match) {
        (await cookies()).set('admin_refresh_token', match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });
      }
    }

    (await cookies()).set('is_authenticated', 'true', {
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return data;
  } catch (error: any) {
    console.error("Failed to login:", error);
    throw error;
  }
}

export async function logoutAction(token: string | null) {
  if (!token) {
    return { success: true };
  }

  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-App-Type': 'admin'
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error?.message || 'Failed to logout');
    }

    (await cookies()).delete('admin_refresh_token');
    (await cookies()).delete('is_authenticated');

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Failed to logout:", error);
    throw error;
  }
}

export async function fetchProfileAction(token: string | null) {
  if (!token) throw new Error("You must be logged in to fetch profile");

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
