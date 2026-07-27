"use server";

import { serverFetch } from "@/lib/serverApiClient";

export async function fetchAuditLogsAction(token?: string | null) {
  return serverFetch("/audit-logs", {
    method: "GET",
    token,
    requireAuth: true,
  });
}
