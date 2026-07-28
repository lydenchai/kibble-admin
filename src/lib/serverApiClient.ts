import { cookies } from "next/headers";
import { ServerResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAuthToken(token?: string | null): Promise<string | null> {
  if (token) return token;
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

export type { ServerResponse };

async function refreshAccessTokenAdmin(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refresh_token = cookieStore.get("admin_refresh_token")?.value;
    if (!refresh_token) return null;

    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Type": "admin",
        "x-refresh-token": refresh_token,
        Cookie: `admin_refresh_token=${refresh_token}`,
      },
      body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) {
      cookieStore.delete("accessToken");
      cookieStore.delete("admin_refresh_token");
      cookieStore.delete("is_authenticated");
      return null;
    }

    const data = await res.json();
    const newAccessToken = data.data?.accessToken;
    const newrefresh_token = data.data?.refresh_token;

    if (newAccessToken) {
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      if (newrefresh_token) {
        cookieStore.set("admin_refresh_token", newrefresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
      }
      return newAccessToken;
    }

    return null;
  } catch (err) {
    console.error("Failed to refresh admin access token:", err);
    return null;
  }
}

export async function serverFetch<T = any>(
  endpoint: string,
  options: RequestInit & { token?: string | null; requireAuth?: boolean } = {}
): Promise<ServerResponse<T>> {
  const { token, requireAuth = false, headers, ...restOptions } = options;
  let authToken = await getAuthToken(token);

  if (requireAuth && !authToken) {
    authToken = await refreshAccessTokenAdmin();
    if (!authToken) {
      return { success: false, error: "You must be logged in to perform this action", is_auth_error: true };
    }
  }

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-App-Type": "admin",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  try {
    const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    let res = await fetch(url, {
      cache: "no-store",
      headers: reqHeaders,
      ...restOptions,
    });

    if (res.status === 401) {
      const newToken = await refreshAccessTokenAdmin();
      if (newToken) {
        reqHeaders.Authorization = `Bearer ${newToken}`;
        res = await fetch(url, {
          cache: "no-store",
          headers: reqHeaders,
          ...restOptions,
        });
      }
    }

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const msg = errorJson.error?.message || errorJson.message || `Request failed with status ${res.status}`;
      const isAuth = res.status === 401 || msg.toLowerCase().includes("token") || msg.toLowerCase().includes("expired");
      return { success: false, error: msg, is_auth_error: isAuth };
    }

    if (res.status === 204) {
      return { success: true };
    }

    const dataJson = await res.json();
    return {
      success: true,
      data: dataJson.data !== undefined ? dataJson.data : dataJson,
      pagination: dataJson.pagination,
    };
  } catch (error: any) {
    console.error(`serverFetch error [${endpoint}]:`, error);
    return { success: false, error: error.message || "Server error" };
  }
}
