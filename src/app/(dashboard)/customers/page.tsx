"use client";

import { useState, useEffect } from "react";
import { FiSearch as FiSearchBase, FiFilter as FiFilterBase, FiUsers as FiUsersBase, FiDownload as FiDownloadBase } from "react-icons/fi";
import { fetchCustomersAction } from "@/actions/customer.actions";
import { useDebounce } from "use-debounce";
import Pagination from "@/components/ui/Pagination";
import AdminRouteGuard from "@/components/auth/AdminRouteGuard";

const FiSearch = FiSearchBase as React.ElementType;
const FiFilter = FiFilterBase as React.ElementType;
const FiUsers = FiUsersBase as React.ElementType;
const FiDownload = FiDownloadBase as React.ElementType;

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetchCustomersAction(page, limit, debouncedSearch, token);
        if (res.success) {
          setCustomers(res.data || []);
          setTotal(res.pagination?.total || 0);
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, limit, debouncedSearch]);

  const exportCustomersCSV = () => {
    if (!customers.length) return;

    const headers = ["Customer ID", "Full Name", "Email Address", "Phone", "Total Orders", "Total Spent ($)"];
    const rows = customers.map((c) => [
      c._id,
      c.name,
      c.email,
      c.phone || "N/A",
      c.totalOrders || 0,
      (c.totalSpent || 0).toFixed(2),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kibble_customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminRouteGuard>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Customer Directory</h1>
            <p className="text-sm sm:text-base text-stone-500 mt-1">Manage registered accounts and customer purchase history</p>
          </div>

          <button
            onClick={exportCustomersCSV}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden">
        <div className="p-4.5 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/40">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
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
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Orders Placed</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-stone-400 font-medium">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3 text-xl">
                        👤
                      </div>
                      <p className="text-base font-bold text-stone-900">No customers found</p>
                      <p className="text-xs text-stone-400 mt-0.5">No user accounts match your search filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-800 to-stone-900 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                          {customer.name?.slice(0, 2).toUpperCase() || 'CU'}
                        </div>
                        <span className="text-sm font-bold text-stone-900">
                          {customer.name || 'Verified Buyer'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-stone-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-800">
                      {customer.totalOrders ?? customer.orderCount ?? customer.ordersCount ?? 0} {(customer.totalOrders ?? customer.orderCount ?? customer.ordersCount) === 1 ? 'Order' : 'Orders'}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-black text-stone-900">
                      ${(customer.totalSpent || 0).toFixed(2)}
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
          itemLabel="customers"
        />
      </div>
      </div>
    </AdminRouteGuard>
  );
}
