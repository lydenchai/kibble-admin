"use client";

import { useEffect, useState } from "react";
import { fetchDashboardAnalyticsAction } from "@/actions/analytics.actions";
import { DashboardData } from "@/types/dashboard-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp } from "lucide-react";

const PIE_COLORS = ['#ea580c', '#f59e0b', '#10b981', '#6366f1', '#ec4899'];

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetchDashboardAnalyticsAction(token);
        if (res && res.success && res.data) {
          setData(res.data);
        } else {
          setData(null);
        }
      } catch (err: unknown) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-stone-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200/80 h-36"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200/80 h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center text-stone-500 font-medium">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill bg-amber-50 text-amber-700 text-xs font-extrabold mb-2 border border-amber-200/80 shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Executive Dashboard</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-stone-500 text-sm sm:text-base mt-1 font-medium">
            Real-time business performance and operational analytics
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-pill bg-emerald-500/10 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200/80 shadow-xs self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Metrics Active
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="glass-card bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/90 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Total Revenue
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md border border-white/40">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              ${data.metrics.total_revenue.toFixed(2)}
            </span>
            <span className="inline-flex items-center text-xs font-black text-emerald-600 glass-pill bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="glass-card bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/90 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Active Orders
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-brand-600 text-white flex items-center justify-center shadow-md border border-white/40">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {data.metrics.active_orders_count}
            </span>
            <span className="text-xs text-amber-700 font-extrabold glass-pill bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Processing
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="glass-card bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/90 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Total Customers
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md border border-white/40">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {data.metrics.total_customers}
            </span>
            <span className="text-xs text-indigo-700 font-extrabold glass-pill bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
              Verified
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-card bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/90 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Low Stock Alerts
            </span>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md border border-white/40">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
              {data.metrics.low_stock_count}
            </span>
            <span className="text-xs text-rose-600 font-black glass-pill bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
              Needs Restock
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="glass-panel bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-stone-900 tracking-tight">Revenue Breakdown</h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">Daily income over the last 7 days</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue_by_day}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip
                  cursor={{ stroke: '#f97316', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={3.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status Donut Chart */}
        <div className="glass-panel bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="mb-6">
            <h3 className="text-lg font-black text-stone-900 tracking-tight">Orders Status Distribution</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">Ratio of active and completed order statuses</p>
          </div>
          <div className="h-72 flex flex-col justify-between">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={data.orders_by_status}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="_id"
                >
                  {data.orders_by_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255,255,255,0.9)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 flex-wrap pb-2">
              {data.orders_by_status.map((entry, index) => (
                <div key={entry._id} className="flex items-center gap-1.5 glass-pill px-3 py-1 rounded-full border border-stone-200/60 bg-white/60">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                  <span className="text-xs font-extrabold text-stone-700 capitalize">{entry._id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Bar Chart */}
      <div className="glass-panel bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-sm relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
        <div className="mb-6">
          <h3 className="text-lg font-black text-stone-900 tracking-tight">Top Selling Products</h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">Most ordered items across storefront</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.top_products} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12, fontWeight: 600 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#1c1917', fontSize: 12, fontWeight: 700 }} width={160} />
              <RechartsTooltip cursor={{ fill: 'rgba(251, 146, 60, 0.08)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255,255,255,0.9)' }} />
              <Bar dataKey="totalSold" fill="#ea580c" radius={[0, 8, 8, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
