"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch as FiSearchBase,
  FiEye as FiEyeBase,
  FiDownload as FiDownloadBase,
  FiShoppingBag as FiShoppingBagBase,
  FiDollarSign as FiDollarSignBase,
  FiClock as FiClockBase,
  FiTruck as FiTruckBase,
} from "react-icons/fi";
import { updateOrderAction, fetchOrdersAction } from "@/actions/order.actions";
import { Order } from "@/types/order";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const FiSearch = FiSearchBase as React.ElementType;
const FiEye = FiEyeBase as React.ElementType;
const FiDownload = FiDownloadBase as React.ElementType;
const FiShoppingBag = FiShoppingBagBase as React.ElementType;
const FiDollarSign = FiDollarSignBase as React.ElementType;
const FiClock = FiClockBase as React.ElementType;
const FiTruck = FiTruckBase as React.ElementType;

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [is_loading, setis_loading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const data = await fetchOrdersAction(token);
        if (data && data.success) {
          setOrders(data.data);
        } else if (data && data.is_auth_error) {
          localStorage.removeItem('accessToken');
          router.push('/login');
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setis_loading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleStatusChange = async (order_id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const data = await updateOrderAction(order_id, { status: newStatus }, token);
      if (data && data.success) {
        setOrders(orders.map(o => o._id === order_id ? { ...o, status: newStatus as Order['status'] } : o));
        toast.success("Order status updated successfully!");
      } else if (data && data.is_auth_error) {
        localStorage.removeItem('accessToken');
        router.push('/login');
      } else {
        toast.error(data?.error || "Failed to update status");
      }
    } catch (err: any) {
      console.error("Failed to update order status", err);
      toast.error(err.message || "Failed to update order status");
    }
  };

  const exportOrdersCSV = () => {
    if (!orders.length) return;

    const headers = ["Order ID", "Customer Name", "Customer Email", "Status", "Total Amount ($)", "Items Count", "Date"];
    const rows = orders.map((o) => [
      o._id,
      o.user?.name || "Guest",
      o.user?.email || "N/A",
      o.status.toUpperCase(),
      o.total.toFixed(2),
      o.items?.length || 0,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kibble_orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV!");
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.name || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const total = filteredOrders.length;
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

  // Executive Stat Metrics
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const inTransitCount = orders.filter((o) => o.status === "processing" || o.status === "shipped").length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Order Management</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Review customer transactions and update order fulfillment statuses</p>
        </div>

        <Button
          type="button"
          variant="dark"
          size="md"
          onClick={exportOrdersCSV}
          leftIcon={<FiDownload className="w-4 h-4" />}
        >
          Export CSV
        </Button>
      </div>

      {/* Analytical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <FiShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalOrdersCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Sales</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Action</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
            <FiTruck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Transit</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{inTransitCount}</p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between bg-white shrink-0">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders by ID or customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
            >
              <option value="all">All Order Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {is_loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading orders...</td>
                </tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-slate-900">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{order.user?.name || "Guest Customer"}</div>
                      <div className="text-xs text-slate-500">{order.user?.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      ${(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer focus:outline-none transition-colors ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : order.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-3 text-xl">
                        🛒
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No orders found</p>
                      <p className="text-xs text-slate-400 mt-0.5">No customer transactions match your filter criteria.</p>
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
          itemLabel="orders"
        />
      </div>
    </div>
  );
}
