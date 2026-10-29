'use client';

import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Subscription } from '@/types';

interface RenewalCountdownProps {
  subscription: Subscription | null;
  onManageClick?: () => void;
}

export default function RenewalCountdown({ subscription, onManageClick }: RenewalCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    percentage: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    percentage: 100,
  });

  useEffect(() => {
    if (!subscription?.currentPeriodEnd) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(subscription.currentPeriodEnd).getTime();
      const start = new Date(subscription.currentPeriodStart).getTime();

      const totalDuration = Math.max(1, end - start);
      const remaining = Math.max(0, end - now);
      const elapsed = totalDuration - remaining;
      const percentage = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, percentage });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [subscription]);

  if (!subscription) {
    return null;
  }

  const isCanceled = subscription.status === 'CANCELED' || subscription.cancelAtPeriodEnd;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 shadow-xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Billing Renewal Countdown</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              Period ends: {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCanceled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              Cancels at Period End
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Auto-Renewal Active
            </span>
          )}
        </div>
      </div>

      {/* Countdown Digits */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 my-6">
        {[
          { label: 'DAYS', value: timeLeft.days },
          { label: 'HOURS', value: timeLeft.hours },
          { label: 'MINUTES', value: timeLeft.minutes },
          { label: 'SECONDS', value: timeLeft.seconds },
        ].map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-inner"
          >
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar through billing cycle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Cycle Progress</span>
          <span className="font-mono text-slate-200">{timeLeft.percentage}% elapsed</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${timeLeft.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
