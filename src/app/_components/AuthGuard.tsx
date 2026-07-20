"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfileAction } from "../../actions/auth.actions";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsAuthenticated(false);
        router.push("/login");
        return;
      }

      try {
        // Ping the /profile endpoint to verify the token is valid
        const res = await fetchProfileAction(token);
        if (res.success && (res.data.user.role === 'admin' || res.data.user.role === 'staff')) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("accessToken");
          router.push("/login");
        }
      } catch {
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
