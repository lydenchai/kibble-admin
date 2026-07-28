"use server";

import { serverFetch } from "@/lib/serverApiClient";

export async function fetchStaffMembersAction(page: number = 1, limit: number = 20, search: string = "", token?: string | null) {
  return serverFetch(`/customers/staff?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, {
    method: "GET",
    token,
    requireAuth: true,
  });
}

export async function createStaffMemberAction(payload: { name: string; email: string; password: string; role: "staff" | "admin" }, token?: string | null) {
  return serverFetch("/customers/staff", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
    requireAuth: true,
  });
}

export async function updateStaffMemberAction(id: string, payload: { name?: string; email?: string; password?: string; role?: "staff" | "admin" }, token?: string | null) {
  return serverFetch(`/customers/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
    requireAuth: true,
  });
}

export async function deleteStaffMemberAction(id: string, token?: string | null) {
  return serverFetch(`/customers/staff/${id}`, {
    method: "DELETE",
    token,
    requireAuth: true,
  });
}
