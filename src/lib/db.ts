import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { 
  User, 
  Subscription, 
  UsageMetrics, 
  Invoice, 
  AuditLog, 
  SaaSMetrics,
  PlanTier,
  BillingCycle,
  SubscriptionStatus
} from '@/types';
import { PLANS } from './constants';

// Prisma singleton
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// File-backed fallback repository for local/demo/PostgreSQL fallback
interface StoreData {
  users: User[];
  subscriptions: Subscription[];
  usages: UsageMetrics[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  metrics: SaaSMetrics;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'subsync_store.json');

const INITIAL_DATA: StoreData = {
  users: [
    {
      id: 'usr_super_alex',
      email: 'alex.vance@subsync.io',
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      company: 'SubSync Core Ops',
      apiKey: 'sub_live_sk_9482049182390149021',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z',
    },
    {
      id: 'usr_manager_sarah',
      email: 'sarah.chen@innovate.co',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'MANAGER',
      status: 'ACTIVE',
      company: 'Innovate AI Labs',
      apiKey: 'sub_live_sk_8192038102948201940',
      createdAt: '2024-02-15T11:20:00Z',
      updatedAt: '2024-02-15T11:20:00Z',
    },
    {
      id: 'usr_david_dev',
      email: 'david.miller@devflow.org',
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'USER',
      status: 'ACTIVE',
      company: 'DevFlow Open Source',
      apiKey: 'sub_live_sk_1839201928401928471',
      createdAt: '2024-03-01T14:45:00Z',
      updatedAt: '2024-03-01T14:45:00Z',
    },
    {
      id: 'usr_elena_cloud',
      email: 'elena.rostova@cloudscale.net',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'MANAGER',
      status: 'ACTIVE',
      company: 'CloudScale Infra',
      apiKey: 'sub_live_sk_4918204918293849102',
      createdAt: '2024-03-12T08:15:00Z',
      updatedAt: '2024-03-12T08:15:00Z',
    },
    {
      id: 'usr_marcus_fin',
      email: 'marcus.vance@fintechone.com',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'USER',
      status: 'SUSPENDED',
      company: 'FintechOne Ltd',
      apiKey: 'sub_live_sk_7391029384019283746',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-04-05T12:00:00Z',
    },
  ],
  subscriptions: [
    {
      id: 'sub_enterprise_alex',
      userId: 'usr_super_alex',
      tier: 'ENTERPRISE',
      billingCycle: 'YEARLY',
      status: 'ACTIVE',
      stripeCustomerId: 'cus_AlexVance9901',
      stripeSubscriptionId: 'sub_live_ent_9918230',
      stripePriceId: 'price_ent_yearly_984',
      currentPeriodStart: new Date(Date.now() - 45 * 86400000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 320 * 86400000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z',
    },
    {
      id: 'sub_pro_sarah',
      userId: 'usr_manager_sarah',
      tier: 'PRO',
      billingCycle: 'MONTHLY',
      status: 'ACTIVE',
      stripeCustomerId: 'cus_SarahChen2049',
      stripeSubscriptionId: 'sub_live_pro_2049182',
      stripePriceId: 'price_pro_monthly_29',
      currentPeriodStart: new Date(Date.now() - 12 * 86400000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 18 * 86400000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: '2024-02-15T11:20:00Z',
      updatedAt: '2024-02-15T11:20:00Z',
    },
    {
      id: 'sub_free_david',
      userId: 'usr_david_dev',
      tier: 'FREE',
      billingCycle: 'MONTHLY',
      status: 'ACTIVE',
      currentPeriodStart: new Date(Date.now() - 5 * 86400000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 25 * 86400000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: '2024-03-01T14:45:00Z',
      updatedAt: '2024-03-01T14:45:00Z',
    },
    {
      id: 'sub_pro_elena',
      userId: 'usr_elena_cloud',
      tier: 'PRO',
      billingCycle: 'YEARLY',
      status: 'ACTIVE',
      stripeCustomerId: 'cus_ElenaRostova391',
      stripeSubscriptionId: 'sub_live_pro_3918204',
      stripePriceId: 'price_pro_yearly_288',
      currentPeriodStart: new Date(Date.now() - 60 * 86400000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 305 * 86400000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: '2024-03-12T08:15:00Z',
      updatedAt: '2024-03-12T08:15:00Z',
    },
    {
      id: 'sub_free_marcus',
      userId: 'usr_marcus_fin',
      tier: 'FREE',
      billingCycle: 'MONTHLY',
      status: 'CANCELED',
      currentPeriodStart: new Date(Date.now() - 90 * 86400000).toISOString(),
      currentPeriodEnd: new Date(Date.now() - 30 * 86400000).toISOString(),
      cancelAtPeriodEnd: true,
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-04-05T12:00:00Z',
    },
  ],
  usages: [
    {
      id: 'usg_alex',
      userId: 'usr_super_alex',
      apiCallsCount: 4210500,
      apiCallsLimit: 10000000,
      seatCount: 14,
      seatLimit: 25,
      bandwidthMb: 245760, // ~240 GB
      bandwidthLimitMb: 512000, // 500 GB
      storageUsedMb: 89400,
      storageLimitMb: 204800,
      lastResetDate: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usg_sarah',
      userId: 'usr_manager_sarah',
      apiCallsCount: 382400,
      apiCallsLimit: 500000,
      seatCount: 4,
      seatLimit: 5,
      bandwidthMb: 42100, // 42 GB (82% - warning)
      bandwidthLimitMb: 51200,
      storageUsedMb: 18200,
      storageLimitMb: 25600,
      lastResetDate: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usg_david',
      userId: 'usr_david_dev',
      apiCallsCount: 8920,
      apiCallsLimit: 10000,
      seatCount: 1,
      seatLimit: 1,
      bandwidthMb: 4200, // 4.2 GB of 5 GB (84%)
      bandwidthLimitMb: 5120,
      storageUsedMb: 820,
      storageLimitMb: 1024,
      lastResetDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  invoices: [
    {
      id: 'inv_109283',
      invoiceNumber: 'INV-2024-001',
      userId: 'usr_super_alex',
      userEmail: 'alex.vance@subsync.io',
      userName: 'Alex Vance',
      amount: 984.00,
      subtotal: 984.00,
      taxAmount: 0.00,
      currency: 'USD',
      status: 'PAID',
      billingReason: 'Enterprise Annual Tier Renewal',
      itemDescription: 'Scale Enterprise Plan (1 Year Access, 25 Seats, 10M API requests)',
      items: [
        { description: 'Scale Enterprise Annual License', quantity: 1, unitPrice: 984.00, amount: 984.00 },
      ],
      paymentMethodLast4: '4242',
      paymentMethodBrand: 'Mastercard',
      paidAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    },
    {
      id: 'inv_109284',
      invoiceNumber: 'INV-2024-002',
      userId: 'usr_manager_sarah',
      userEmail: 'sarah.chen@innovate.co',
      userName: 'Sarah Chen',
      amount: 29.00,
      subtotal: 29.00,
      taxAmount: 0.00,
      currency: 'USD',
      status: 'PAID',
      billingReason: 'Monthly Pro Subscription',
      itemDescription: 'Growth Pro Plan (Monthly Recurring, 5 Seats, 500K API requests)',
      items: [
        { description: 'Growth Pro Monthly Subscription', quantity: 1, unitPrice: 29.00, amount: 29.00 },
      ],
      paymentMethodLast4: '8812',
      paymentMethodBrand: 'Visa',
      paidAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: 'inv_109285',
      invoiceNumber: 'INV-2024-003',
      userId: 'usr_elena_cloud',
      userEmail: 'elena.rostova@cloudscale.net',
      userName: 'Elena Rostova',
      amount: 288.00,
      subtotal: 288.00,
      taxAmount: 0.00,
      currency: 'USD',
      status: 'PAID',
      billingReason: 'Annual Pro Subscription',
      itemDescription: 'Growth Pro Plan (1 Year Access with 20% discount applied)',
      items: [
        { description: 'Growth Pro Annual Subscription', quantity: 1, unitPrice: 288.00, amount: 288.00 },
      ],
      paymentMethodLast4: '1094',
      paymentMethodBrand: 'American Express',
      paidAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: 'inv_109286',
      invoiceNumber: 'INV-2024-004',
      userId: 'usr_manager_sarah',
      userEmail: 'sarah.chen@innovate.co',
      userName: 'Sarah Chen',
      amount: 29.00,
      subtotal: 29.00,
      taxAmount: 0.00,
      currency: 'USD',
      status: 'PAID',
      billingReason: 'Monthly Pro Subscription Renewal',
      itemDescription: 'Growth Pro Plan (Monthly Recurring, 5 Seats, 500K API requests)',
      items: [
        { description: 'Growth Pro Monthly Subscription', quantity: 1, unitPrice: 29.00, amount: 29.00 },
      ],
      paymentMethodLast4: '8812',
      paymentMethodBrand: 'Visa',
      paidAt: new Date(Date.now() - 42 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 42 * 86400000).toISOString(),
    },
  ],
  auditLogs: [
    {
      id: 'log_01',
      actorEmail: 'alex.vance@subsync.io',
      action: 'SYSTEM_BOOT',
      details: { platform: 'SubSync v1.0', environment: 'Production' },
      ipAddress: '192.168.1.101',
      createdAt: new Date(Date.now() - 100 * 86400000).toISOString(),
    },
    {
      id: 'log_02',
      actorEmail: 'sarah.chen@innovate.co',
      action: 'PLAN_UPGRADE',
      details: { fromTier: 'FREE', toTier: 'PRO', cycle: 'MONTHLY', amount: 29.00 },
      ipAddress: '104.28.19.45',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    {
      id: 'log_03',
      actorEmail: 'alex.vance@subsync.io',
      action: 'PLAN_OVERRIDE',
      details: { targetUser: 'elena.rostova@cloudscale.net', action: 'ENTERPRISE_TRIAL_GRANTED' },
      ipAddress: '192.168.1.101',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'log_04',
      actorEmail: 'stripe_webhook',
      action: 'WEBHOOK_PROCESSED',
      details: { event: 'invoice.payment_succeeded', invoiceNumber: 'INV-2024-002', amount: 29.00 },
      ipAddress: '54.187.205.235',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
  ],
  metrics: {
    mrr: 48920,
    arr: 587040,
    mrrGrowth: 18.4,
    activeSubscribers: 1420,
    churnRate: 1.4,
    ltv: 2150,
    arpu: 34.45,
    subscribersByTier: {
      free: 980,
      pro: 360,
      enterprise: 80,
    },
    revenueHistory: [
      { month: 'Jan', revenue: 31200, subscriptions: 890 },
      { month: 'Feb', revenue: 34500, subscriptions: 980 },
      { month: 'Mar', revenue: 38900, subscriptions: 1120 },
      { month: 'Apr', revenue: 42100, subscriptions: 1240 },
      { month: 'May', revenue: 45600, subscriptions: 1330 },
      { month: 'Jun', revenue: 48920, subscriptions: 1420 },
    ],
  },
};

// Safe file I/O helper
function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed reading store file, using initial data:', err);
  }
  saveStore(INITIAL_DATA);
  return INITIAL_DATA;
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed saving store file:', err);
  }
}

// Exported Repository Methods
export async function getUsers(): Promise<User[]> {
  const store = loadStore();
  return store.users;
}

export async function getUserById(id: string): Promise<User | null> {
  const store = loadStore();
  return store.users.find((u) => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const store = loadStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const store = loadStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  store.users[idx] = { ...store.users[idx], ...updates, updatedAt: new Date().toISOString() };
  saveStore(store);
  return store.users[idx];
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const store = loadStore();
  return store.subscriptions.find((s) => s.userId === userId) || null;
}

export async function updateSubscription(
  userId: string,
  tier: PlanTier,
  billingCycle: BillingCycle = 'MONTHLY',
  status: SubscriptionStatus = 'ACTIVE',
  cancelAtPeriodEnd: boolean = false
): Promise<Subscription> {
  const store = loadStore();
  const idx = store.subscriptions.findIndex((s) => s.userId === userId);
  
  const now = new Date();
  const periodDays = billingCycle === 'YEARLY' ? 365 : 30;
  const periodEnd = new Date(now.getTime() + periodDays * 86400000);

  let updatedSub: Subscription;
  if (idx !== -1) {
    updatedSub = {
      ...store.subscriptions[idx],
      tier,
      billingCycle,
      status,
      cancelAtPeriodEnd,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      updatedAt: now.toISOString(),
    };
    store.subscriptions[idx] = updatedSub;
  } else {
    updatedSub = {
      id: `sub_${Date.now()}`,
      userId,
      tier,
      billingCycle,
      status,
      cancelAtPeriodEnd,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    store.subscriptions.push(updatedSub);
  }

  // Update usage limits according to the new tier
  const plan = PLANS[tier];
  if (plan) {
    const uIdx = store.usages.findIndex((u) => u.userId === userId);
    if (uIdx !== -1) {
      store.usages[uIdx].apiCallsLimit = plan.limits.apiCalls;
      store.usages[uIdx].seatLimit = plan.limits.seats;
      store.usages[uIdx].bandwidthLimitMb = plan.limits.bandwidthMb;
      store.usages[uIdx].storageLimitMb = plan.limits.storageMb;
      store.usages[uIdx].updatedAt = now.toISOString();
    }
  }

  saveStore(store);
  return updatedSub;
}

export async function getUsage(userId: string): Promise<UsageMetrics> {
  const store = loadStore();
  let usage = store.usages.find((u) => u.userId === userId);
  if (!usage) {
    const sub = store.subscriptions.find((s) => s.userId === userId);
    const plan = PLANS[sub?.tier || 'FREE'];
    usage = {
      id: `usg_${Date.now()}`,
      userId,
      apiCallsCount: 0,
      apiCallsLimit: plan.limits.apiCalls,
      seatCount: 1,
      seatLimit: plan.limits.seats,
      bandwidthMb: 0,
      bandwidthLimitMb: plan.limits.bandwidthMb,
      storageUsedMb: 0,
      storageLimitMb: plan.limits.storageMb,
      lastResetDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.usages.push(usage);
    saveStore(store);
  }
  return usage;
}

export async function incrementUsage(
  userId: string,
  metric: 'apiCalls' | 'seats' | 'bandwidth',
  amount: number
): Promise<UsageMetrics> {
  const store = loadStore();
  let usage = store.usages.find((u) => u.userId === userId);
  if (!usage) {
    usage = await getUsage(userId);
  }
  const idx = store.usages.findIndex((u) => u.userId === userId);

  if (metric === 'apiCalls') {
    store.usages[idx].apiCallsCount = Math.min(
      store.usages[idx].apiCallsLimit,
      store.usages[idx].apiCallsCount + amount
    );
  } else if (metric === 'seats') {
    store.usages[idx].seatCount = Math.min(
      store.usages[idx].seatLimit,
      store.usages[idx].seatCount + amount
    );
  } else if (metric === 'bandwidth') {
    store.usages[idx].bandwidthMb = Math.min(
      store.usages[idx].bandwidthLimitMb,
      store.usages[idx].bandwidthMb + amount
    );
  }
  store.usages[idx].updatedAt = new Date().toISOString();
  saveStore(store);
  return store.usages[idx];
}

export async function resetUsageMetrics(userId: string): Promise<UsageMetrics> {
  const store = loadStore();
  const idx = store.usages.findIndex((u) => u.userId === userId);
  if (idx !== -1) {
    store.usages[idx].apiCallsCount = 0;
    store.usages[idx].bandwidthMb = 0;
    store.usages[idx].lastResetDate = new Date().toISOString();
    store.usages[idx].updatedAt = new Date().toISOString();
    saveStore(store);
    return store.usages[idx];
  }
  return getUsage(userId);
}

export async function getInvoices(userId?: string): Promise<Invoice[]> {
  const store = loadStore();
  if (userId) {
    return store.invoices.filter((i) => i.userId === userId);
  }
  return store.invoices;
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const store = loadStore();
  return store.invoices.find((i) => i.id === id || i.invoiceNumber === id) || null;
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
  const store = loadStore();
  const newInvoice: Invoice = {
    ...invoice,
    id: `inv_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.invoices.unshift(newInvoice);
  saveStore(store);
  return newInvoice;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const store = loadStore();
  return store.auditLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addAuditLog(entry: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
  const store = loadStore();
  const newLog: AuditLog = {
    ...entry,
    id: `log_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.auditLogs.unshift(newLog);
  // Keep last 100 entries
  if (store.auditLogs.length > 100) {
    store.auditLogs = store.auditLogs.slice(0, 100);
  }
  saveStore(store);
  return newLog;
}

export async function getSaaSMetrics(): Promise<SaaSMetrics> {
  const store = loadStore();
  // Recalculate dynamic MRR based on active subscriptions
  let mrr = 0;
  let freeCount = 0;
  let proCount = 0;
  let entCount = 0;

  for (const s of store.subscriptions) {
    if (s.status === 'ACTIVE') {
      if (s.tier === 'FREE') freeCount++;
      if (s.tier === 'PRO') {
        proCount++;
        mrr += s.billingCycle === 'YEARLY' ? PLANS.PRO.yearlyPrice : PLANS.PRO.monthlyPrice;
      }
      if (s.tier === 'ENTERPRISE') {
        entCount++;
        mrr += s.billingCycle === 'YEARLY' ? PLANS.ENTERPRISE.yearlyPrice : PLANS.ENTERPRISE.monthlyPrice;
      }
    }
  }

  return {
    ...store.metrics,
    mrr: mrr > 0 ? mrr : store.metrics.mrr,
    arr: (mrr > 0 ? mrr : store.metrics.mrr) * 12,
    subscribersByTier: {
      free: freeCount + store.metrics.subscribersByTier.free,
      pro: proCount + store.metrics.subscribersByTier.pro,
      enterprise: entCount + store.metrics.subscribersByTier.enterprise,
    },
  };
}
