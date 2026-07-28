import { AdminState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      search_query: "",
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
        set({ token: null, user: null, search_query: "" });
      },
      setSearchQuery: (query) => set({ search_query: query }),
    }),
    {
      name: "kibble-admin-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
