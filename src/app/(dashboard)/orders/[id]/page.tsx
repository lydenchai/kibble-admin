"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft as FiArrowLeftBase, FiPackage as FiPackageBase, FiTruck as FiTruckBase, FiCreditCard as FiCreditCardBase, FiCheckCircle as FiCheckCircleBase, FiPrinter as FiPrinterBase } from "react-icons/fi";
import { fetchOrderByIdAction, updateOrderAction } from "@/actions/order.actions";
import { Order } from "@/types/order";
import PrintableAdminReceipt from "@/components/features/orders/PrintableAdminReceipt";

const FiArrowLeft = FiArrowLeftBase as React.ElementType;
const FiPackage = FiPackageBase as React.ElementType;
const FiTruck = FiTruckBase as React.ElementType;
const FiCreditCard = FiCreditCardBase as React.ElementType;
const FiCheckCircle = FiCheckCircleBase as React.ElementType;
const FiPrinter = FiPrinterBase as React.ElementType;

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [tracking_number, settracking_number] = useState("");
  const [courier, setCourier] = useState("");
  const [tracking_url, settracking_url] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetchOrderByIdAction(id, token);
        if (res.success) {
          setOrder(res.data);
          settracking_number(res.data.tracking_number || "");
          setCourier(res.data.courier || "");
          settracking_url(res.data.tracking_url || "");
        } else {
          setError(res.error || "Failed to load order");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('accessToken');
      const data = await updateOrderAction(order._id, { status: newStatus }, token);
      if (data && data.success) {
        setOrder({ ...order, status: newStatus as Order['status'] });
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update order status", err);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsUpdatingTracking(true);
    try {
      const token = localStorage.getItem('accessToken');
      const data = await updateOrderAction(order._id, { 
        tracking_number, 
        courier, 
        tracking_url 
      }, token);
      if (data && data.success) {
        setOrder({ ...order, tracking_number, courier, tracking_url });
        alert("Tracking info updated successfully!");
      } else {
        alert("Failed to update tracking");
      }
    } catch (err) {
      console.error("Failed to update tracking", err);
      alert("Failed to update tracking");
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex justify-center items-center h-64 text-xs font-medium text-stone-400">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-4">
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-xs font-bold border border-rose-200">
          {error || "Order not found"}
        </div>
        <button onClick={() => router.back()} className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'processing': return 'bg-sky-50 text-sky-700 border-sky-200/60';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200/60';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <>
      <PrintableAdminReceipt order={order} />
      <div className="p-8 max-w-6xl mx-auto space-y-8 pb-20 print:hidden">
      {/* Back button & Order Header */}
      <div className="space-y-4">
        <Link href="/orders" className="text-xs font-bold text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 transition-colors">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-mono">
                Order #{order._id.substring(order._id.length - 8).toUpperCase()}
              </h1>
              <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {(() => {
              const canPrint = order.status !== 'cancelled' && (order.payment_status === 'paid' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered');
              return (
                <button
                  type="button"
                  onClick={() => canPrint && window.print()}
                  disabled={!canPrint}
                  title={
                    order.status === 'cancelled'
                      ? "Cannot print receipt for cancelled orders"
                      : "Receipt print available after payment confirmation"
                  }
                  className={`flex items-center gap-2 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 print:hidden ${
                    canPrint
                      ? "bg-stone-900 hover:bg-stone-800 text-white cursor-pointer shadow-xs"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  <FiPrinter className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
              );
            })()}

            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider print:hidden">Status:</span>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none bg-stone-50/50 hover:bg-white text-stone-900 transition-colors disabled:opacity-50 cursor-pointer print:hidden"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden">
            <div className="p-5 border-b border-stone-100 bg-stone-50/40">
              <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <FiPackage className="text-stone-400" /> Items Ordered
              </h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 text-[11px] uppercase font-extrabold text-stone-400 bg-stone-50/20">
                    <th className="px-6 py-3.5">Product</th>
                    <th className="px-6 py-3.5 text-center">Qty</th>
                    <th className="px-6 py-3.5 text-right">Price</th>
                    <th className="px-6 py-3.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <tr key={item.sku} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-stone-900">{item.name}</p>
                        <p className="text-[11px] font-mono text-stone-400 mt-0.5">SKU: {item.sku}</p>
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-semibold text-stone-700">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-xs font-semibold text-stone-700">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-xs font-extrabold text-stone-900">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-stone-50/40 border-t border-stone-100 flex flex-col gap-2 items-end">
              <div className="flex justify-between w-full sm:w-64 text-xs font-medium text-stone-600">
                <span>sub_total</span>
                <span>${(order.sub_total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 text-xs font-medium text-stone-600">
                <span>Shipping</span>
                <span>${(order.shipping || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 text-xs font-medium text-stone-600">
                <span>Tax</span>
                <span>${(order.tax || 0).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between w-full sm:w-64 text-xs font-bold text-emerald-600">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between w-full sm:w-64 text-base font-black text-stone-900 mt-2 pt-2 border-t border-stone-200/80">
                <span>Total</span>
                <span>${(order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer & Shipping Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 space-y-3">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <FiCheckCircle className="text-stone-400" /> Customer Details
            </h2>
            {order.user ? (
              <div className="text-xs space-y-1">
                <p className="">Name: <span className="text-stone-700 font-bold">{order.user.name}</span></p>
                <p className="">Email: <span className="text-stone-700 font-bold">{order.user.email}</span></p>
                <p className="">Phone: <span className="text-stone-700 font-bold">{order.user.phone || "No phone provided"}</span></p>
              </div>
            ) : (
              <p className="text-xs text-stone-400">Guest Checkout / Deleted User</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 space-y-3">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <FiTruck className="text-stone-400" /> Shipping Address
            </h2>
            {order.shipping_address ? (
              <div className="text-xs text-stone-700 leading-relaxed font-medium">
                <p>
                  {[
                    (order.shipping_address?.house_number || order.shipping_address?.house) 
                      ? `House No. ${order.shipping_address?.house_number || order.shipping_address?.house}` 
                      : null,
                    order.shipping_address?.street 
                      ? `St. ${order.shipping_address.street}` 
                      : null,
                    order.shipping_address?.village,
                    order.shipping_address?.commune,
                    order.shipping_address?.district,
                    order.shipping_address?.province || order.shipping_address?.city,
                    order.shipping_address?.country
                  ].filter(Boolean).join(", ")}
                </p> 
              </div>
            ) : (
              <p className="text-xs text-stone-400">No shipping address recorded</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <FiPackage className="text-stone-400" /> Shipping Tracking
            </h2>
            <form onSubmit={handleUpdateTracking} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">Courier</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. FedEx, UPS"
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">Tracking Number</label>
                <input
                  type="text"
                  value={tracking_number}
                  onChange={(e) => settracking_number(e.target.value)}
                  placeholder="e.g. 1Z9999999999999999"
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-mono font-medium focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">Tracking URL</label>
                <input
                  type="url"
                  value={tracking_url}
                  onChange={(e) => settracking_url(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all text-stone-900"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingTracking}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingTracking ? "Saving..." : "Save Tracking Info"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 space-y-3">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <FiCreditCard className="text-stone-400" /> Payment Info
            </h2>
            <div className="text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Method</span>
                <span className="font-bold text-stone-900 capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Status</span>
                <span className={`font-extrabold capitalize px-2 py-0.5 rounded-full text-[10px] ${
                  order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
