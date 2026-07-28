import { AdminUser } from "./admin-user";

export interface AdminState {
  token: string | null;
  user: AdminUser | null;
  searchQuery: string;
  setAuth: (token: string | null, user?: AdminUser | null) => void;
  logout: () => void;
  setSearchQuery: (query: string) => void;
}
