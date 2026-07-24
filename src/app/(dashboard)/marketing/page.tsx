"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus as FiPlusBase, FiTrash2 as FiTrash2Base, FiTag as FiTagBase } from "react-icons/fi";
import { fetchCouponsAction, deleteCouponAction } from "../../../actions/marketing.actions";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

const FiPlus = FiPlusBase as React.ElementType;
const FiTrash2 = FiTrash2Base as React.ElementType;
const FiTag = FiTagBase as React.ElementType;

export default function MarketingPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetchCouponsAction(page, limit, token);
      if (res.success) {
        setCoupons(res.data || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await deleteCouponAction(id, token);
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Marketing & Promotions</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Manage promotional coupon codes and customer discount offers</p>
        </div>
        <Link
          href="/marketing/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          <FiPlus className="w-4.5 h-4.5" />
          <span>Create Coupon</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Coupon Code</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Usage Limit</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-400 font-medium">
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3 text-xl">
                        🏷️
                      </div>
                      <p className="text-base font-bold text-stone-900">No active coupons</p>
                      <p className="text-xs text-stone-400 mt-0.5 mb-4">Create a promo code to offer checkout savings to customers.</p>
                      <Link href="/marketing/new" className="px-4 py-2 bg-brand-50 text-brand-600 text-xs font-bold rounded-xl hover:bg-brand-100 transition-colors">
                        Create Coupon
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap font-mono font-bold text-sm text-brand-600">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-900">
                      {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-stone-600">
                      {coupon.usedCount || 0} / {coupon.usageLimit || "∞"} used
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-stone-500">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-black rounded-full ${
                        coupon.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Expired / Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination */}
        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          itemLabel="coupons"
        />
      </div>
    </div>
  );
}
