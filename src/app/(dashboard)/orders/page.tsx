"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch as FiSearchBase, FiFilter as FiFilterBase, FiShoppingCart as FiShoppingCartBase, FiEye as FiEyeBase } from "react-icons/fi";
import { updateOrderAction, fetchOrdersAction } from "@/actions/order.actions";
import { Order } from "@/types/order";
import Pagination from "@/components/ui/Pagination";

const FiSearch = FiSearchBase as React.ElementType;
const FiFilter = FiFilterBase as React.ElementType;
const FiShoppingCart = FiShoppingCartBase as React.ElementType;
const FiEye = FiEyeBase as React.ElementType;

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const data = await fetchOrdersAction(token);
        if (data && data.success) {
          setOrders(data.data);
        } else if (data && data.isAuthError) {
          localStorage.removeItem('accessToken');
          router.push('/login');
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const data = await updateOrderAction(orderId, { status: newStatus }, token);
      if (data && data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus as Order['status'] } : o));
      } else if (data && data.isAuthError) {
        localStorage.removeItem('accessToken');
        router.push('/login');
      }
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(search.toLowerCase()) || 
    (order.user?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredOrders.length;
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Order Management</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Review customer transactions and update order fulfillment statuses</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden">
        <div className="p-4.5 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/40">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search orders by ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium text-stone-900"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-sm font-bold text-stone-700 transition-colors cursor-pointer">
            <FiFilter className="w-4 h-4 text-stone-400" />
            <span>Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-right text-xs font-black text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-400 font-medium">Loading orders...</td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3 text-xl">
                        🛒
                      </div>
                      <p className="text-base font-bold text-stone-900">No orders found</p>
                      <p className="text-xs text-stone-400 mt-0.5">No transactions match your search filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-mono font-bold text-brand-600">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="text-sm font-bold text-stone-900">{order.user?.name || "Guest Customer"}</div>
                      <div className="text-xs text-stone-400 font-medium">{order.user?.email || "No email"}</div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-black rounded-full px-3 py-1 border cursor-pointer focus:outline-none ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                          order.status === 'shipped' ? 'bg-sky-50 text-sky-700 border-sky-200/60' :
                          order.status === 'processing' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                          'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-black text-stone-900">
                      ${(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center gap-1 p-2 text-stone-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors cursor-pointer"
                        title="View Order Details"
                      >
                        <FiEye size={18} />
                      </Link>
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
          itemLabel="orders"
        />
      </div>
    </div>
  );
}
