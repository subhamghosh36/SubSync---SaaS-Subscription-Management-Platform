import React from 'react';
import Link from 'next/link';
import { Zap, Github, Shield, Heart } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <div>
              <p className="font-bold text-white text-sm">SubSync</p>
              <p className="text-[11px] text-slate-500">Enterprise SaaS Subscription Engine</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link href="/pricing" className="hover:text-white transition">Plans</Link>
            <Link href="/dashboard" className="hover:text-white transition">Telemetry</Link>
            <Link href="/billing" className="hover:text-white transition">Invoices</Link>
            <Link href="/admin" className="hover:text-white transition">RBAC Portal</Link>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span>Built with Next.js, Node.js, PostgreSQL & Stripe</span>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-[11px]">
          <p>© {new Date().getFullYear()} {APP_CONFIG.company.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              SOC2 Type II Certified
            </span>
            <span>•</span>
            <span>PCI-DSS Level 1 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
