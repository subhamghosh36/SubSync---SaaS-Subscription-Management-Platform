'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Subscription, 
  UsageMetrics, 
  Invoice, 
  AuditLog, 
  SaaSMetrics, 
  PlanTier, 
  BillingCycle,
  Role
} from '@/types';
import { PLANS } from '@/lib/constants';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  subscription: Subscription | null;
  usage: UsageMetrics | null;
  invoices: Invoice[];
  allInvoices: Invoice[];
  auditLogs: AuditLog[];
  metrics: SaaSMetrics | null;
  isLoading: boolean;
  toasts: Toast[];
  addToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  switchUser: (userId: string) => void;
  changePlan: (tier: PlanTier, billingCycle: BillingCycle) => Promise<boolean>;
  cancelCurrentSubscription: () => Promise<boolean>;
  simulateUsage: (metric: 'apiCalls' | 'seats' | 'bandwidth', amount: number) => Promise<void>;
  resetUsage: () => Promise<void>;
  overrideUserPlan: (userId: string, tier: PlanTier, cycle: BillingCycle) => Promise<boolean>;
  toggleUserStatus: (userId: string) => Promise<boolean>;
  triggerWebhookSimulation: (eventType: string, payload?: any) => Promise<any>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageMetrics | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState<SaaSMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchData = useCallback(async (targetUserId?: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/app-state${targetUserId ? `?userId=${targetUserId}` : ''}`);
      if (!res.ok) throw new Error('Failed to load application state');
      const data = await res.json();

      setUsers(data.users || []);
      const activeUser = targetUserId 
        ? data.users.find((u: User) => u.id === targetUserId) || data.currentUser
        : data.currentUser;
      
      setCurrentUser(activeUser);
      setSubscription(data.subscription || null);
      setUsage(data.usage || null);
      setInvoices(data.invoices || []);
      setAllInvoices(data.allInvoices || []);
      setAuditLogs(data.auditLogs || []);
      setMetrics(data.metrics || null);
    } catch (err: any) {
      console.error('Error fetching app data:', err);
      addToast('error', 'Sync Failed', 'Could not fetch latest backend updates.');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const switchUser = async (userId: string) => {
    await fetchData(userId);
    const selected = users.find((u) => u.id === userId);
    if (selected) {
      addToast('info', 'RBAC View Switched', `Now viewing platform as ${selected.name} (${selected.role})`);
    }
  };

  const changePlan = async (tier: PlanTier, billingCycle: BillingCycle): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          tier,
          billingCycle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update plan');

      // Trigger Confetti effect on upgrade!
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#8B5CF6', '#EC4899', '#06B6D4'],
        });
      }

      addToast(
        'success',
        'Plan Updated Successfully!',
        `Your subscription is now on ${PLANS[tier]?.name || tier} (${billingCycle.toLowerCase()}).`
      );

      await fetchData(currentUser.id);
      return true;
    } catch (err: any) {
      addToast('error', 'Upgrade Error', err.message);
      return false;
    }
  };

  const cancelCurrentSubscription = async (): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (!res.ok) throw new Error('Cancellation request failed');

      addToast(
        'warning',
        'Subscription Set to Cancel',
        'Your access will remain active until the end of your current billing period.'
      );
      await fetchData(currentUser.id);
      return true;
    } catch (err: any) {
      addToast('error', 'Cancellation Failed', err.message);
      return false;
    }
  };

  const simulateUsage = async (metric: 'apiCalls' | 'seats' | 'bandwidth', amount: number) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/usage/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          metric,
          amount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record usage');

      setUsage(data.usage);
      addToast('info', 'Usage Simulated', `Incremented ${metric} by ${amount.toLocaleString()}`);

      // Check if threshold warning is reached
      if (data.usage) {
        const pct = (data.usage.apiCallsCount / data.usage.apiCallsLimit) * 100;
        if (pct >= 90) {
          addToast('warning', 'High Quota Alert', `API consumption is at ${pct.toFixed(0)}% of tier capacity.`);
        }
      }
    } catch (err: any) {
      addToast('error', 'Simulation Error', err.message);
    }
  };

  const resetUsage = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/usage/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await res.json();
      setUsage(data.usage);
      addToast('success', 'Quota Reset', 'Usage metrics have been reset for testing.');
    } catch (err: any) {
      addToast('error', 'Reset Failed', err.message);
    }
  };

  const overrideUserPlan = async (userId: string, tier: PlanTier, cycle: BillingCycle): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: userId,
          tier,
          billingCycle: cycle,
          adminEmail: currentUser?.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Manual override failed');

      addToast('success', 'Plan Overridden', `Target user successfully assigned ${tier} tier.`);
      await fetchData(currentUser?.id);
      return true;
    } catch (err: any) {
      addToast('error', 'Override Error', err.message);
      return false;
    }
  };

  const toggleUserStatus = async (userId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: userId,
          adminEmail: currentUser?.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Status update failed');

      addToast('info', 'Status Updated', `User account status changed.`);
      await fetchData(currentUser?.id);
      return true;
    } catch (err: any) {
      addToast('error', 'Status Update Error', err.message);
      return false;
    }
  };

  const triggerWebhookSimulation = async (eventType: string, payload?: any) => {
    try {
      const res = await fetch('/api/webhooks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          userId: currentUser?.id,
          payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Webhook test failed');

      addToast('success', 'Webhook Dispatched', `Received 200 OK for event "${eventType}".`);
      await fetchData(currentUser?.id);
      return data;
    } catch (err: any) {
      addToast('error', 'Webhook Error', err.message);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        subscription,
        usage,
        invoices,
        allInvoices,
        auditLogs,
        metrics,
        isLoading,
        toasts,
        addToast,
        removeToast,
        switchUser,
        changePlan,
        cancelCurrentSubscription,
        simulateUsage,
        resetUsage,
        overrideUserPlan,
        toggleUserStatus,
        triggerWebhookSimulation,
        refreshData: () => fetchData(currentUser?.id),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
