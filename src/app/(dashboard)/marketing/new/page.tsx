"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCouponAction } from "../../../../actions/marketing.actions";
import { FiArrowLeft as FiArrowLeftBase, FiSave as FiSaveBase, FiTag as FiTagBase } from "react-icons/fi";
import { couponSchema } from "@/lib/validations/coupon.schema";

const FiArrowLeft = FiArrowLeftBase as React.ElementType;
const FiSave = FiSaveBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;

export default function CreateCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    value: "",
    minOrderValue: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType as "percentage" | "fixed",
      type: formData.discountType as "percentage" | "fixed",
      value: Number(formData.value),
      minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      expiryDate: formData.expiryDate || undefined,
      expiry: formData.expiryDate || undefined,
      isActive: formData.isActive,
    };

    // Zod Validation
    const validation = couponSchema.safeParse(payload);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid coupon data");
      return;
    }

    setLoading(true);

    try {
      await createCouponAction(payload);
      router.push("/marketing");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to create coupon:", err);
      setError(err.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-7xl mx-auto space-y-8">
      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl">
          <p className="text-rose-700 font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Top Header & Action Section */} 
      {/* Title + Subtitle on Left, Save Button on Right */}
      <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Create Promo Coupon</h1>
          <p className="text-sm text-stone-500 mt-1">Configure discount codes, usage limits, and minimum order requirements</p>
      </div>
      
      {/* Top Action Header */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketing</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
        >
          <FiSave className="w-4 h-4" />
          <span>{loading ? "Creating..." : "Create Coupon"}</span>
        </button>
      </div>

      {/* 2-Column Grid matching ProductForm layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card 1: Discount Configuration */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-extrabold text-stone-900">Discount Configuration</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="e.g. KIBBLE15"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-mono font-bold uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Discount Type *</label>
                  <select
                    name="discountType"
                    required
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Discount Value *</label>
                  <input
                    type="number"
                    name="value"
                    required
                    min="0"
                    step="0.01"
                    placeholder={formData.discountType === "percentage" ? "e.g. 15" : "e.g. 10.00"}
                    value={formData.value}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Usage Restrictions */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-extrabold text-stone-900">Usage & Expiry Restrictions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Min. Order Value ($)</label>
                <input
                  type="number"
                  name="minOrderValue"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.minOrderValue}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Expiry Date *</label>
                <input
                  type="date"
                  name="expiryDate"
                  required
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Usage Limit (Total)</label>
                <input
                  type="number"
                  name="usageLimit"
                  min="1"
                  placeholder="Unlimited"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (1/3 width) */}
        <div className="space-y-8">
          {/* Card 3: Status & Visibility */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-extrabold text-stone-900">Status & Availability</h2>

            <label className="flex items-start space-x-3 p-4 bg-stone-50/50 rounded-xl border border-stone-200/60 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 text-brand-600 rounded border-stone-300 focus:ring-brand-500"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Active Coupon Code</span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Customers can immediately redeem this promo code at storefront checkout.
                </span>
              </div>
            </label>
          </div>

          {/* Card 4: Coupon Preview Card */}
          <div className="bg-gradient-to-br from-brand-500 to-amber-600 p-6 rounded-2xl text-white shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
                <FiTag className="w-3.5 h-3.5" /> Coupon Preview
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${formData.isActive ? 'bg-emerald-400/30 text-emerald-100 border border-emerald-300/40' : 'bg-stone-400/30 text-stone-200'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div>
              <p className="text-2xl font-black tracking-widest font-mono uppercase">
                {formData.code || "PROMO15"}
              </p>
              <p className="text-sm font-bold opacity-90 mt-1">
                {formData.value
                  ? formData.discountType === "percentage"
                    ? `${formData.value}% OFF Total Order`
                    : `$${Number(formData.value).toFixed(2)} OFF Total Order`
                  : "Specify discount value"}
              </p>
            </div>

            {formData.minOrderValue && Number(formData.minOrderValue) > 0 && (
              <p className="text-xs opacity-75 border-t border-white/20 pt-2">
                Min. order: ${Number(formData.minOrderValue).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
