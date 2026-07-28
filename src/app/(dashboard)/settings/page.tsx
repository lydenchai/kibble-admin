"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettingsAction, fetchSettingsAction } from "@/actions/settings.actions";
import { StoreSettings } from "@/types/store-setting";
import AdminRouteGuard from "@/components/auth/AdminRouteGuard";
import {
  FiSave as FiSaveBase,
  FiCreditCard as FiCreditCardBase,
  FiGlobe as FiGlobeBase,
  FiShield as FiShieldBase,
} from "react-icons/fi";
import toast from "react-hot-toast";

const FiSave = FiSaveBase as React.ElementType;
const FiCreditCard = FiCreditCardBase as React.ElementType;
const FiGlobe = FiGlobeBase as React.ElementType;
const FiShield = FiShieldBase as React.ElementType;

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetchSettingsAction(token);
        if (res.success) {
          setSettings(res.data);
        } else if (res.is_auth_error) {
          localStorage.removeItem("accessToken");
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await updateSettingsAction(settings, token);
      if (res.success) {
        toast.success("Store settings updated successfully!");
        setMessage({ type: "success", text: "Store settings saved successfully!" });
      } else if (res.is_auth_error) {
        localStorage.removeItem("accessToken");
        router.push("/login");
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save settings." });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 max-w-7xl mx-auto text-xs text-stone-400 font-medium">
        Loading store settings...
      </div>
    );

  return (
    <AdminRouteGuard>
      <form onSubmit={handleSave} className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Store Settings
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Configure general store details and payment gateway integrations
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-bold ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* General Information Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
              <FiGlobe className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900">General Information</h2>
              <p className="text-xs text-stone-400">Primary store name and support email details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings?.store_name || ""}
                onChange={(e) => setSettings((prev) => ({ ...(prev || {}), store_name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings?.contact_email || ""}
                onChange={(e) => setSettings((prev) => ({ ...(prev || {}), contact_email: e.target.value }))}
                className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <FiCreditCard className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900">Payment Gateways & Checkout Methods</h2>
              <p className="text-xs text-stone-400">Toggle active customer payment providers on storefront</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ABA Pay / KHQR */}
            <label className="flex items-start space-x-3.5 p-4 bg-stone-50/60 hover:bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings?.payment_gateways?.aba_pay_enabled ?? true}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...(prev || {}),
                    payment_gateways: {
                      ...(prev?.payment_gateways || {}),
                      aba_pay_enabled: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 mt-0.5 text-brand-600 rounded border-stone-300 focus:ring-brand-500 cursor-pointer"
              />
              <div>
                <span className="text-sm font-extrabold text-stone-900 block leading-tight">
                  ABA Pay & KHQR Instant Checkout
                </span>
                <span className="text-xs text-stone-500 mt-0.5 block">
                  Allow customers to scan ABA KHQR code for instant mobile banking payment.
                </span>
              </div>
            </label>

            {/* Stripe Credit/Debit Card */}
            <label className="flex items-start space-x-3.5 p-4 bg-stone-50/60 hover:bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings?.payment_gateways?.stripe_enabled ?? true}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...(prev || {}),
                    payment_gateways: {
                      ...(prev?.payment_gateways || {}),
                      stripe_enabled: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 mt-0.5 text-brand-600 rounded border-stone-300 focus:ring-brand-500 cursor-pointer"
              />
              <div>
                <span className="text-sm font-extrabold text-stone-900 block leading-tight">
                  Credit / Debit Card (Stripe)
                </span>
                <span className="text-xs text-stone-500 mt-0.5 block">
                  Accept Visa, Mastercard, American Express via Stripe checkout integration.
                </span>
              </div>
            </label>

            {/* Cash on Delivery (COD) */}
            <label className="flex items-start space-x-3.5 p-4 bg-stone-50/60 hover:bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings?.payment_gateways?.cod_enabled ?? true}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...(prev || {}),
                    payment_gateways: {
                      ...(prev?.payment_gateways || {}),
                      cod_enabled: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 mt-0.5 text-brand-600 rounded border-stone-300 focus:ring-brand-500 cursor-pointer"
              />
              <div>
                <span className="text-sm font-extrabold text-stone-900 block leading-tight">
                  Cash on Delivery (COD)
                </span>
                <span className="text-xs text-stone-500 mt-0.5 block">
                  Allow customers to pay cash directly to the courier upon product delivery.
                </span>
              </div>
            </label>

            {/* Direct Bank Wire Transfer */}
            <label className="flex items-start space-x-3.5 p-4 bg-stone-50/60 hover:bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings?.payment_gateways?.bank_transfer_enabled ?? false}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...(prev || {}),
                    payment_gateways: {
                      ...(prev?.payment_gateways || {}),
                      bank_transfer_enabled: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 mt-0.5 text-brand-600 rounded border-stone-300 focus:ring-brand-500 cursor-pointer"
              />
              <div>
                <span className="text-sm font-extrabold text-stone-900 block leading-tight">
                  Direct Bank Wire Transfer
                </span>
                <span className="text-xs text-stone-500 mt-0.5 block">
                  Allow manual bank wire transfer with order reference number.
                </span>
              </div>
            </label>
          </div>
        </div>
      </form>
    </AdminRouteGuard>
  );
}
