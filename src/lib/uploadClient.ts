import { refreshClientAccessToken } from "./clientAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function uploadImageClient(file: File, retryCount = 0): Promise<string> {
  let token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const fd = new FormData();
  fd.append("image", file);

  let res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "X-App-Type": "admin",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: fd,
  });

  // Automatically refresh token & retry if 401 token expired
  if (res.status === 401 && retryCount === 0) {
    const newToken = await refreshClientAccessToken();
    if (newToken) {
      return uploadImageClient(file, 1);
    }
  }

  const responseText = await res.text();
  let data: any = {};

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Upload server error (${res.status}): ${
        responseText.length > 120 ? responseText.substring(0, 120) + "..." : responseText || "Invalid server response"
      }`
    );
  }

  if (!res.ok || !data.success || !data.data?.url) {
    const errorMsg = data.error?.message || data.error || `Upload failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data.data.url;
}

export async function uploadMultipleImagesClient(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadImageClient(file);
    urls.push(url);
  }
  return urls;
}
