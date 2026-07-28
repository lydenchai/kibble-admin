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

const FiBell = FiBellBase as React.ElementType;
const FiExternalLink = FiExternalLinkBase as React.ElementType;
const FiMenu = FiMenuBase as React.ElementType;
const FiSidebar = FiSidebarBase as React.ElementType;

export default function Header({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
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

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between px-6 sticky top-0 z-10 print:hidden">
      {/* Sidebar Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center border border-stone-200/60"
        >
          {isSidebarCollapsed ? (
            <FiMenu className="w-5 h-5" />
          ) : (
            <FiSidebar className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Storefront Button */}
        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold rounded-full transition-colors"
        >
          <span>Storefront</span>
          <FiExternalLink className="w-3.5 h-3.5 text-stone-500" />
        </a>

        <div className="h-4 w-px bg-stone-200"></div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-2.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-100 py-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 pb-3 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-extrabold text-stone-900 text-sm">Notifications</h3>
                <span className="text-[11px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                  {allNotifications.length} Total
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-stone-50">
                {allNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-400 font-medium">
                    No new notifications
                  </div>
                ) : (
                  allNotifications.map((notif: Toast) => (
                    <div
                      key={notif.id}
                      className="p-3.5 hover:bg-stone-50/80 transition-colors flex gap-3 items-start cursor-pointer"
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 leading-snug">{notif.title}</p>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-stone-400 font-medium mt-1 block">
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200/80 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-amber-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
              {user.name?.slice(0, 2).toUpperCase() || "US"}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-stone-900 leading-none block truncate max-w-[120px]">
                {user.name}
              </span>
              <span
                className={`text-[9px] font-extrabold uppercase tracking-wider block ${
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
