"use client";

import { useState, useEffect } from "react";
import { fetchAuditLogsAction } from "@/actions/audit.actions";
import Pagination from "@/components/ui/Pagination";
import AdminRouteGuard from "@/components/auth/AdminRouteGuard";
import {
  FiSearch as FiSearchBase,
  FiEye as FiEyeBase,
  FiX as FiXBase,
  FiCopy as FiCopyBase,
  FiCheck as FiCheckBase,
  FiShield as FiShieldBase,
  FiClock as FiClockBase,
  FiUser as FiUserBase,
  FiActivity as FiActivityBase,
} from "react-icons/fi";
import toast from "react-hot-toast";

const FiSearch = FiSearchBase as React.ElementType;
const FiEye = FiEyeBase as React.ElementType;
const FiX = FiXBase as React.ElementType;
const FiCopy = FiCopyBase as React.ElementType;
const FiCheck = FiCheckBase as React.ElementType;
const FiShield = FiShieldBase as React.ElementType;
const FiClock = FiClockBase as React.ElementType;
const FiUser = FiUserBase as React.ElementType;
const FiActivity = FiActivityBase as React.ElementType;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selected Log Modal State
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("accessToken");
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

  const handleCopyDetails = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Payload copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const parseLogDetails = (detailsRaw: string) => {
    if (!detailsRaw) return null;
    try {
      return JSON.parse(detailsRaw);
    } catch {
      return { raw: detailsRaw };
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case "CREATE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "UPDATE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      (log.action || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.resource || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.details || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginatedLogs = filteredLogs.slice((page - 1) * limit, page * limit);
  const total = filteredLogs.length;

  return (
    <AdminRouteGuard>
      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
              <FiShield className="w-3.5 h-3.5 text-brand-600" />
              <span>Compliance & Security</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Security Audit Logs
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Trace all system administrative events, resource mutations, and security audit logs
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between bg-white shrink-0">
            <div className="relative w-full sm:max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search audit logs by action, user, or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <FiShield className="text-brand-600 w-4 h-4" />
              <span>Audit Logging Active</span>
            </div>
          </div>

          <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Admin User
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Details Preview
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Log Detail
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Loading security audit logs...
                    </td>
                  </tr>
                ) : paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <tr
                      key={log._id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-medium text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                            {log.user?.name?.slice(0, 2).toUpperCase() || "SY"}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-900 block leading-tight">
                              {log.user?.name || "System Automated"}
                            </span>
                            {log.user?.email && (
                              <span className="text-[11px] text-slate-400 block">
                                {log.user.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-mono max-w-xs truncate">
                        {log.details || "No raw details logged"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-3 text-xl">
                          📋
                        </div>
                        <p className="text-sm font-semibold text-slate-900">No audit logs found</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          No system events match your search filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
            itemLabel="audit events"
          />
        </div>

        {/* Audit Log Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <FiActivity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Audit Log Event Detail</h3>
                    <p className="text-xs font-mono text-slate-400">ID: {selectedLog._id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Event Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Event Action
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold uppercase border ${getActionBadgeColor(
                      selectedLog.action
                    )}`}
                  >
                    {selectedLog.action}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Target Resource
                  </span>
                  <span className="text-xs font-semibold text-brand-600 block truncate">
                    {selectedLog.resource}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Event Timestamp
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-700 flex items-center gap-1">
                    <FiClock className="w-3 h-3 text-slate-400" />
                    {new Date(selectedLog.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Admin User Details */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 font-bold text-xs flex items-center justify-center">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {selectedLog.user?.name || "System Process"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {selectedLog.user?.email || "Automated system execution"}
                    </p>
                  </div>
                </div>
                {selectedLog.user?.role && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-md uppercase tracking-wider">
                    {selectedLog.user.role}
                  </span>
                )}
              </div>

              {/* Log Payload / Details Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Event Payload & Details
                  </label>
                  <button
                    onClick={() => handleCopyDetails(selectedLog.details || "")}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
                  >
                    {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Payload"}</span>
                  </button>
                </div>

                <div className="bg-stone-900 rounded-xl p-4 text-stone-100 font-mono text-xs overflow-x-auto max-h-64 border border-stone-800 shadow-inner">
                  {selectedLog.details ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(parseLogDetails(selectedLog.details), null, 2)}
                    </pre>
                  ) : (
                    <p className="text-stone-500 italic">No structured payload recorded for this event.</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400">
                <span>Recorded on {new Date(selectedLog.createdAt).toLocaleString()}</span>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close Detail
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRouteGuard>
  );
}
