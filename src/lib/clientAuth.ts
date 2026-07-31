const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Attempts to automatically refresh the client access token when expired.
 * Returns the new access token string, or null if refresh failed (which triggers session cleanup & re-login).
 */
export async function refreshClientAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const refreshToken =
    localStorage.getItem("refresh_token") || localStorage.getItem("admin_refresh_token");

  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Type": "admin",
        ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success && data.data?.accessToken) {
      const newAccessToken = data.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      if (data.data.refresh_token) {
        localStorage.setItem("refresh_token", data.data.refresh_token);
      }
      return newAccessToken;
    }
  } catch (err) {
    console.error("Client access token refresh error:", err);
  }

  handleSessionExpired();
  return null;
}

/**
 * Clears expired credentials and redirects user to re-login.
 */
export function handleSessionExpired() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("kibble-admin-storage");

    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login?expired=true";
    }
  }
}
