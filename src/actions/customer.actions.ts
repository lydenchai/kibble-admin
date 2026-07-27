"use server";

import { serverFetch } from "@/lib/serverApiClient";

export async function fetchCustomersAction(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  token?: string | null
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  });

  return serverFetch(`/customers?${params.toString()}`, {
    method: "GET",
    token,
    requireAuth: true,
  });
}
