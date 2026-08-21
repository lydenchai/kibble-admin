"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  fetchCouponsAction,
  deleteCouponAction,
  updateCouponAction,
} from "@/actions/marketing.actions";
import {
  FiPlus as FiPlusBase,
  FiTag as FiTagBase,
  FiTrash2 as FiTrash2Base,
  FiSearch as FiSearchBase,
  FiCopy as FiCopyBase,
  FiCheck as FiCheckBase,
  FiPercent as FiPercentBase,
  FiDollarSign as FiDollarSignBase,
  FiClock as FiClockBase,
  FiTrendingUp as FiTrendingUpBase,
  FiToggleLeft as FiToggleLeftBase,
  FiToggleRight as FiToggleRightBase,
} from "react-icons/fi";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const FiPlus = FiPlusBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;
const FiTrash2 = FiTrash2Base as React.ElementType;
const FiSearch = FiSearchBase as React.ElementType;
const FiCopy = FiCopyBase as React.ElementType;
const FiCheck = FiCheckBase as React.ElementType;
const FiPercent = FiPercentBase as React.ElementType;
const FiDollarSign = FiDollarSignBase as React.ElementType;
const FiClock = FiClockBase as React.ElementType;
const FiTrendingUp = FiTrendingUpBase as React.ElementType;
const FiToggleLeft = FiToggleLeftBase as React.ElementType;
const FiToggleRight = FiToggleRightBase as React.ElementType;

export default function MarketingPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "percentage" | "fixed" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

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
      toast.error("Failed to load promo coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page, limit]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (coupon: any) => {
    try {
      setTogglingId(coupon._id);
      const newStatus = !coupon.is_active;
      const updated = await updateCouponAction(coupon._id, { is_active: newStatus });
      setCoupons((prev) =>
        prev.map((c) => (c._id === coupon._id ? { ...c, is_active: updated.is_active } : c))
      );
      toast.success(`Coupon "${coupon.code}" ${newStatus ? "activated" : "disabled"}`);
    } catch (err: any) {
      console.error("Failed to toggle coupon status:", err);
      toast.error(err?.message || "Failed to update coupon status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(deleteTargetId);
      await deleteCouponAction(deleteTargetId);
      setCoupons(coupons.filter((c) => c._id !== deleteTargetId));
      toast.success("Promo coupon deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete coupon", err);
      toast.error(err?.message || "Failed to delete coupon");
    } finally {
      setIsDeleting(null);
      setDeleteTargetId(null);
    }
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const activeCount = coupons.filter((c) => c.is_active).length;
    const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
    const expiredCount = coupons.filter(
      (c) => c.expiry && new Date(c.expiry) < new Date()
    ).length;
    const percentageCount = coupons.filter((c) => (c.type || c.discountType) === "percentage").length;

    return {
      total: coupons.length,
      active: activeCount,
      redemptions: totalRedemptions,
      expired: expiredCount,
      percentageCount,
    };
  }, [coupons]);

  // Filtered list based on search and tab selection
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const codeMatch = (c.code || "").toLowerCase().includes(search.toLowerCase());
      const typeMatch = (c.type || c.discountType || "").toLowerCase().includes(search.toLowerCase());
      const matchesSearch = codeMatch || typeMatch;

      const isExpired = c.expiry && new Date(c.expiry) < new Date();

      if (!matchesSearch) return false;

      if (activeTab === "active") return c.is_active && !isExpired;
      if (activeTab === "percentage") return (c.type || c.discountType) === "percentage";
      if (activeTab === "fixed") return (c.type || c.discountType) === "fixed";
      if (activeTab === "inactive") return !c.is_active || isExpired;

      return true;
    });
  }, [coupons, search, activeTab]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Marketing & Promotions
          </h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">
            Manage promotional coupon codes, discounts, and customer incentives
          </p>
        </div>
        <Link href="/marketing/new">
          <Button variant="primary" size="md" leftIcon={<FiPlus className="w-4.5 h-4.5" />}>
            Create Coupon
          </Button>
        </Link>
      </div>

      {/* Stat Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/90 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-brand-600 text-white flex items-center justify-center font-bold shadow-md border border-white/40 shrink-0">
            <FiTag className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Active Coupons</p>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5 tracking-tight">{metrics.active}</h3>
          </div>
        </div>

        <div className="glass-card bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/90 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md border border-white/40 shrink-0">
            <FiTrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Redemptions</p>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5 tracking-tight">{metrics.redemptions}</h3>
          </div>
        </div>

        <div className="glass-card bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/90 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md border border-white/40 shrink-0">
            <FiPercent className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Percentage Off</p>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5 tracking-tight">{metrics.percentageCount}</h3>
          </div>
        </div>

        <div className="glass-card bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/90 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold shadow-md border border-white/40 shrink-0">
            <FiClock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Expired / Disabled</p>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5 tracking-tight">{metrics.expired}</h3>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="glass-panel bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/90 overflow-hidden flex flex-col relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
        {/* Toolbar & Filter Tabs */}
        <div className="p-5 border-b border-stone-100/80 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-stone-50/30 shrink-0">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 glass-pill bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/60 shadow-xs">
            {[
              { id: "all", label: "All Coupons" },
              { id: "active", label: "Active Only" },
              { id: "percentage", label: "% Percentage" },
              { id: "fixed", label: "$ Fixed" },
              { id: "inactive", label: "Inactive / Expired" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-stone-900 shadow-xs border border-stone-200/80"
                    : "text-stone-500 hover:text-stone-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search code or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-2xl text-xs font-bold text-stone-900 placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/80 backdrop-blur-md sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">
                  Coupon Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">
                  Discount Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">
                  Usage Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-black text-stone-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-400 font-medium">
                    Loading promo coupons...
                  </td>
                </tr>
              ) : filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => {
                  const isExpired = coupon.expiry && new Date(coupon.expiry) < new Date();
                  const isPercentage = (coupon.type || coupon.discountType) === "percentage";
                  const usedCount = coupon.usedCount || 0;
                  const limitVal = coupon.usageLimit;
                  const usagePercentage = limitVal ? Math.min(100, Math.round((usedCount / limitVal) * 100)) : 0;

                  return (
                    <tr key={coupon._id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Coupon Code Pill */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/60 font-mono text-xs font-bold text-amber-900 tracking-widest uppercase">
                            <FiTag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{coupon.code}</span>
                          </div>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1.5 text-stone-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                            title="Copy code to clipboard"
                          >
                            {copiedCode === coupon.code ? (
                              <FiCheck className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <FiCopy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Discount Value */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black ${
                              isPercentage
                                ? "bg-brand-50 text-brand-700 border border-brand-200/60"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            }`}
                          >
                            {isPercentage ? <FiPercent className="w-3 h-3" /> : <FiDollarSign className="w-3 h-3" />}
                            <span>{isPercentage ? `${coupon.value}% OFF` : `$${Number(coupon.value).toFixed(2)} OFF`}</span>
                          </span>
                          {coupon.minOrderValue > 0 && (
                            <span className="text-[11px] text-stone-400 font-semibold">
                              (Min: ${Number(coupon.minOrderValue).toFixed(2)})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Usage Limit & Progress */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-40 space-y-1">
                          <div className="flex justify-between text-xs font-bold text-stone-700">
                            <span>{limitVal ? `${usedCount} / ${limitVal}` : `${usedCount} redeemed`}</span>
                            {limitVal && <span className="text-stone-400 text-[11px]">{usagePercentage}%</span>}
                          </div>
                          {limitVal && (
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 rounded-full ${
                                  usagePercentage >= 100
                                    ? "bg-rose-500"
                                    : usagePercentage > 75
                                    ? "bg-amber-500"
                                    : "bg-brand-500"
                                }`}
                                style={{ width: `${usagePercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Expiry Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <FiClock className={`w-3.5 h-3.5 ${isExpired ? "text-rose-500" : "text-stone-400"}`} />
                          <span className={isExpired ? "text-rose-600 font-bold" : "text-stone-700"}>
                            {coupon.expiry ? new Date(coupon.expiry).toLocaleDateString() : "No Expiry"}
                          </span>
                        </div>
                      </td>

                      {/* Interactive Active Toggle */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          disabled={togglingId === coupon._id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                            isExpired
                              ? "bg-rose-50 text-rose-600 border border-rose-200/60 opacity-80"
                              : coupon.is_active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200/60"
                          }`}
                          title="Click to toggle status"
                        >
                          {coupon.is_active && !isExpired ? (
                            <FiToggleRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <FiToggleLeft className="w-4 h-4 text-stone-400" />
                          )}
                          <span>
                            {isExpired ? "Expired" : coupon.is_active ? "Active" : "Disabled"}
                          </span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-2 text-stone-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors cursor-pointer"
                            title="Copy Code"
                          >
                            <FiCopy size={17} />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(coupon._id)}
                            disabled={isDeleting === coupon._id}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Coupon"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-3 text-xl border border-amber-100">
                        🏷️
                      </div>
                      <p className="text-base font-extrabold text-stone-900">No promo coupons found</p>
                      <p className="text-xs text-stone-400 mt-0.5 mb-4">
                        No coupons match your selected filter or search term.
                      </p>
                      <Link href="/marketing/new">
                        <Button variant="primary" size="sm" leftIcon={<FiPlus className="w-4 h-4" />}>
                          Create Coupon Code
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
        is_loading={Boolean(isDeleting)}
      />
    </div>
  );
}
