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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-wide">
          Kibble Admin
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-[14px] ${
                isActive
                  ? "bg-slate-800 text-white font-medium shadow-sm"
                  : "hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-500"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-[14px] text-slate-400 hover:bg-red-500 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          <FiLogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
