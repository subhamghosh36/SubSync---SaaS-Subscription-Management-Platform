'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Zap, 
  Key, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ShieldCheck, 
  Globe2, 
  Activity, 
  Server,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import UsageCard from '@/components/UsageCard';
import RenewalCountdown from '@/components/RenewalCountdown';
import UsageChart from '@/components/UsageChart';

export default function DashboardPage() {
  const { currentUser, subscription, addToast } = useApp();
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const apiKey = currentUser?.apiKey || 'sub_live_sk_8932401928472918';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    addToast('success', 'Copied to Clipboard', 'Production API secret key copied.');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
            <Activity className="w-4 h-4" />
            <span>Real-Time Telemetry & Quota Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Usage Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back, <span className="text-white font-semibold">{currentUser?.name}</span> ({currentUser?.company || 'Organization'}). Real-time resource metering is enabled.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Plan Tiers</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* API Key Box & Active Tier Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Tier Box */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Plan Tier</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30">
                {subscription?.status || 'ACTIVE'}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-white font-display tracking-tight">
                {subscription?.tier}
              </h2>
              <span className="text-xs text-slate-400 uppercase font-semibold font-mono">
                ({subscription?.billingCycle})
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Allocated with full production throughput limits and high-concurrency rate limiters.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Auto-Renewal:</span>
            <span className="font-semibold text-emerald-400">
              {subscription?.cancelAtPeriodEnd ? 'Disabled' : 'Enabled'}
            </span>
          </div>
        </div>

        {/* API Secret Key Box */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Production API Credentials
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Bearer Auth Header</span>
            </div>

            <div className="mt-4 flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <input
                type={showApiKey ? 'text' : 'password'}
                readOnly
                value={apiKey}
                className="w-full bg-transparent font-mono text-xs text-brand-300 focus:outline-none select-all"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition hover:bg-slate-800"
                title={showApiKey ? 'Mask Key' : 'Reveal Key'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopyKey}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Pass this key in the <code className="text-slate-400 font-mono">Authorization: Bearer &lt;key&gt;</code> HTTP header to meter invocations against your quota.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Rate Limit: 600 req/min</span>
            <span>Edge Cluster: us-east-1</span>
          </div>
        </div>

      </div>

      {/* Renewal Countdown */}
      <RenewalCountdown subscription={subscription} />

      {/* 4 Quota Meters & Usage Simulator */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-base">Resource Consumption & Quotas</h3>
          <span className="text-xs text-slate-400">Click "+Simulate" on any card to test traffic spikes</span>
        </div>
        <UsageCard />
      </div>

      {/* Live Ingestion Chart */}
      <UsageChart />

      {/* Edge Node Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Edge API Gateways</p>
            <p className="text-[11px] text-emerald-400">100% Operational (99.99% SLA)</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Average Ingestion Latency</p>
            <p className="text-[11px] text-slate-300 font-mono">42ms globally</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Global CDN Mesh</p>
            <p className="text-[11px] text-cyan-400">285 Edge Locations Active</p>
          </div>
        </div>
      </div>

    </div>
  );
}
