'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CreditCard,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { Invoice } from '@/types';
import { generateInvoicePDF } from '@/lib/pdfGenerator';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface InvoiceTableProps {
  invoices: Invoice[];
  showCustomerName?: boolean;
}

export default function InvoiceTable({ invoices, showCustomerName = false }: InvoiceTableProps) {
  const { currentUser, addToast } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'FAILED'>('ALL');
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filter === 'ALL' || inv.status === filter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.itemDescription.toLowerCase().includes(search.toLowerCase()) ||
      (inv.userName && inv.userName.toLowerCase().includes(search.toLowerCase())) ||
      (inv.userEmail && inv.userEmail.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleDownload = (invoice: Invoice) => {
    setDownloadingId(invoice.id);
    try {
      generateInvoicePDF(invoice, {
        name: invoice.userName || currentUser?.name,
        email: invoice.userEmail || currentUser?.email,
        company: currentUser?.company,
      });
      addToast('success', 'PDF Generated', `Downloaded invoice ${invoice.invoiceNumber}.pdf`);
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Download Failed', 'Could not render invoice PDF.');
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number, memo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-stretch sm:self-auto overflow-x-auto">
          {(['ALL', 'PAID', 'PENDING', 'FAILED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === tab
                  ? 'bg-brand-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-4 px-6">Invoice</th>
              {showCustomerName && <th className="py-4 px-6">Subscriber</th>}
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Method</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">PDF Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={showCustomerName ? 7 : 6} className="py-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No invoices found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const isPaid = inv.status === 'PAID';
                const isPending = inv.status === 'PENDING';
                return (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="font-mono font-semibold text-white">{inv.invoiceNumber}</div>
                      <div className="text-[11px] text-slate-400">{formatDate(inv.createdAt)}</div>
                    </td>

                    {showCustomerName && (
                      <td className="py-4 px-6">
                        <div className="font-medium text-white">{inv.userName || 'Customer'}</div>
                        <div className="text-[11px] text-slate-400">{inv.userEmail}</div>
                      </td>
                    )}

                    <td className="py-4 px-6">
                      <div className="text-slate-200 line-clamp-1">{inv.itemDescription}</div>
                      <div className="text-[11px] text-slate-400">{inv.billingReason}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-white">
                        {formatCurrency(inv.amount, inv.currency)}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inv.paymentMethodBrand || 'Visa'} •••• {inv.paymentMethodLast4 || '4242'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <AlertCircle className="w-3 h-3" />
                          Failed
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownload(inv)}
                        disabled={downloadingId === inv.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-brand-300 border border-slate-700 hover:border-brand-500/50 transition shadow-sm"
                        title="Download official PDF receipt"
                      >
                        <Download className="w-3.5 h-3.5 text-brand-400" />
                        <span>{downloadingId === inv.id ? 'Generating...' : 'Download PDF'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
