"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import toast from "react-hot-toast";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAdminStore((s) => s.user);

  useEffect(() => {
    if (user && user.role === "staff") {
      toast.error("Access denied. Administrator privileges required.");
      router.push("/");
    }
  }, [user, router]);

  if (user?.role === "staff") {
    return (
      <div className="p-12 text-center text-stone-500 font-bold text-sm">
        Access denied. Redirecting to dashboard...
      </div>
    );
  }

  return <>{children}</>;
}
