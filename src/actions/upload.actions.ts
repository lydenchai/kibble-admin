"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function uploadImageAction(formData: FormData, token?: string | null) {
  try {
    let authToken = token;
    if (!authToken) {
      const cookieStore = await cookies();
      authToken = cookieStore.get("accessToken")?.value || null;
    }

    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "X-App-Type": "admin",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: formData,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || data.error || "Failed to upload image");
    }

    return { success: true, url: data.data.url };
  } catch (err: any) {
    console.error("Upload image error:", err);
    return { success: false, error: err.message || "Image upload failed" };
  }
}
