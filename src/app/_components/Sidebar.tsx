"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

const FiHome = FiHomeBase as React.ElementType;
const FiBox = FiBoxBase as React.ElementType;
const FiShoppingCart = FiShoppingCartBase as React.ElementType;
const FiUsers = FiUsersBase as React.ElementType;
const FiPieChart = FiPieChartBase as React.ElementType;
const FiSettings = FiSettingsBase as React.ElementType;
const FiStar = FiStarBase as React.ElementType;
const FiLogOut = FiLogOutBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;
import { logoutAction } from "../../actions/auth.actions";

const navItems = [
  { name: "Overview", href: "/", icon: FiHome },
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
    <aside className="w-64 bg-white text-stone-800 flex flex-col h-screen sticky top-0 border-r border-stone-200/80 z-20">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-stone-100 justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-brand-600 text-white flex items-center justify-center text-base font-black shadow-xs group-hover:scale-105 transition-transform">
            🐾
          </div>
          <div>
            <span className="text-base font-black text-stone-900 tracking-tight block">
              Kibble Admin
            </span>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block -mt-0.5">
              Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2.5 text-xs font-extrabold uppercase tracking-widest text-stone-400">
          Management
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon as any;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm cursor-pointer ${
                isActive
                  ? "bg-brand-50 text-brand-600 font-extrabold border border-brand-200/80 shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 font-semibold"
              }`}
            >
              <Icon
                className={`w-4.5 h-4.5 transition-colors ${
                  isActive ? "text-brand-600" : "text-stone-400 group-hover:text-stone-700"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-stone-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-bold text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <FiLogOut className="w-4.5 h-4.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
