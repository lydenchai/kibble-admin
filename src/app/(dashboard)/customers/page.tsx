'use client';

import { useState, useEffect } from "react";
import { FiSearch as FiSearchBase, FiFilter as FiFilterBase, FiDownload as FiDownloadBase } from "react-icons/fi";
import { Users, User, Search } from "lucide-react";
import { fetchCustomersAction } from "@/actions/customer.actions";
import { useDebounce } from "use-debounce";
import Pagination from "@/components/ui/Pagination";
import AdminRouteGuard from "@/components/auth/AdminRouteGuard";

const FiSearch = FiSearchBase as React.ElementType;
const FiFilter = FiFilterBase as React.ElementType;
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
      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill bg-brand-50 text-brand-700 text-xs font-extrabold mb-2 border border-brand-100 shadow-xs">
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>Customer Accounts</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Customer Directory</h1>
            <p className="text-sm sm:text-base text-stone-500 mt-1 font-medium">Manage registered accounts and customer purchase history</p>
          </div>

          <button
            onClick={exportCustomersCSV}
            className="glass-btn-primary bg-stone-900 hover:bg-black text-white font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0 uppercase tracking-wider border border-white/20"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

      {/* Table Container */}
      <div className="glass-panel bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/90 overflow-hidden flex flex-col relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
        <div className="p-5 border-b border-stone-100/80 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/30 shrink-0">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-2xl text-xs font-bold text-stone-900 placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 glass-pill bg-white/80 hover:bg-stone-50 text-xs font-extrabold text-stone-700 transition-all cursor-pointer border border-stone-200/80 shadow-xs">
            <FiFilter className="w-4 h-4 text-stone-400" />
            <span>Filters</span>
          </button>
        </div>

        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/80 backdrop-blur-md sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Email Address</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Orders Placed</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="bg-white/40 divide-y divide-stone-100/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-xs text-stone-400 font-bold uppercase tracking-wider">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 glass-panel bg-stone-50 rounded-3xl flex items-center justify-center mb-3 text-stone-400 border border-stone-200/80 shadow-xs">
                        <Search className="w-6 h-6 text-stone-400" />
                      </div>
                      <p className="text-base font-black text-stone-900">No customers found</p>
                      <p className="text-xs text-stone-400 mt-0.5 font-medium">No user accounts match your search filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-brand-500 to-orange-600 text-white font-black text-xs flex items-center justify-center shadow-xs border border-white/40">
                          {customer.name?.slice(0, 2).toUpperCase() || 'CU'}
                        </div>
                        <span className="text-sm font-black text-stone-900">
                          {customer.name || 'Verified Buyer'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-xs font-bold text-stone-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-xs font-extrabold text-stone-800">
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
