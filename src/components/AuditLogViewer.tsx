'use client';

import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronRight, Terminal, Clock } from 'lucide-react';
import { AuditLog } from '@/types';
import { formatDate } from '@/lib/utils';

interface AuditLogViewerProps {
  logs: AuditLog[];
}

export default function AuditLogViewer({ logs }: AuditLogViewerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('OVERRIDE')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (action.includes('SUSPEND') || action.includes('FAILED')) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (action.includes('UPGRADE') || action.includes('SUCCEEDED') || action.includes('CHECKOUT'))
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden backdrop-blur-sm">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-white text-sm">Security & Audit Event Stream</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Immutable Log Retention</span>
      </div>

      <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No audit logs recorded yet.</div>
        ) : (
          logs.map((log) => {
            const isExpanded = expandedId === log.id;
            return (
              <div key={log.id} className="p-4 hover:bg-slate-800/30 transition text-sm">
                <div
                  onClick={() => toggleExpand(log.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="font-medium text-slate-300 text-xs sm:text-sm">
                      by <span className="text-white">{log.actorEmail}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pl-6 sm:pl-0">
                    <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleTimeString()} ({formatDate(log.createdAt)})
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pl-6">
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
