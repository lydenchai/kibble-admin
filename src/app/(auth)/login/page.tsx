'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.actions";
import { EyeOff, Eye, Mail, Lock, ShieldCheck, Dog } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth.schema";
import { useAdminStore } from "@/store/useAdminStore";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAdminStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("expired=true")) {
      setError("Your admin session has expired. Please log in again.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Zod Validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid credentials format");
      return;
    }

    setLoading(true);

    try {
      const response = await loginAction({ email, password });

      if (response.success && response.data?.accessToken) {
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
          localStorage.setItem("admin_refresh_token", response.data.refresh_token);
        }
        setAuth(response.data.accessToken, response.data.user);
        router.push("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 font-sans">
      {/* Login Card */}
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl border border-slate-200 space-y-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-600 text-white font-bold">
            <Dog className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sign in to Kibble Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Enter your admin credentials to access the management portal
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              htmlFor="email-address"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition-colors" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500 transition-colors text-slate-900 placeholder:text-slate-400"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition-colors" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500 transition-colors text-slate-900 placeholder:text-slate-400"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
            leftIcon={<ShieldCheck className="w-5 h-5" />}
          >
            Sign in to Dashboard
          </Button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Kibble E-Commerce Administrative System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
