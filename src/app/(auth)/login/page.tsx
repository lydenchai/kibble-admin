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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/40 via-stone-50 to-orange-50/20 p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="w-96 h-96 bg-amber-500/15 rounded-full blur-3xl absolute -top-20 -left-20 pointer-events-none" />
      <div className="w-96 h-96 bg-orange-500/15 rounded-full blur-3xl absolute -bottom-20 -right-20 pointer-events-none" />

      {/* Login Card */}
      <div className="max-w-md w-full glass-panel bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-xl border border-white/90 space-y-8 relative z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-brand-500 to-orange-600 text-white text-2xl font-black shadow-lg shadow-brand-600/20 border border-white/40">
            <Dog className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Sign in to Kibble Admin
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
              Enter your admin account credentials to access management tools
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 glass-pill bg-rose-50/90 border border-rose-200/80 text-rose-700 text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              className="block text-xs font-black text-stone-700 uppercase tracking-widest mb-2"
              htmlFor="email-address"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition-colors" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-stone-50/60 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-stone-900"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative group">
              <Lock className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition-colors" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-11 py-3 bg-stone-50/60 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-stone-900"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
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
        <div className="pt-4 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-400 font-medium">
            Kibble E-Commerce Administrative System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
