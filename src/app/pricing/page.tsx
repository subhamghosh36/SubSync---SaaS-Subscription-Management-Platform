'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X as XIcon, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PLANS } from '@/lib/constants';
import PlanCard from '@/components/PlanCard';
import { PlanTier, BillingCycle } from '@/types';

export default function PricingPage() {
  const { subscription, changePlan, cancelCurrentSubscription, currentUser } = useApp();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    subscription?.billingCycle || 'MONTHLY'
  );
  const [isChanging, setIsChanging] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found another solution');

  const handleSelectPlan = async (tier: PlanTier) => {
    setIsChanging(true);
    await changePlan(tier, billingCycle);
    setIsChanging(false);
  };

  const handleConfirmCancel = async () => {
    setIsChanging(true);
    await cancelCurrentSubscription();
    setIsChanging(false);
    setCancelModalOpen(false);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          Subscription Plans & Dynamic Upgrades
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
          Scale with Predictable, Transparent Tiers
        </h1>
        <p className="mt-4 text-base text-slate-300">
          Switch tiers anytime. Upgrades take effect immediately with automated prorations. Downgrades and cancellations remain active until your billing cycle ends.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="mt-10 inline-flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              billingCycle === 'MONTHLY'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              billingCycle === 'YEARLY'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-900">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {Object.values(PLANS).map((plan) => {
          const isCurrent = subscription?.tier === plan.id;
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              isCurrent={isCurrent}
              onSelect={handleSelectPlan}
              isLoading={isChanging}
            />
          );
        })}
      </div>

      {/* Active Subscription Banner & Graceful Cancellation trigger */}
      {subscription && subscription.tier !== 'FREE' && (
        <div className="mt-16 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-400" />
              Active Subscription: {subscription.tier} Plan ({subscription.billingCycle.toLowerCase()})
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Current billing period ends on{' '}
              <span className="text-slate-200 font-mono">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
              . You can change plans or cancel at any time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {subscription.cancelAtPeriodEnd ? (
              <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                Scheduled for Cancellation
              </span>
            ) : (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      )}

      {/* Comprehensive Feature Comparison Matrix */}
      <div className="mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            In-Depth Feature Comparison Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Detailed breakdown of limits, security quotas, and developer features across all 3 tiers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 w-1/3">Feature / Capability</th>
                <th className="py-4 px-6 text-center">Developer Free</th>
                <th className="py-4 px-6 text-center text-brand-400">Growth Pro</th>
                <th className="py-4 px-6 text-center text-cyan-400">Scale Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs sm:text-sm">
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Monthly API Quota</td>
                <td className="py-3.5 px-6 text-center font-mono text-slate-300">10,000 req</td>
                <td className="py-3.5 px-6 text-center font-mono text-brand-300 font-semibold">500,000 req</td>
                <td className="py-3.5 px-6 text-center font-mono text-cyan-300 font-semibold">10,000,000+ req</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Team Member Seats</td>
                <td className="py-3.5 px-6 text-center font-mono text-slate-300">1 Seat</td>
                <td className="py-3.5 px-6 text-center font-mono text-brand-300 font-semibold">5 Seats</td>
                <td className="py-3.5 px-6 text-center font-mono text-cyan-300 font-semibold">25+ Custom Seats</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">CDN Bandwidth Allocation</td>
                <td className="py-3.5 px-6 text-center font-mono text-slate-300">5 GB / mo</td>
                <td className="py-3.5 px-6 text-center font-mono text-brand-300 font-semibold">50 GB / mo</td>
                <td className="py-3.5 px-6 text-center font-mono text-cyan-300 font-semibold">500 GB / mo</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Rate Limit Enforcement</td>
                <td className="py-3.5 px-6 text-center font-mono text-slate-300">60 req / min</td>
                <td className="py-3.5 px-6 text-center font-mono text-brand-300 font-semibold">600 req / min</td>
                <td className="py-3.5 px-6 text-center font-mono text-cyan-300 font-semibold">3,000+ req / min</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Automated PDF Invoices</td>
                <td className="py-3.5 px-6 text-center text-slate-500">—</td>
                <td className="py-3.5 px-6 text-center text-emerald-400">
                  <Check className="w-4 h-4 mx-auto" />
                </td>
                <td className="py-3.5 px-6 text-center text-emerald-400">
                  <Check className="w-4 h-4 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Stripe Webhooks & Simulator</td>
                <td className="py-3.5 px-6 text-center text-slate-500">—</td>
                <td className="py-3.5 px-6 text-center text-emerald-400">
                  <Check className="w-4 h-4 mx-auto" />
                </td>
                <td className="py-3.5 px-6 text-center text-emerald-400">
                  <Check className="w-4 h-4 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Role-Based Access Control (RBAC)</td>
                <td className="py-3.5 px-6 text-center text-slate-500">Standard User</td>
                <td className="py-3.5 px-6 text-center text-slate-300">Manager + User</td>
                <td className="py-3.5 px-6 text-center text-cyan-300 font-semibold">Super Admin + Full RBAC</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Audit Log Retention</td>
                <td className="py-3.5 px-6 text-center font-mono text-slate-400">7 Days</td>
                <td className="py-3.5 px-6 text-center font-mono text-slate-300">90 Days</td>
                <td className="py-3.5 px-6 text-center font-mono text-cyan-300 font-semibold">Unlimited (Immutable)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Support SLA</td>
                <td className="py-3.5 px-6 text-center text-slate-400">Community Discord</td>
                <td className="py-3.5 px-6 text-center text-slate-300">4-Hour Priority Email</td>
                <td className="py-3.5 px-6 text-center text-cyan-300 font-semibold">24/7 Dedicated Slack Channel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
            <div className="flex items-center gap-3 text-rose-400 pb-3 border-b border-slate-800">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Cancel Your Subscription?</h3>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              We are sorry to see you go. Your subscription will remain active until the end of your billing cycle on{' '}
              <span className="font-semibold text-white">
                {new Date(subscription?.currentPeriodEnd || '').toLocaleDateString()}
              </span>
              . After that date, your account will downgrade to Developer Free.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Reason for cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Found another solution">Found another solution</option>
                <option value="Too expensive for current stage">Too expensive for current stage</option>
                <option value="Missing features I need">Missing features I need</option>
                <option value="Temporary project completed">Temporary project completed</option>
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/20"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
