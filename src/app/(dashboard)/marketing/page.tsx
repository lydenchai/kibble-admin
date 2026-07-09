"use client";

import { FiStar as FiStarBase, FiTag as FiTagBase } from "react-icons/fi";
const FiStar = FiStarBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;

export default function MarketingPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <FiTag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Discount Codes</h2>
              <p className="text-sm text-gray-500">Manage promotional coupons</p>
            </div>
          </div>
          <button className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            Manage Discounts
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <FiStar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Banners</h2>
              <p className="text-sm text-gray-500">Manage storefront banners</p>
            </div>
          </div>
          <button className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            Manage Banners
          </button>
        </div>
      </div>
    </div>
  );
}
