'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { PlanDefinition, BillingCycle, PlanTier } from '@/types';
import { useApp } from '@/context/AppContext';

interface PlanCardProps {
  plan: PlanDefinition;
  billingCycle: BillingCycle;
  isCurrent: boolean;
  onSelect: (tier: PlanTier) => void;
  isLoading?: boolean;
}

export default function PlanCard({
  plan,
  billingCycle,
  isCurrent,
  onSelect,
  isLoading = false,
}: PlanCardProps) {
  const price = billingCycle === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;
  const isFree = plan.id === 'FREE';

  return (
    <div
      className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
        plan.popular
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/60 border-2 border-brand-500 shadow-2xl shadow-brand-500/10 scale-105 z-10'
          : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Most Popular
        </div>
      )}

      <div>
        {/* Tier Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white font-display">{plan.name}</h3>
          {isCurrent && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              Current Tier
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-slate-400 min-h-[36px]">{plan.tagline}</p>

        {/* Pricing */}
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-white font-mono">
            ${price}
          </span>
          <span className="text-sm font-medium text-slate-400">
            {isFree ? '' : billingCycle === 'YEARLY' ? '/ month (billed yearly)' : '/ month'}
          </span>
        </div>

        {billingCycle === 'YEARLY' && !isFree && (
          <p className="mt-1 text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            20% annual discount applied ($
            {price * 12}/year)
          </p>
        )}

        {/* Features List */}
        <div className="mt-8 space-y-3.5 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Features</p>
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
              <div className="w-5 h-5 rounded-full bg-brand-500/15 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-8 pt-4">
        <button
          onClick={() => onSelect(plan.id)}
          disabled={isCurrent || isLoading}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            isCurrent
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
              : plan.popular
              ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-brand-500/25 hover:shadow-brand-500/40'
              : 'bg-white hover:bg-slate-100 text-slate-900 hover:shadow-white/10'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : isCurrent ? (
            <span>Active Subscription</span>
          ) : (
            <>
              <span>{plan.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
