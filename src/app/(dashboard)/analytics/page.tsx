'use client';

import { PieChart, TrendingUp, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
            <PieChart className="w-3.5 h-3.5 text-brand-600" />
            <span>Business Intelligence</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Deep dive into sales trends, customer acquisition, and inventory metrics</p>
        </div>
      </div>

      {/* Main Flat Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-12 sm:p-16 flex flex-col items-center justify-center text-center space-y-5">
        <div className="w-14 h-14 rounded-lg bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center">
          <BarChart3 className="w-7 h-7 text-brand-600" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Analytics Suite</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Real-time multi-dimensional reports detailing revenue velocity, average order values, and category growth metrics.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Automated Daily Insights Active</span>
        </div>
      </div>
    </div>
  );
}
