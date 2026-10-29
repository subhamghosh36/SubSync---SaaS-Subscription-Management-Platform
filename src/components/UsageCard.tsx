'use client';

import React from 'react';
import { 
  Activity, 
  Users, 
  HardDrive, 
  Database, 
  Plus, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatBytes } from '@/lib/utils';

export default function UsageCard() {
  const { usage, subscription, simulateUsage, resetUsage, currentUser } = useApp();

  if (!usage) {
    return (
      <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 animate-pulse text-slate-400">
        Loading usage metrics...
      </div>
    );
  }

  const apiPercent = Math.min(100, Math.round((usage.apiCallsCount / usage.apiCallsLimit) * 100));
  const seatPercent = Math.min(100, Math.round((usage.seatCount / usage.seatLimit) * 100));
  const bandwidthPercent = Math.min(100, Math.round((usage.bandwidthMb / usage.bandwidthLimitMb) * 100));
  const storagePercent = Math.min(100, Math.round((usage.storageUsedMb / usage.storageLimitMb) * 100));

  const getStatusColor = (pct: number) => {
    if (pct >= 90) return { bar: 'bg-rose-500', text: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    if (pct >= 75) return { bar: 'bg-amber-500', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { bar: 'bg-brand-500', text: 'text-brand-400', badge: 'bg-brand-500/10 text-brand-400 border-brand-500/30' };
  };

  const apiStatus = getStatusColor(apiPercent);
  const seatStatus = getStatusColor(seatPercent);
  const bandwidthStatus = getStatusColor(bandwidthPercent);
  const storageStatus = getStatusColor(storagePercent);

  return (
    <div className="space-y-6">
      {/* High Quota Alert Banner if any metric > 85% */}
      {(apiPercent >= 85 || bandwidthPercent >= 85) && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-200">Tier Quota Warning (Approaching Limit)</p>
              <p className="text-xs text-amber-300/80">
                You have consumed over 85% of your allocated monthly tier capacity. Consider scaling your plan.
              </p>
            </div>
          </div>
          <a
            href="/pricing"
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shrink-0 transition"
          >
            Upgrade Plan
          </a>
        </div>
      )}

      {/* Grid of 4 Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: API Calls */}
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-400" />
                API Invocations
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${apiStatus.badge}`}>
                {apiPercent}%
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                {formatNumber(usage.apiCallsCount)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {formatNumber(usage.apiCallsLimit)}
              </span>
            </div>

            <div className="mt-3 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${apiStatus.bar} transition-all duration-500`}
                style={{ width: `${apiPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => simulateUsage('apiCalls', 1000)}
              className="text-xs font-medium text-brand-400 hover:text-brand-300 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Simulate +1k Calls
            </button>
            <span className="text-[10px] text-slate-500 font-mono">60s window</span>
          </div>
        </div>

        {/* Metric 2: Team Seats */}
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                Workspace Seats
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${seatStatus.badge}`}>
                {usage.seatCount} / {usage.seatLimit}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                {usage.seatCount}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {usage.seatLimit} Active Seats
              </span>
            </div>

            <div className="mt-3 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${seatStatus.bar} transition-all duration-500`}
                style={{ width: `${seatPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => simulateUsage('seats', 1)}
              disabled={usage.seatCount >= usage.seatLimit}
              className={`text-xs font-medium flex items-center gap-1 transition ${
                usage.seatCount >= usage.seatLimit ? 'text-slate-600 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Allocate +1 Seat
            </button>
            <span className="text-[10px] text-slate-500">RBAC Enabled</span>
          </div>
        </div>

        {/* Metric 3: Bandwidth */}
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                CDN Bandwidth
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bandwidthStatus.badge}`}>
                {bandwidthPercent}%
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                {formatBytes(usage.bandwidthMb)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {formatBytes(usage.bandwidthLimitMb)}
              </span>
            </div>

            <div className="mt-3 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${bandwidthStatus.bar} transition-all duration-500`}
                style={{ width: `${bandwidthPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => simulateUsage('bandwidth', 512)}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Simulate +512 MB
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Global Edge</span>
          </div>
        </div>

        {/* Metric 4: Storage */}
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                Database Storage
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${storageStatus.badge}`}>
                {storagePercent}%
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                {formatBytes(usage.storageUsedMb)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {formatBytes(usage.storageLimitMb)}
              </span>
            </div>

            <div className="mt-3 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${storageStatus.bar} transition-all duration-500`}
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => resetUsage()}
              className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Metrics
            </button>
            <span className="text-[10px] text-slate-500">PostgreSQL</span>
          </div>
        </div>

      </div>
    </div>
  );
}
