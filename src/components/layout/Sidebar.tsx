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
import { logoutAction } from "@/actions/auth.actions";
import { SidebarProps } from "@/types/components";
import { useAdminStore } from "@/store/useAdminStore";

const FiHome = FiHomeBase as React.ElementType;
const FiBox = FiBoxBase as React.ElementType;
const FiShoppingCart = FiShoppingCartBase as React.ElementType;
const FiUsers = FiUsersBase as React.ElementType;
const FiPieChart = FiPieChartBase as React.ElementType;
const FiSettings = FiSettingsBase as React.ElementType;
const FiStar = FiStarBase as React.ElementType;
const LogOut = FiLogOutBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;

const navItems = [
  { name: "Overview", href: "/", icon: FiHome },
  { name: "Products", href: "/products", icon: FiBox },
  { name: "Categories", href: "/categories", icon: FiTag },
  { name: "Orders", href: "/orders", icon: FiShoppingCart },
  { name: "Customers", href: "/customers", icon: FiUsers },
  { name: "Staff & Team", href: "/staff", icon: FiUsers },
  { name: "Marketing", href: "/marketing", icon: FiStar },
  { name: "Analytics", href: "/analytics", icon: FiPieChart },
  { name: "Audit Logs", href: "/audit-logs", icon: FiPieChart },
  { name: "Settings", href: "/settings", icon: FiSettings },
];

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAdminStore((s) => s.user);

  const isStaff = user?.role === "staff";
  const adminOnlyPaths = ["/customers", "/staff", "/audit-logs", "/settings"];
  const visibleNavItems = navItems.filter((item) => !isStaff || !adminOnlyPaths.includes(item.href));

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
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white text-stone-800 flex flex-col h-screen sticky top-0 border-r border-stone-200/80 z-20 transition-all duration-300 ease-in-out print:hidden`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-stone-100 justify-between overflow-hidden">
        <Link href="/" className="flex items-center gap-3 group w-full justify-start">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-brand-600 text-white flex items-center justify-center text-base font-black shadow-xs group-hover:scale-105 transition-transform shrink-0">
            🐾
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="text-base font-black text-stone-900 tracking-tight block truncate">
                Kibble Admin
              </span>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block -mt-0.5">
                {isStaff ? "Staff Workspace" : "Workspace"}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon as any;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                collapsed ? "justify-center px-0" : ""
              } ${
                isActive
                  ? "bg-brand-50 text-brand-600 font-extrabold shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 font-semibold"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? "text-brand-600" : "text-stone-400 group-hover:text-stone-700"
                }`}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-stone-100">
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-bold text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
