"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch as FiSearchBase, FiBell as FiBellBase, FiExternalLink as FiExternalLinkBase } from "react-icons/fi";

const FiSearch = FiSearchBase as React.ElementType;
const FiBell = FiBellBase as React.ElementType;
const FiExternalLink = FiExternalLinkBase as React.ElementType;
import { useNotifications } from "@/components/notifications/NotificationProvider";

export default function Header() {
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
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 group-focus-within:text-stone-900 transition-colors" />
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full pl-9 pr-4 py-2 bg-stone-100/60 border border-transparent rounded-full text-sm font-medium focus:outline-none focus:bg-white focus:border-stone-300 transition-all text-stone-800"
          />
        </div>
      </div>

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
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Notifications</h3>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  {allNotifications.length}
                </span>
              </div>
              <div className="max-h-[260px] overflow-y-auto space-y-1 mt-1">
                {allNotifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-stone-400 text-sm">
                    No new notifications
                  </div>
                ) : (
                  allNotifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-stone-50 rounded-xl transition-colors border-b border-stone-50 last:border-0">
                      <h4 className="text-sm font-bold text-stone-900">{n.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-stone-200"></div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-brand-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
            A
          </div>
          <span className="text-sm font-bold text-stone-800 hidden sm:inline-block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
