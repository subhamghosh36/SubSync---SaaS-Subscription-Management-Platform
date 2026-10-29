'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-blue-500/30 bg-slate-900/95 text-blue-200';
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40 bg-slate-900/95 text-emerald-200 shadow-emerald-500/10';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/40 bg-slate-900/95 text-rose-200 shadow-rose-500/10';
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/40 bg-slate-900/95 text-amber-200 shadow-amber-500/10';
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 text-sm">
              <h4 className="font-semibold text-white tracking-tight">{toast.title}</h4>
              <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
