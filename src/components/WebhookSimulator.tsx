'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw, 
  Code2, 
  Sparkles,
  Play
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function WebhookSimulator() {
  const { triggerWebhookSimulation, currentUser } = useApp();
  const [eventType, setEventType] = useState('invoice.payment_succeeded');
  const [amount, setAmount] = useState(29);
  const [isFiring, setIsFiring] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const eventTemplates: Record<string, any> = {
    'invoice.payment_succeeded': {
      event: 'invoice.payment_succeeded',
      description: 'Triggered when a recurring billing invoice is paid successfully.',
      defaultAmount: 29,
    },
    'invoice.payment_failed': {
      event: 'invoice.payment_failed',
      description: 'Triggered when customer credit card is declined or payment fails.',
      defaultAmount: 29,
    },
    'customer.subscription.updated': {
      event: 'customer.subscription.updated',
      description: 'Triggered when customer upgrades tier or toggles renewal.',
      tier: 'ENTERPRISE',
    },
    'customer.subscription.deleted': {
      event: 'customer.subscription.deleted',
      description: 'Triggered when subscription is canceled immediately.',
    },
  };

  const handleFireWebhook = async () => {
    setIsFiring(true);
    setLastResponse(null);
    try {
      const res = await triggerWebhookSimulation(eventType, {
        amount,
        tier: eventTemplates[eventType]?.tier || 'PRO',
      });
      setLastResponse({ success: true, ...res });
    } catch (err: any) {
      setLastResponse({ success: false, error: err.message });
    } finally {
      setIsFiring(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-400" />
            Stripe Webhooks Event Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch mock Stripe webhook events to verify automatic invoice creation & subscription state transitions.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 self-start sm:self-auto">
          Endpoint: /api/webhooks/stripe
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Stripe Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
                setLastResponse(null);
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
            >
              <option value="invoice.payment_succeeded">invoice.payment_succeeded</option>
              <option value="invoice.payment_failed">invoice.payment_failed</option>
              <option value="customer.subscription.updated">customer.subscription.updated</option>
              <option value="customer.subscription.deleted">customer.subscription.deleted</option>
            </select>
            <p className="text-xs text-slate-400 mt-1.5">
              {eventTemplates[eventType]?.description}
            </p>
          </div>

          {eventType.includes('payment') && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Simulated Invoice Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleFireWebhook}
              disabled={isFiring}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              {isFiring ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  <span>Transmitting Webhook Payload...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Dispatch Webhook Payload</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Payload / Response Console Preview */}
        <div className="rounded-xl bg-slate-950 border border-slate-800/90 p-4 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-brand-400" />
                Raw Webhook Body
              </span>
              <span className="text-[10px] text-emerald-400">JSON Payload</span>
            </div>

            <pre className="mt-3 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{JSON.stringify({
  id: `evt_test_${Math.floor(Math.random() * 900000)}`,
  object: 'event',
  type: eventType,
  api_version: '2024-06-20',
  data: {
    object: {
      customer: currentUser?.id,
      customer_email: currentUser?.email,
      amount: amount * 100,
      currency: 'usd',
      status: eventType.includes('failed') ? 'failed' : 'paid',
    }
  }
}, null, 2)}
            </pre>
          </div>

          {lastResponse && (
            <div className={`mt-3 p-2.5 rounded-lg border text-[11px] flex items-center justify-between ${
              lastResponse.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center gap-1.5">
                {lastResponse.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>HTTP 200: Event Processed</span>
              </div>
              <span className="text-[10px] opacity-80">{lastResponse.timestamp ? new Date(lastResponse.timestamp).toLocaleTimeString() : 'Success'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
