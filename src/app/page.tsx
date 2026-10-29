'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight, 
  Layers, 
  CreditCard, 
  BarChart3, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Database,
  Lock,
  Cpu,
  Globe2,
  Download
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PLANS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const { metrics, currentUser, subscription } = useApp();
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  return (
    <div className="relative overflow-hidden flex flex-col">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-brand-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-brand-300 shadow-inner mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
          <span>SubSync Architecture v1.0 • Production Ready</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-display max-w-4xl mx-auto leading-[1.1]">
          The Intelligent Subscription Engine for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400">
            High-Velocity SaaS
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Full-stack subscription management with seamless tier upgrades, live telemetry quotas, automated PDF invoices, Stripe webhooks, and an enterprise RBAC control plane.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition flex items-center gap-2.5 group"
          >
            <span>Open Telemetry Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/pricing"
            className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 shadow-inner"
          >
            <Layers className="w-4 h-4 text-brand-400" />
            <span>Explore Plans & Upgrades</span>
          </Link>

          <Link
            href="/admin"
            className="px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-cyan-300 font-semibold text-sm border border-cyan-500/30 hover:border-cyan-500/50 transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Admin RBAC</span>
          </Link>
        </div>

        {/* Tech Stack Pills */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-400" />
            <span>Next.js 14 App Router</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Node.js Backend Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>PostgreSQL 18 & Prisma</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Stripe Payments & Webhooks</span>
          </div>
        </div>
      </section>

      {/* Real-time SaaS Metrics Ticker Bar */}
      <section className="py-8 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Global MRR</p>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {formatCurrency(metrics?.mrr || 48920)}
              </p>
              <p className="text-[11px] text-emerald-400 mt-0.5">+{metrics?.mrrGrowth || 18.4}% this month</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Annual Run-Rate (ARR)</p>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {formatCurrency(metrics?.arr || 587040)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Projected revenue</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Subscribers</p>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {(metrics?.activeSubscribers || 1420).toLocaleString()}
              </p>
              <p className="text-[11px] text-indigo-400 mt-0.5">Across 3 Plan Tiers</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Churn Rate</p>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {metrics?.churnRate || 1.4}%
              </p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Top-decile SaaS benchmark</p>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Core Architecture</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white font-display">
            Engineered for Mission-Critical SaaS Operations
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Every layer from Stripe Webhooks to client-side PDF receipts is built to scale smoothly under heavy production load.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 transition duration-300 shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-white font-display">Subscription Plans & Upgrades</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Developer Free, Growth Pro, and Scale Enterprise tiers with monthly and yearly billing switches, prorations, and instant upgrades.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-brand-400 font-semibold">
              <Link href="/pricing" className="flex items-center gap-1 hover:underline">
                View Plans <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition duration-300 shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-white font-display">Automated Billing & Invoices</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Real-time Stripe webhook listener, automatic failure retries, payment method handling, and on-the-fly PDF invoice generation.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <Link href="/billing" className="flex items-center gap-1 hover:underline">
                Inspect Invoices <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition duration-300 shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-white font-display">Usage Analytics Dashboard</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Track API call counts, team seat quotas, CDN bandwidth meters, and live renewal countdown timers with threshold alerts.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <Link href="/dashboard" className="flex items-center gap-1 hover:underline">
                View Telemetry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition duration-300 shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-white font-display">Role-Based Admin Panel</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Three-tier RBAC system (Super Admin, Manager, User) for global MRR/ARR governance, manual plan overrides, and immutable audit logs.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold">
              <Link href="/admin" className="flex items-center gap-1 hover:underline">
                Admin Console <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Quick Pricing Preview */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white font-display">
              Transparent, Predictable Pricing
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              Upgrade, downgrade, or cancel at any time with automated proration and instant Stripe sync.
            </p>

            {/* Toggle */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition ${
                  billingCycle === 'MONTHLY' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('YEARLY')}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  billingCycle === 'YEARLY' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-slate-950 font-extrabold">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(PLANS).map((plan) => {
              const isCurrent = subscription?.tier === plan.id;
              const price = billingCycle === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-8 border flex flex-col justify-between transition ${
                    plan.popular
                      ? 'bg-gradient-to-b from-slate-900 to-indigo-950/60 border-brand-500 shadow-2xl scale-105'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      {plan.popular && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{plan.tagline}</p>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white font-mono">${price}</span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>

                    <div className="mt-6 space-y-2.5 pt-6 border-t border-slate-800">
                      {plan.features.slice(0, 5).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/pricing"
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold text-center block bg-slate-800 hover:bg-brand-500 hover:text-white transition text-slate-200"
                    >
                      Configure Tier
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
