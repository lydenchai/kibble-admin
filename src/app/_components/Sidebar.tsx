"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome as FiHomeBase,
  FiBox as FiBoxBase,
  FiShoppingCart as FiShoppingCartBase,
  FiUsers as FiUsersBase,
  FiPieChart as FiPieChartBase,
  FiSettings as FiSettingsBase,
  FiStar as FiStarBase,
  FiLogOut as FiLogOutBase,
  FiTag as FiTagBase,
} from "react-icons/fi";
import { apiClient } from "../../lib/apiClient";
import { useRouter } from "next/navigation";
import { logoutAction } from "../../actions/auth.actions";

const FiHome = FiHomeBase as React.ElementType;
const FiBox = FiBoxBase as React.ElementType;
const FiShoppingCart = FiShoppingCartBase as React.ElementType;
const FiUsers = FiUsersBase as React.ElementType;
const FiPieChart = FiPieChartBase as React.ElementType;
const FiSettings = FiSettingsBase as React.ElementType;
const FiStar = FiStarBase as React.ElementType;
const FiLogOut = FiLogOutBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;

const navItems = [
  { name: "Dashboard", href: "/", icon: FiHome },
  { name: "Products", href: "/products", icon: FiBox },
  { name: "Categories", href: "/categories", icon: FiTag },
  { name: "Orders", href: "/orders", icon: FiShoppingCart },
  { name: "Customers", href: "/customers", icon: FiUsers },
  { name: "Marketing", href: "/marketing", icon: FiStar },
  { name: "Analytics", href: "/analytics", icon: FiPieChart },
  { name: "Audit Logs", href: "/audit-logs", icon: FiPieChart },
  { name: "Settings", href: "/settings", icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await logoutAction(token);
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("accessToken");
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 bg-[#0B1120] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/50 shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-transparent"></div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-wide relative z-10 flex items-center gap-2">
          <FiStar className="w-5 h-5 text-brand-500" /> Kibble Admin
        </span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium group relative overflow-hidden ${
                isActive
                  ? "text-white shadow-lg shadow-brand-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 opacity-90"></div>
              )}
              <item.icon
                className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                  isActive ? "text-white" : "text-slate-500 group-hover:text-brand-400 group-hover:scale-110"
                }`}
              />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 cursor-pointer group"
        >
          <FiLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
