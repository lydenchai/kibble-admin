"use server";

import { serverFetch } from "@/lib/serverApiClient";

export async function updateSettingsAction(payload: any, token?: string | null) {
  return serverFetch("/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
    requireAuth: true,
  });
}

export async function fetchSettingsAction(token?: string | null) {
  return serverFetch("/settings", {
    method: "GET",
    token,
    requireAuth: true,
  });
}
