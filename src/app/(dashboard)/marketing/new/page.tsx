"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCouponAction } from "../../../../actions/marketing.actions";
import { FiArrowLeft as FiArrowLeftBase } from "react-icons/fi";

const FiArrowLeft = FiArrowLeftBase as React.ElementType;

export default function CreateCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrderValue: "",
    expiry: "",
    usageLimit: "",
    isActive: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        ...formData,
        value: Number(formData.value),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
      };

      await createCouponAction(payload, token);
      router.push("/marketing");
    } catch (err: any) {
      console.error("Failed to create coupon:", err);
      setError(err.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer mb-2"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketing</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Create Promo Coupon</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">Configure discount codes, usage limits, and minimum order requirements</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 border-l-4 border-rose-500 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Discount Type *</label>
              <select
                name="type"
                required
                value={formData.type}
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
                placeholder={formData.type === 'percentage' ? 'e.g. 15' : 'e.g. 10.00'}
                value={formData.value}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Minimum Order Value ($)</label>
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
                name="expiry"
                required
                value={formData.expiry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Usage Limit (Total uses)</label>
              <input
                type="number"
                name="usageLimit"
                min="1"
                placeholder="Leave empty for unlimited"
                value={formData.usageLimit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
              />
            </div>
          </div>

          <label className="flex items-center space-x-3 p-3 bg-stone-50/50 rounded-xl border border-stone-200/60 cursor-pointer">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-brand-600 rounded border-stone-300 focus:ring-brand-500"
            />
            <span className="text-xs font-bold text-stone-800">
              Active (Customers can apply this coupon code at checkout immediately)
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => router.push("/marketing")}
              className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
