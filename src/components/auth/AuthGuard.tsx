"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfileAction } from "@/actions/auth.actions";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [is_authenticated, setis_authenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setis_authenticated(false);
        router.push("/login");
        return;
      }

      try {
        const res = await fetchProfileAction(token);
        if (res.success && (res.data.user.role === 'admin' || res.data.user.role === 'staff')) {
          setis_authenticated(true);
        } else {
          setis_authenticated(false);
          localStorage.removeItem("accessToken");
          router.push("/login");
        }
      } catch {
        setis_authenticated(false);
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (is_authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  return is_authenticated ? <>{children}</> : null;
}
