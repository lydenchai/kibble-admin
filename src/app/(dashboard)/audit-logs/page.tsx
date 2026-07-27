"use client";

import { useState, useEffect } from "react";
import { fetchAuditLogsAction } from "@/actions/audit.actions";
import Pagination from "@/components/ui/Pagination";
import { FiSearch as FiSearchBase } from "react-icons/fi";

const FiSearch = FiSearchBase as React.ElementType;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const data = await fetchAuditLogsAction(token);
        if (data && data.success) {
          setLogs(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  if (loading) return <div className="p-8 text-sm text-stone-400 font-medium">Loading security audit logs...</div>;

  const filteredLogs = logs.filter(log =>
    (log.action || "").toLowerCase().includes(search.toLowerCase()) ||
    (log.resource || "").toLowerCase().includes(search.toLowerCase()) ||
    (log.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (log.details || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginatedLogs = filteredLogs.slice((page - 1) * limit, page * limit);
  const total = filteredLogs.length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Security Audit Logs</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Trace all system administrative events, resource mutations, and security changes</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4.5 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/40">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search audit logs by action, user, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium text-stone-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Admin User</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Event Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-mono text-stone-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-900">
                      {log.user?.name || "System Automated"}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-brand-600">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4.5 text-sm text-stone-600 font-medium max-w-xs truncate">
                      {log.details || log.ipAddress || "System event logged"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3 text-xl">
                        📋
                      </div>
                      <p className="text-base font-bold text-stone-900">No audit logs found</p>
                      <p className="text-xs text-stone-400 mt-0.5">No system events match your search filter.</p>
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
          itemLabel="audit events"
        />
      </div>
    </div>
  );
}
