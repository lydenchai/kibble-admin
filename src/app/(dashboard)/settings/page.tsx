"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/apiClient";


interface StoreSettings {
  storeName?: string;
  contactEmail?: string;
  paymentGateways?: { stripeEnabled?: boolean; paypalEnabled?: boolean };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get("/settings");
        if (res.success) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiClient.put("/settings", settings);
      if (res.success) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings. Check console.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save settings. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8">Loading settings...</div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Store Settings</h1>
      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200">
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input 
                type="text" 
                value={settings?.storeName || ""}
                onChange={(e) => setSettings(prev => ({ ...(prev || {}), storeName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input 
                type="email" 
                value={settings?.contactEmail || ""}
                onChange={(e) => setSettings(prev => ({ ...(prev || {}), contactEmail: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Gateways</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={settings?.paymentGateways?.stripeEnabled || false}
                onChange={(e) => setSettings(prev => ({ 
                  ...(prev || {}), 
                  paymentGateways: { ...(prev?.paymentGateways || {}), stripeEnabled: e.target.checked }
                }))}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 font-medium">Enable Stripe</span>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={settings?.paymentGateways?.paypalEnabled || false}
                onChange={(e) => setSettings(prev => ({ 
                  ...(prev || {}), 
                  paymentGateways: { ...(prev?.paymentGateways || {}), paypalEnabled: e.target.checked }
                }))}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700 font-medium">Enable PayPal</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
