'use client';

import { useState, useEffect } from "react";
import { FiSearch as FiSearchBase, FiFilter as FiFilterBase, FiDownload as FiDownloadBase } from "react-icons/fi";
import { Users, User, Search } from "lucide-react";
import { fetchCustomersAction } from "@/actions/customer.actions";
import { useDebounce } from "use-debounce";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>Customer Accounts</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Manage registered accounts and customer purchase history</p>
          </div>

          <Button
            type="button"
            variant="dark"
            size="md"
            onClick={exportCustomersCSV}
            leftIcon={<FiDownload className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between bg-white shrink-0">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors cursor-pointer border border-slate-200 rounded-lg">
            <FiFilter className="w-4 h-4 text-slate-400" />
            <span>Filters</span>
          </button>
        </div>

        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Orders Placed</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-3 text-slate-400">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No customers found</p>
                      <p className="text-xs text-slate-400 mt-0.5">No user accounts match your search filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 font-bold text-xs flex items-center justify-center">
                          {customer.name?.slice(0, 2).toUpperCase() || 'CU'}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {customer.name || 'Verified Buyer'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                      {customer.totalOrders ?? customer.orderCount ?? customer.ordersCount ?? 0} {(customer.totalOrders ?? customer.orderCount ?? customer.ordersCount) === 1 ? 'Order' : 'Orders'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
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
