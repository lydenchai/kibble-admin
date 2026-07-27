"use server";

import { serverFetch } from "@/lib/serverApiClient";

export async function fetchDashboardAnalyticsAction(token?: string | null) {
  return serverFetch("/analytics/dashboard", {
    method: "GET",
    token,
    requireAuth: true,
  });
}
