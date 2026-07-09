"use client";

import { FiPieChart as FiPieChartBase } from "react-icons/fi";
const FiPieChart = FiPieChartBase as React.ElementType;

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-12 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FiPieChart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
        <p className="text-gray-500 text-center max-w-md">
          This section will contain detailed charts and reports for sales, inventory, and customer growth trends.
        </p>
      </div>
    </div>
  );
}
