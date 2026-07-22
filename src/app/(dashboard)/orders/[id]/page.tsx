"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft as FiArrowLeftBase, FiPackage as FiPackageBase, FiTruck as FiTruckBase, FiCreditCard as FiCreditCardBase, FiCheckCircle as FiCheckCircleBase } from "react-icons/fi";
import { fetchOrderByIdAction, updateOrderAction } from "@/actions/order.actions";
import { Order } from "@/types/order";

const FiArrowLeft = FiArrowLeftBase as React.ElementType;
const FiPackage = FiPackageBase as React.ElementType;
const FiTruck = FiTruckBase as React.ElementType;
const FiCreditCard = FiCreditCardBase as React.ElementType;
const FiCheckCircle = FiCheckCircleBase as React.ElementType;

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetchOrderByIdAction(id, token);
        if (res.success) {
          setOrder(res.data);
          setTrackingNumber(res.data.trackingNumber || "");
          setCourier(res.data.courier || "");
          setTrackingUrl(res.data.trackingUrl || "");
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
        trackingNumber, 
        courier, 
        trackingUrl 
      }, token);
      if (data && data.success) {
        setOrder({ ...order, trackingNumber, courier, trackingUrl });
        alert("Tracking updated successfully!");
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
      <div className="p-8 max-w-5xl mx-auto flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || "Order not found"}
        </div>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline">
          &larr; Back to Orders
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <div className="mb-6">
        <Link href="/orders" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 w-fit transition-colors">
          <FiArrowLeft /> Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Update Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white shadow-sm disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiPackage className="text-gray-400" /> Items Ordered
              </h2>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium text-center">Qty</th>
                    <th className="px-6 py-4 font-medium text-right">Price</th>
                    <th className="px-6 py-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <tr key={item.sku} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-gray-700">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-2 items-end">
              <div className="flex justify-between w-full sm:w-64 text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 text-sm text-gray-600">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 text-sm text-gray-600">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between w-full sm:w-64 text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between w-full sm:w-64 text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-gray-400" /> Customer Details
            </h2>
            {order.user ? (
              <div className="text-sm">
                <p className="font-medium text-gray-900">{order.user.name}</p>
                <p className="text-gray-500 mt-1">{order.user.email}</p>
                <p className="text-gray-500 mt-1">{order.user.phone || "No phone provided"}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Guest Checkout / Deleted User</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiTruck className="text-gray-400" /> Shipping Address
            </h2>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  {[
                    order.shippingAddress?.street,
                    order.shippingAddress?.village,
                    order.shippingAddress?.commune,
                    order.shippingAddress?.district,
                    order.shippingAddress?.province,
                    order.shippingAddress?.country
                  ].filter(Boolean).join(", ")}
                </p> 
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shipping address</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiPackage className="text-gray-400" /> Shipping Tracking
            </h2>
            <form onSubmit={handleUpdateTracking} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Courier</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. FedEx, UPS"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 1Z9999999999999999"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tracking URL</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingTracking}
                className="w-full bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {isUpdatingTracking ? "Saving..." : "Save Tracking Info"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCreditCard className="text-gray-400" /> Payment Info
            </h2>
            <div className="text-sm">
              <p className="flex justify-between mb-2">
                <span className="text-gray-500">Method</span>
                <span className="font-medium capitalize">{order.paymentMethod}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
