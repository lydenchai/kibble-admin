'use client';

import { PieChart, TrendingUp, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill bg-brand-50 text-brand-700 text-xs font-extrabold mb-2 border border-brand-100 shadow-xs">
            <PieChart className="w-3.5 h-3.5 text-brand-600" />
            <span>Business Intelligence</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1 font-medium">Deep dive into sales trends, customer acquisition, and inventory metrics</p>
        </div>
      </div>

      {/* Main Glass Panel */}
      <div className="glass-panel bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/90 p-12 sm:p-16 flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 via-brand-500 to-orange-600 text-white flex items-center justify-center shadow-lg border border-white/40">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">Executive Analytics Suite</h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-medium">
            Real-time multi-dimensional reports detailing revenue velocity, average order values, and category growth metrics.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-pill bg-emerald-500/10 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200/80 shadow-xs">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Automated Daily Insights Active</span>
        </div>
      </div>
    </div>
  );
}
