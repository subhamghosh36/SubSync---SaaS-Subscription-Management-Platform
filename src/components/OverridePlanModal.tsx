'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Check, Loader2 } from 'lucide-react';
import { User, PlanTier, BillingCycle } from '@/types';
import { useApp } from '@/context/AppContext';

interface OverridePlanModalProps {
  user: User;
  onClose: () => void;
}

export default function OverridePlanModal({ user, onClose }: OverridePlanModalProps) {
  const { overrideUserPlan } = useApp();
  const [selectedTier, setSelectedTier] = useState<PlanTier>('ENTERPRISE');
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('YEARLY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await overrideUserPlan(user.id, selectedTier, selectedCycle);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manual Plan Override</h3>
              <p className="text-xs text-slate-400">Super Admin Administrative Privileges</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400">Target User:</span>{' '}
            <span className="font-semibold text-white">{user.name}</span> ({user.email})
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Target Tier
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['FREE', 'PRO', 'ENTERPRISE'] as const).map((tier) => (
                <button
                  type="button"
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    selectedTier === tier
                      ? 'bg-brand-500 text-white border-brand-400 shadow-lg shadow-brand-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Billing Interval
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(['MONTHLY', 'YEARLY'] as const).map((cycle) => (
                <button
                  type="button"
                  key={cycle}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    selectedCycle === cycle
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300">
            Override action grants immediate access, resets quotas to target tier specifications, and logs an immutable audit trail entry.
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-brand-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Applying Override...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Plan Override</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
