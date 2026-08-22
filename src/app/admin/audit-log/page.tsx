"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  performedBy: string;
  details: any;
  createdAt: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit-log");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
        setFilteredLogs(data);
      } else {
        triggerToast("Failed to fetch security logs.");
      }
    } catch {
      triggerToast("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (filterAction === "ALL") {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter((l) => l.action === filterAction));
    }
  }, [filterAction, logs]);

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-dark flex items-center gap-2.5">
            <ShieldAlert className="text-pink w-8 h-8" />
            <span>Security Audit Logs</span>
          </h1>
          <p className="text-[#8A7A6E] text-xs mt-1.5 leading-relaxed">
            Immutable log tracking of elevated administrative events, user role edits, and account deactivations.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="bg-[#FAF6EC] hover:bg-[#F3EFE3] text-dark border border-[#EADFC9] rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter and Content Card */}
      <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#F2ECE4] pb-4">
          <div className="text-xs font-bold text-dark uppercase tracking-wider">
            All Recorded Events ({filteredLogs.length})
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A7A6E]">Filter Action:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="text-xs border border-gray-300 rounded-xl px-3 py-1.5 focus:ring-pink focus:border-pink bg-gray-50 text-dark"
            >
              <option value="ALL">All Actions</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16 justify-center">
            <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sub-text mt-3 text-xs">Loading logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16">
            <ShieldAlert size={36} className="mx-auto text-sub-text animate-pulse" />
            <div className="font-serif font-bold text-dark text-lg mt-3">No logs found</div>
            <p className="text-xs text-[#8A7A6E] mt-1">No security events match the selected criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[#8A7A6E] uppercase font-bold text-[10px]">
                  <th className="py-2.5">Timestamp</th>
                  <th className="py-2.5">Action</th>
                  <th className="py-2.5">Target</th>
                  <th className="py-2.5">Performed By</th>
                  <th className="py-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-sans">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="py-3 text-sub-text font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase border ${
                        log.action === "ROLE_CHANGE" ? "bg-purple-50 border-purple-100 text-purple-700" :
                        log.action === "USER_DEACTIVATED" ? "bg-red-50 border-red-100 text-red-700" :
                        "bg-green-50 border-green-100 text-green-700"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-dark">{log.targetType}</div>
                      <div className="text-[10px] text-sub-text font-mono select-all">{log.targetId}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-mono text-dark select-all">{log.performedBy}</div>
                    </td>
                    <td className="py-3">
                      <pre className="text-[10px] bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-mono text-dark whitespace-pre-wrap max-w-sm">
                        {JSON.stringify(log.details || {}, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
