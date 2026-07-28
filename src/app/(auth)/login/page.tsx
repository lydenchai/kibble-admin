"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.actions";
import { EyeOff, Eye, Mail, Lock, ShieldCheck } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth.schema";
import { useAdminStore } from "@/store/useAdminStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAdminStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30 p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="w-96 h-96 bg-brand-500/10 rounded-full blur-3xl absolute -top-20 -left-20 pointer-events-none" />
      <div className="w-96 h-96 bg-amber-500/10 rounded-full blur-3xl absolute -bottom-20 -right-20 pointer-events-none" />

      {/* Login Card */}
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl shadow-stone-900/5 border border-stone-200/80 space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-brand-600 text-white text-2xl font-black shadow-md shadow-brand-600/20">
            🐾
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
            <div className="p-4 bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2"
              htmlFor="email-address"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition-colors" />
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl py-3.5 text-sm shadow-md shadow-brand-600/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>{loading ? "Signing in..." : "Sign in to Dashboard"}</span>
          </button>
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
