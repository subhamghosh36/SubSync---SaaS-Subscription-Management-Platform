'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserX, 
  UserCheck, 
  Sliders, 
  Search, 
  Lock, 
  AlertTriangle,
  Plus,
  RefreshCw,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { User, PlanTier } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import OverridePlanModal from '@/components/OverridePlanModal';
import AuditLogViewer from '@/components/AuditLogViewer';
import InvoiceTable from '@/components/InvoiceTable';

export default function AdminPage() {
  const { 
    currentUser, 
    users, 
    metrics, 
    auditLogs, 
    allInvoices, 
    toggleUserStatus, 
    switchUser, 
    addToast 
  } = useApp();

  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'SUPER_ADMIN' | 'MANAGER' | 'USER'>('ALL');
  const [overrideModalUser, setOverrideModalUser] = useState<User | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'MANAGER' | 'USER'>('USER');

  // RBAC Permission Check
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isManager = currentUser?.role === 'MANAGER';
  const hasAccess = isSuperAdmin || isManager;

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(searchUser.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    addToast('success', 'Invitation Sent', `Sent workspace seat invite to ${inviteEmail} as ${inviteRole}.`);
    setInviteEmail('');
    setInviteModalOpen(false);
  };

  // If role is regular USER, show RBAC Gate with 1-click persona switch
  if (!hasAccess) {
    return (
      <div className="py-20 px-4 max-w-2xl mx-auto text-center flex-1 flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-white font-display">
          RBAC Access Restricted
        </h1>
        <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-md">
          You are currently signed in as <span className="text-white font-semibold">{currentUser?.name}</span> with standard{' '}
          <span className="font-bold text-emerald-400 uppercase">USER</span> role. Access to the Admin & Global Financial Control Plane requires{' '}
          <span className="font-bold text-cyan-400 uppercase">SUPER_ADMIN</span> or <span className="font-bold text-purple-400 uppercase">MANAGER</span> privileges.
        </p>

        <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 w-full text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Test RBAC Permission Escalation
          </p>
          <div className="space-y-2">
            <button
              onClick={() => switchUser('usr_super_alex')}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-between"
            >
              <span>Impersonate Alex Vance (Super Admin)</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => switchUser('usr_manager_sarah')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-between"
            >
              <span>Impersonate Sarah Chen (Manager)</span>
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Role-Based Access Control • {currentUser?.role} Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Global SaaS Control Plane
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time MRR/ARR financial analytics, account governance, manual plan overrides, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Global Financial SaaS Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Global MRR</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {formatCurrency(metrics?.mrr || 48920)}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">+{metrics?.mrrGrowth || 18.4}% MoM</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Annual Run-Rate</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {formatCurrency(metrics?.arr || 587040)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Contract ARR</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Subscribers</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {(metrics?.activeSubscribers || 1420).toLocaleString()}
          </p>
          <p className="text-[10px] text-indigo-400 mt-1">Paying + Free</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Churn Rate</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {metrics?.churnRate || 1.4}%
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">Monthly churn</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ARPU (Per User)</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            ${metrics?.arpu || 34.45}
          </p>
          <p className="text-[10px] text-cyan-400 mt-1">Average Revenue</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customer LTV</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            ${(metrics?.ltv || 2150).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">Lifetime Value</p>
        </div>

      </div>

      {/* Subscribers Tier Breakdown Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
          <span>Subscriber Tier Distribution</span>
          <span className="font-mono text-white">
            Free: {metrics?.subscribersByTier.free || 980} | Pro: {metrics?.subscribersByTier.pro || 360} | Enterprise: {metrics?.subscribersByTier.enterprise || 80}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-950 flex overflow-hidden">
          <div style={{ width: '68%' }} className="bg-slate-700" title="Free (68%)" />
          <div style={{ width: '25%' }} className="bg-indigo-500" title="Pro (25%)" />
          <div style={{ width: '7%' }} className="bg-cyan-400" title="Enterprise (7%)" />
        </div>
      </div>

      {/* User Accounts Management Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              User Account Governance & Overrides
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Super Admins have authority to execute manual plan overrides and toggle account active status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {(['ALL', 'SUPER_ADMIN', 'MANAGER', 'USER'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    roleFilter === r ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r === 'SUPER_ADMIN' ? 'Admin' : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">User / Identity</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Organization</th>
                <th className="py-4 px-6 text-right">Administrative Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => {
                const isActive = user.status === 'ACTIVE';
                return (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || `https://avatar.vercel.sh/${user.name}`}
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        user.role === 'SUPER_ADMIN'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : user.role === 'MANAGER'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-300">
                      {user.company || 'Personal Account'}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isSuperAdmin && (
                          <button
                            onClick={() => setOverrideModalUser(user)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition flex items-center gap-1"
                            title="Manually override plan tier"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Override Plan</span>
                          </button>
                        )}

                        {isSuperAdmin && user.id !== currentUser?.id && (
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`p-1.5 rounded-lg border transition ${
                              isActive
                                ? 'bg-slate-800 text-rose-400 border-slate-700 hover:bg-rose-500/10 hover:border-rose-500/30'
                                : 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-emerald-500/10 hover:border-emerald-500/30'
                            }`}
                            title={isActive ? 'Suspend User' : 'Activate User'}
                          >
                            {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Invoices Log across all users */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            Global Platform Invoices & Settlements
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full ledger of all tenant charges, renewal transactions, and PDF receipts.
          </p>
        </div>
        <InvoiceTable invoices={allInvoices} showCustomerName={true} />
      </div>

      {/* Security Audit Log Stream */}
      <AuditLogViewer logs={auditLogs} />

      {/* Manual Plan Override Modal */}
      {overrideModalUser && (
        <OverridePlanModal
          user={overrideModalUser}
          onClose={() => setOverrideModalUser(null)}
        />
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Invite Workspace Member</h3>
            <p className="text-xs text-slate-400 mb-4">
              Send an invite to allocate a team seat with designated RBAC privileges.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Assign RBAC Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteRole('USER')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      inviteRole === 'USER'
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteRole('MANAGER')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      inviteRole === 'MANAGER'
                        ? 'bg-purple-500 text-white font-bold border-purple-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Manager
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
