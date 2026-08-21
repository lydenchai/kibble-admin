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
      <div className="flex min-h-screen bg-stone-50/90 text-stone-900 relative overflow-hidden font-sans selection:bg-brand-500 selection:text-white">
        {/* Ambient Glow Decorative Blobs */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200/20 to-brand-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/15 to-rose-200/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <Sidebar collapsed={isSidebarCollapsed} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
