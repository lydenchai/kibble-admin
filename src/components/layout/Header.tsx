"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiBell as FiBellBase,
  FiExternalLink as FiExternalLinkBase,
  FiMenu as FiMenuBase,
  FiSidebar as FiSidebarBase,
} from "react-icons/fi";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { HeaderProps } from "@/types/components";
import { Toast } from "@/types/toast";
import { useAdminStore } from "@/store/useAdminStore";

import { useRouter } from "next/navigation";

const FiBell = FiBellBase as React.ElementType;
const FiExternalLink = FiExternalLinkBase as React.ElementType;
const FiMenu = FiMenuBase as React.ElementType;
const FiSidebar = FiSidebarBase as React.ElementType;

export default function Header({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  const router = useRouter();
  const user = useAdminStore((s) => s.user);
  const { unreadCount, clearUnread, allNotifications } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    if (!isDropdownOpen && unreadCount > 0) {
      clearUnread();
    }
  };

  const handleNotifClick = (notif: Toast) => {
    setIsDropdownOpen(false);
    if (notif.order_id) {
      router.push(`/orders/${notif.order_id}`);
    } else if (notif.link) {
      router.push(notif.link);
    } else {
      router.push("/orders");
    }
  };

  return (
    <header className="h-16 bg-white/70 backdrop-blur-2xl border-b border-white/90 flex items-center justify-between px-6 sticky top-0 z-10 print:hidden relative shadow-[0_4px_20px_-8px_rgba(0,0,0,0.02)]">
      {/* Specular sheen highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none" />

      {/* Sidebar Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2.5 rounded-2xl text-stone-600 hover:text-stone-900 glass-pill bg-white/80 hover:bg-white transition-all duration-200 cursor-pointer flex items-center justify-center border border-white/90 shadow-xs"
        >
          {isSidebarCollapsed ? (
            <FiMenu className="w-4 h-4" />
          ) : (
            <FiSidebar className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Storefront Button */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 glass-pill bg-white/80 hover:bg-brand-50 hover:text-brand-600 text-stone-700 text-xs font-extrabold rounded-full transition-all duration-200 border border-white/90 shadow-xs uppercase tracking-wider"
        >
          <span>Storefront</span>
          <FiExternalLink className="w-3.5 h-3.5 text-stone-400" />
        </a>

        <div className="h-4 w-px bg-stone-200/80"></div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-2.5 text-stone-600 hover:text-stone-900 glass-pill bg-white/80 hover:bg-white rounded-full transition-all duration-200 relative cursor-pointer border border-white/90 shadow-xs"
            aria-label="Notifications"
          >
            <FiBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/90 py-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 pb-3 border-b border-stone-100/80 flex justify-between items-center">
                <h3 className="font-black text-stone-900 text-sm tracking-tight">Notifications</h3>
                <span className="text-[10px] font-extrabold glass-pill bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-100">
                  {allNotifications.length} Total
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-stone-100/60">
                {allNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400 font-semibold">
                    No new notifications
                  </div>
                ) : (
                  allNotifications.map((notif: Toast) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className="p-4 hover:bg-amber-50/40 transition-colors flex gap-3 items-start cursor-pointer group"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-1 shrink-0 group-hover:scale-125 transition-transform shadow-xs" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-stone-900 leading-snug group-hover:text-brand-600 transition-colors">{notif.title}</p>
                        <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-stone-400 font-bold mt-1 block uppercase tracking-wider">
                          {(notif as any).time || "Just now"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Profile Badge */}
        {user && (
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 glass-pill bg-white/80 border border-white/90 rounded-full shadow-xs">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 via-amber-500 to-orange-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 shadow-xs border border-white/40">
              {user.name?.slice(0, 2).toUpperCase() || "US"}
            </div>
            <div className="hidden md:block text-left pr-1">
              <span className="text-xs font-black text-stone-900 leading-none block truncate max-w-[120px]">
                {user.name}
              </span>
              <span
                className={`text-[9px] font-black uppercase tracking-widest block mt-0.5 ${
                  user.role === "admin" ? "text-purple-600" : "text-emerald-600"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
