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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
            <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
            <span>Executive Dashboard</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-normal">
            Real-time business performance and operational analytics
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Live Metrics Active
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              ${data.metrics.total_revenue.toFixed(2)}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 gap-1">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Orders
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {data.metrics.active_orders_count}
            </span>
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Processing
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {data.metrics.total_customers}
            </span>
            <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Verified
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-rose-600 tracking-tight">
              {data.metrics.low_stock_count}
            </span>
            <span className="text-xs text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Needs Restock
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Revenue Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Daily income over the last 7 days</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue_by_day}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip
                  cursor={{ stroke: '#ea580c', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status Donut Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Orders Status Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Ratio of active and completed order statuses</p>
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
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 flex-wrap pb-2">
              {data.orders_by_status.map((entry, index) => (
                <div key={entry._id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                  <span className="text-xs font-semibold text-slate-700 capitalize">{entry._id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Bar Chart */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Top Selling Products</h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Most ordered items across storefront</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.top_products} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 600 }} width={160} />
              <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontSize: '12px' }} />
              <Bar dataKey="totalSold" fill="#ea580c" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
