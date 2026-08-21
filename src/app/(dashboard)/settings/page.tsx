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
import Button from "@/components/ui/Button";

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
      <form onSubmit={handleSave} className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200/60 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill bg-brand-50 text-brand-700 text-xs font-extrabold mb-2 border border-brand-100 shadow-xs">
              <FiGlobe className="w-3.5 h-3.5 text-brand-600" />
              <span>Platform Administration</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Store Settings
            </h1>
            <p className="text-sm sm:text-base text-stone-500 mt-1 font-medium">
              Configure general store details and payment gateway integrations
            </p>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={saving}
            className="glass-btn-primary rounded-2xl shadow-md font-extrabold text-xs uppercase tracking-wider"
            leftIcon={<FiSave className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-2xl text-xs font-extrabold glass-pill ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs"
                : "bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* General Information Card */}
        <div className="glass-panel bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="flex items-center gap-3.5 border-b border-stone-100/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-md border border-white/40">
              <FiGlobe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 tracking-tight">General Information</h2>
              <p className="text-xs text-stone-500 font-medium">Primary store name, support email, and contact phone details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-widest mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings?.store_name || ""}
                onChange={(e) => setSettings((prev) => ({ ...(prev || {}), store_name: e.target.value }))}
                className="w-full pl-4 pr-4 py-2.5 glass-input rounded-2xl text-xs font-bold text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-widest mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings?.contact_email || ""}
                onChange={(e) => setSettings((prev) => ({ ...(prev || {}), contact_email: e.target.value }))}
                className="w-full pl-4 pr-4 py-2.5 glass-input rounded-2xl text-xs font-bold text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-widest mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="(+855) 012 345 678"
                value={settings?.contact_phone || ""}
                onChange={(e) => setSettings((prev) => ({ ...(prev || {}), contact_phone: e.target.value }))}
                className="w-full pl-4 pr-4 py-2.5 glass-input rounded-2xl text-xs font-bold text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Card */}
        <div className="glass-panel bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="flex items-center gap-3.5 border-b border-stone-100/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md border border-white/40">
              <FiCreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 tracking-tight">Payment Gateways & Checkout Methods</h2>
              <p className="text-xs text-stone-500 font-medium">Toggle active customer payment providers on storefront</p>
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
