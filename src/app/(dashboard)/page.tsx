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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-stone-500 text-sm sm:text-base mt-1">
            Real-time business performance and operational analytics
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Metrics Active
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              ${data.metrics.totalRevenue.toFixed(2)}
            </span>
            <span className="inline-flex items-center text-xs font-extrabold text-emerald-600 gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
              Active Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {data.metrics.activeOrdersCount}
            </span>
            <span className="text-xs text-stone-400 font-semibold">Processing</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {data.metrics.totalCustomers}
            </span>
            <span className="text-xs text-stone-400 font-semibold">Verified Accounts</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
              {data.metrics.lowStockCount}
            </span>
            <span className="text-xs text-rose-500 font-bold">Needs Restock</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-stone-900">Revenue Breakdown</h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">Daily income over the last 7 days</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status Donut Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="mb-6">
            <h3 className="text-lg font-black text-stone-900">Orders Status Distribution</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">Ratio of active and completed order statuses</p>
          </div>
          <div className="h-72 flex flex-col justify-between">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={data.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="_id"
                >
                  {data.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 flex-wrap pb-2">
              {data.ordersByStatus.map((entry, index) => (
                <div key={entry._id} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                  <span className="text-xs font-bold text-stone-700 capitalize">{entry._id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Bar Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="mb-6">
          <h3 className="text-lg font-black text-stone-900">Top Selling Products</h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">Most ordered items across storefront</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12 }} width={160} />
              <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9' }} />
              <Bar dataKey="totalSold" fill="#ea580c" radius={[0, 6, 6, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
