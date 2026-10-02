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
import { Package, Dog } from "lucide-react";

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
      } bg-white text-slate-800 flex flex-col h-screen sticky top-0 border-r border-slate-200 z-20 transition-all duration-200 ease-in-out print:hidden`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 justify-between overflow-hidden">
        <Link href="/" className="flex items-center gap-3 group w-full justify-start">
          <div className="w-9 h-9 rounded-lg bg-brand-500 text-white flex items-center justify-center shrink-0">
            <Dog className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="text-sm font-bold text-slate-900 tracking-tight block truncate">
                Kibble Admin
              </span>
              <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider block">
                {isStaff ? "Staff Workspace" : "Workspace"}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const is_active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon as any;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs rounded-lg transition-colors duration-150 ${
                collapsed ? "justify-center px-0" : ""
              } ${
                is_active
                  ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200/80'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1 rounded-md transition-colors ${is_active ? 'text-brand-600' : 'text-slate-500'}`}>
                <Icon className="w-4 h-4"/>
              </div>
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150 cursor-pointer ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="uppercase tracking-wider">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
