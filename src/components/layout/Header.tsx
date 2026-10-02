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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 print:hidden">
      {/* Sidebar Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 transition-colors duration-150 cursor-pointer flex items-center justify-center border border-slate-200"
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
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors duration-150 border border-slate-200 uppercase tracking-wider"
        >
          <span>Storefront</span>
          <FiExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <div className="h-4 w-px bg-slate-200"></div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors duration-150 relative cursor-pointer border border-slate-200"
            aria-label="Notifications"
          >
            <FiBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 py-3 z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="px-4 pb-2.5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                  {allNotifications.length} Total
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {allNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    No new notifications
                  </div>
                ) : (
                  allNotifications.map((notif: Toast) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className="p-3.5 hover:bg-slate-50 transition-colors flex gap-3 items-start cursor-pointer group"
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1 block uppercase tracking-wider">
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
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="w-7 h-7 rounded-md bg-brand-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user.name?.slice(0, 2).toUpperCase() || "US"}
            </div>
            <div className="hidden md:block text-left pr-1">
              <span className="text-xs font-bold text-slate-900 leading-none block truncate max-w-[120px]">
                {user.name}
              </span>
              <span
                className={`text-[9px] font-semibold uppercase tracking-wider block mt-0.5 ${
                  user.role === "admin" ? "text-brand-600" : "text-emerald-600"
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
