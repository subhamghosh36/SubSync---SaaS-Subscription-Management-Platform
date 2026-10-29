'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Zap, 
  Layers, 
  CreditCard, 
  BarChart3, 
  ShieldCheck, 
  ChevronDown, 
  Check, 
  Sparkles,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, users, switchUser, subscription } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Overview', href: '/', icon: Zap },
    { name: 'Plans & Pricing', href: '/pricing', icon: Layers },
    { name: 'Usage Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Billing & Invoices', href: '/billing', icon: CreditCard },
    { name: 'Admin RBAC', href: '/admin', icon: ShieldCheck, badge: 'RBAC' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-400 group-hover:scale-110 transition duration-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white font-display">SubSync</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    SaaS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block -mt-1 font-mono">Subscription Platform</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                      isActive
                        ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: RBAC User Switcher & Tier Indicator */}
          <div className="flex items-center gap-3">

            {/* Live Tier Badge */}
            {subscription && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                  {subscription.tier} {subscription.billingCycle.toLowerCase()}
                </span>
              </div>
            )}

            {/* RBAC Role & Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-inner group"
                title="Switch Persona / Role for evaluation"
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs font-medium text-white tracking-tight flex items-center gap-1 justify-end">
                    {currentUser?.name || 'Loading...'}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    currentUser?.role === 'SUPER_ADMIN' 
                      ? 'text-cyan-400' 
                      : currentUser?.role === 'MANAGER' 
                      ? 'text-purple-400' 
                      : 'text-emerald-400'
                  }`}>
                    {currentUser?.role?.replace('_', ' ')}
                  </span>
                </div>

                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white">
                      {currentUser?.name?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
              </button>

              {/* Persona Switcher Dropdown */}
              {roleDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 p-2 animate-in fade-in-50 zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                        Role Impersonation Switcher
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Switch accounts to test RBAC security levels:
                      </p>
                    </div>

                    <div className="space-y-1">
                      {users.map((user) => {
                        const isSelected = user.id === currentUser?.id;
                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              switchUser(user.id);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition ${
                              isSelected
                                ? 'bg-brand-500/15 border border-brand-500/30 text-white'
                                : 'hover:bg-slate-800/60 text-slate-300'
                            }`}
                          >
                            <img
                              src={user.avatar || `https://avatar.vercel.sh/${user.name}`}
                              alt={user.name}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                  user.role === 'SUPER_ADMIN'
                                    ? 'bg-cyan-500/20 text-cyan-300'
                                    : user.role === 'MANAGER'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-emerald-500/20 text-emerald-300'
                                }`}>
                                  {user.role === 'SUPER_ADMIN' ? 'Admin' : user.role}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-brand-400" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
