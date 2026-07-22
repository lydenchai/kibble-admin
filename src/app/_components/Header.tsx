"use client";
import { useState, useEffect, useRef } from "react";

import { FiSearch as FiSearchBase, FiBell as FiBellBase } from "react-icons/fi";

const FiSearch = FiSearchBase as React.ElementType;
const FiBell = FiBellBase as React.ElementType;

import { useNotifications } from "@/components/notifications/NotificationProvider";

export default function Header() {
  const { unreadCount, clearUnread, allNotifications } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
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
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products, orders, or customers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative cursor-pointer"
          >
            <FiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[10px] font-bold rounded-full border border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transform origin-top-right transition-all">
              <div className="px-4 py-2 border-b border-gray-50">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {allNotifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    No new notifications.
                  </div>
                ) : (
                  allNotifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                      <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="h-8 w-px bg-gray-200/50"></div>
        <button className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-200/50 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-brand-400 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm shadow-brand-500/20">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              Admin User
            </p>
            <p className="text-[11px] font-medium text-brand-600 uppercase tracking-wider">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}
