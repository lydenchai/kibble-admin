"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
        <Sidebar collapsed={isSidebarCollapsed} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
          <main className="flex-1 overflow-y-auto bg-slate-50">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
