"use client";

import { FiSearch as FiSearchBase, FiBell as FiBellBase } from "react-icons/fi";

const FiSearch = FiSearchBase as React.ElementType;
const FiBell = FiBellBase as React.ElementType;

import { useNotifications } from "@/components/notifications/NotificationProvider";

export default function Header() {
  const { unreadCount, clearUnread } = useNotifications();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products, orders, or customers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={clearUnread}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
        >
          <FiBell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[10px] font-bold rounded-full border border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <div className="h-8 w-px bg-gray-200"></div>
        <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">
              Admin User
            </p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}
