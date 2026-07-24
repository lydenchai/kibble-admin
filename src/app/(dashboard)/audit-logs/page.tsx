"use client";

import { useEffect, useState } from "react";
import { fetchAuditLogsAction } from "../../../actions/audit.actions";
import { AuditLogType } from "../../../types/auditLog";
import Pagination from "@/components/ui/Pagination";

const getActionColor = (action: string) => {
  switch (action) {
    case 'CREATE': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    case 'UPDATE': return 'bg-sky-50 text-sky-700 border-sky-200/60';
    case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-200/60';
    default: return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetchAuditLogsAction(token);
        if (res.success) {
          setLogs(res.data || []);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error(err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  if (loading) return <div className="p-8 text-sm text-stone-400 font-medium">Loading security audit logs...</div>;

  const paginatedLogs = logs.slice((page - 1) * limit, page * limit);
  const total = logs.length;

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
              {paginatedLogs.map((log) => (
                <tr key={log._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4.5 whitespace-nowrap text-sm font-mono text-stone-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-900">
                    {log.user?.name || "System Automated"}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs font-black rounded-full border ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-800">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4.5 text-xs text-stone-500 max-w-xs truncate font-mono">
                    {log.details}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-400 text-sm font-medium">
                    No security audit logs recorded yet.
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
          itemLabel="events"
        />
      </div>
    </div>
  );
}
