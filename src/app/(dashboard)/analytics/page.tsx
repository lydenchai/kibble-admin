"use client";

import { FiPieChart as FiPieChartBase, FiTrendingUp } from "react-icons/fi";
const FiPieChart = FiPieChartBase as React.ElementType;

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">Deep dive into sales trends, customer acquisition, and inventory metrics</p>
        </div>
      </div>

      {/* Main Minimalist Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-12 sm:p-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 text-2xl shadow-xs">
          📊
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">Executive Analytics Suite</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Real-time multi-dimensional reports detailing revenue velocity, average order values, and category growth metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
