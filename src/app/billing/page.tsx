'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  FileText, 
  Download, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Terminal, 
  Sparkles,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import InvoiceTable from '@/components/InvoiceTable';
import WebhookSimulator from '@/components/WebhookSimulator';
import { PLANS, APP_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export default function BillingPage() {
  const { currentUser, subscription, invoices, addToast } = useApp();
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('4242 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardBrand, setCardBrand] = useState('Mastercard');

  const currentPlan = PLANS[subscription?.tier || 'PRO'];
  const nextAmount = subscription?.billingCycle === 'YEARLY' 
    ? (currentPlan?.yearlyPrice || 24) * 12 
    : (currentPlan?.monthlyPrice || 29);

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Payment Method Updated', `Default card set to ${cardBrand} ending in 9012.`);
    setShowCardModal(false);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CreditCard className="w-4 h-4" />
            <span>Automated Stripe Billing Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Billing & Invoices Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage payment methods, view automated receipts, download PDF invoices, and test Stripe webhooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            PCI-DSS Level 1 Encrypted
          </span>
        </div>
      </div>

      {/* Top 3 Billing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Current Plan Overview */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Subscription</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30">
                {subscription?.status || 'ACTIVE'}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-bold text-white font-display">
                {currentPlan?.name || 'Growth Pro'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Billed {subscription?.billingCycle?.toLowerCase() || 'monthly'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Next Billing Date:</span>
                <span className="text-white font-mono">
                  {subscription ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Scheduled Charge:</span>
                <span className="text-white font-mono font-bold">{formatCurrency(nextAmount)} USD</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <a
              href="/pricing"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition"
            >
              Modify Plan / Upgrade <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 2: Payment Method */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Default Payment Method</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                DEFAULT
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="w-12 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-brand-400">
                VISA
              </div>
              <div>
                <p className="text-sm font-semibold text-white font-mono">•••• •••• •••• 4242</p>
                <p className="text-xs text-slate-400">Expires 12/28</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <p>Charges will automatically debit to this card on your renewal date.</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setShowCardModal(true)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
            >
              Update Payment Card
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Stripe Vault</span>
          </div>
        </div>

        {/* Card 3: Tax & Invoicing Entity */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Invoice Information</span>
              <span className="text-xs text-slate-500 font-mono">VAT ID</span>
            </div>

            <div className="mt-4 text-xs space-y-1.5 text-slate-300">
              <p className="font-semibold text-white">{currentUser?.name}</p>
              <p className="text-slate-400">{currentUser?.company || 'Enterprise Customer'}</p>
              <p className="text-slate-400">{currentUser?.email}</p>
              <p className="text-slate-400">VAT / Tax ID: US-983210492</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Automated Receipt Delivery</span>
            <span className="text-emerald-400 font-semibold">Active (Email)</span>
          </div>
        </div>

      </div>

      {/* Invoice History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-400" />
              Invoice & Receipt History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click "Download PDF" on any transaction to generate and save an official itemized PDF invoice.
            </p>
          </div>
        </div>

        <InvoiceTable invoices={invoices} />
      </div>

      {/* Stripe Webhook Simulator Section */}
      <WebhookSimulator />

      {/* Update Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-white mb-2">Update Card Payment Method</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your test or live card number. Data will be vaulted via Stripe Elements.
            </p>

            <form onSubmit={handleUpdateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    CVC Code
                  </label>
                  <input
                    type="password"
                    defaultValue="892"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20"
                >
                  Save Payment Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
