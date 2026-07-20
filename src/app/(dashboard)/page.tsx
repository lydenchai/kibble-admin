"use client";
import { useEffect, useState } from "react";
import { fetchDashboardAnalyticsAction } from "../../actions/analytics.actions";


interface DashboardData {
  metrics: {
    totalRevenue: number;
    activeOrdersCount: number;
    totalCustomers: number;
    lowStockCount: number;
  };
  revenueByDay: { _id: string; revenue: number; orders: number }[];
  topProducts: { name: string; totalSold: number; revenue: number }[];
  ordersByStatus: { _id: string; count: number }[];
  lowStockProducts: { name: string; variants: unknown[] }[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetchDashboardAnalyticsAction(token);
        if (res.success) {
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

  if (loading)
    return (
      <div className="p-8">Loading dashboard data...</div>
    );

  if (!data)
    return (
      <div className="p-8">Failed to load dashboard data.</div>
    );

  return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        {/* Render your charts and widgets based on `data` */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Revenue
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              ${data.metrics.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Active Orders
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {data.metrics.activeOrdersCount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Customers
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {data.metrics.totalCustomers}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Low Stock Alerts
            </h3>
            <p className="text-2xl font-bold text-red-600">
              {data.metrics.lowStockCount}
            </p>
          </div>
        </div>
      </div>
  );
}
