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
      } bg-white/80 backdrop-blur-2xl text-stone-800 flex flex-col h-screen sticky top-0 border-r border-white/90 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.03)] z-20 transition-all duration-300 ease-in-out print:hidden`}
    >
      {/* Specular sheen highlight border line */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-white/90 via-amber-200/30 to-transparent pointer-events-none" />

      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-stone-200/50 justify-between overflow-hidden relative">
        <Link href="/" className="flex items-center gap-3 group w-full justify-start">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-brand-500 to-orange-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300 shrink-0 border border-white/40">
            <Dog className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="text-base font-black text-stone-900 tracking-tight block truncate">
                Kibble Admin
              </span>
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block -mt-0.5">
                {isStaff ? "Staff Workspace" : "Workspace"}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
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
              className={`flex items-center gap-3 px-3 py-3 text-xs font-bold rounded-2xl transition-all duration-200 ${
                collapsed ? "justify-center px-0" : ""
              } ${
                is_active
                  ? 'glass-pill bg-gradient-to-r from-brand-500/10 via-amber-500/10 to-transparent text-brand-600 border border-brand-200/80 shadow-xs font-black'
                  : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${is_active ? 'bg-brand-500 text-white shadow-xs' : 'text-stone-500 group-hover:text-stone-800'}`}>
                <Icon className="w-4 h-4"/>
              </div>
              {!collapsed && <span className="truncate tracking-wide">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-stone-200/50">
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-3 px-3.5 py-2.5 w-full rounded-2xl text-xs font-extrabold text-stone-500 hover:bg-rose-50/80 hover:text-rose-600 border border-transparent hover:border-rose-200/60 transition-all duration-200 cursor-pointer ${
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
