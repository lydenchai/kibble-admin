"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCouponsAction, deleteCouponAction } from "@/actions/marketing.actions";
import { FiPlus as FiPlusBase, FiTag as FiTagBase, FiTrash2 as FiTrash2Base, FiSearch as FiSearchBase } from "react-icons/fi";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

const FiPlus = FiPlusBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;
const FiTrash2 = FiTrash2Base as React.ElementType;
const FiSearch = FiSearchBase as React.ElementType;

export default function MarketingPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetchCouponsAction(page, limit);
      if (res.success) {
        setCoupons(res.data || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page, limit]);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(deleteTargetId);
      await deleteCouponAction(deleteTargetId);
      setCoupons(coupons.filter((c) => c._id !== deleteTargetId));
    } catch (err) {
      console.error("Failed to delete coupon", err);
    } finally {
      setIsDeleting(null);
      setDeleteTargetId(null);
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    (c.code || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.discountType || "").toLowerCase().includes(search.toLowerCase())
  );

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
        {/* Search Bar */}
        <div className="p-4.5 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/40">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search coupons by code or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium text-stone-900"
            />
          </div>
        </div>

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
              ) : filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs">🏷️</span>
                        <span className="text-sm font-mono font-bold text-stone-900 uppercase tracking-wider">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-900">
                      {coupon.type === "percentage" ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-medium text-stone-600">
                      {coupon.usageLimit ? `${coupon.usedCount || 0} / ${coupon.usageLimit}` : "Unlimited"}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-medium text-stone-500">
                      {coupon.expiry ? new Date(coupon.expiry).toLocaleDateString() : "No Expiry"}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          coupon.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setDeleteTargetId(coupon._id)}
                        disabled={isDeleting === coupon._id}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3 text-xl">
                        🏷️
                      </div>
                      <p className="text-base font-bold text-stone-900">No promo coupons found</p>
                      <p className="text-xs text-stone-400 mt-0.5 mb-4">No coupons match your search filter.</p>
                      <Link
                        href="/marketing/new"
                        className="px-4 py-2 bg-brand-50 text-brand-600 text-xs font-bold rounded-xl hover:bg-brand-100 transition-colors"
                      >
                        Create First Coupon
                      </Link>
                    </div>
                  </td>
                </tr>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Promo Coupon?"
        message="Are you sure you want to delete this coupon code? Customers will no longer be able to redeem it."
        confirmText="Delete Coupon"
        variant="danger"
        isLoading={Boolean(isDeleting)}
      />
    </div>
  );
}
