import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AdminState {
  token: string | null;
  user: AdminUser | null;
  setAuth: (token: string | null, user?: AdminUser | null) => void;
  logout: () => void;
  // UI filter states
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      searchQuery: "",
      setAuth: (token, user = null) => {
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("accessToken", token);
          } else {
            localStorage.removeItem("accessToken");
          }
        }
        set({ token, user });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({ token: null, user: null, searchQuery: "" });
      },
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "kibble-admin-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
