const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function handleAuthFailure() {
  if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }
}

async function fetchWrapper(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Required to send the HttpOnly refresh token cookie
  };

  let response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    if (endpoint === '/auth/refresh-token' || endpoint === '/auth/login') {
      handleAuthFailure();
      throw new ApiError("Session expired or invalid credentials", 401);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include" // Send refresh token cookie
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newAccessToken = refreshData.data?.accessToken;
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            onRefreshed(newAccessToken);
          } else {
            throw new Error("No access token returned");
          }
        } else {
          onRefreshed("");
          handleAuthFailure();
          throw new ApiError("Session expired", 401);
        }
      } catch (err) {
        onRefreshed("");
        handleAuthFailure();
        throw new ApiError("Session expired", 401);
      } finally {
        isRefreshing = false;
      }
    }

    // Wait until the refresh token is acquired or fails
    const retryPromise = new Promise<Response>((resolve, reject) => {
      subscribeTokenRefresh((newToken: string) => {
        if (newToken) {
          const newHeaders = new Headers(options.headers || {});
          newHeaders.set("Content-Type", "application/json");
          newHeaders.set("Authorization", `Bearer ${newToken}`);

          fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: newHeaders,
            credentials: "include"
          }).then(resolve).catch(reject);
        } else {
          reject(new ApiError("Session expired", 401));
        }
      });
    });

    response = await retryPromise;
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    throw new ApiError(errorData?.error?.message || errorData?.message || "An error occurred", response.status, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const apiClient = {
  get: (endpoint: string, options?: RequestInit) => fetchWrapper(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, data: unknown, options?: RequestInit) => fetchWrapper(endpoint, { ...options, method: "POST", body: JSON.stringify(data) }),
  put: (endpoint: string, data: unknown, options?: RequestInit) => fetchWrapper(endpoint, { ...options, method: "PUT", body: JSON.stringify(data) }),
  delete: (endpoint: string, options?: RequestInit) => fetchWrapper(endpoint, { ...options, method: "DELETE" }),
};
