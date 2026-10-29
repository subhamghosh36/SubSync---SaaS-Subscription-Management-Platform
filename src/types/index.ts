export type Role = 'SUPER_ADMIN' | 'MANAGER' | 'USER';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED';

export type PlanTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export type BillingCycle = 'MONTHLY' | 'YEARLY';

export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE';

export type InvoiceStatus = 'PAID' | 'PENDING' | 'FAILED';

export interface PlanLimits {
  apiCalls: number;
  seats: number;
  bandwidthMb: number; // in MB
  storageMb: number;
  rateLimitPerMinute: number;
  webhooksAllowed: boolean;
  dedicatedSupport: boolean;
  customDomain: boolean;
}

export interface PlanDefinition {
  id: PlanTier;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number; // e.g. discounted
  popular?: boolean;
  color: string;
  limits: PlanLimits;
  features: string[];
  cta: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  status: UserStatus;
  company?: string;
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: PlanTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageMetrics {
  id: string;
  userId: string;
  apiCallsCount: number;
  apiCallsLimit: number;
  seatCount: number;
  seatLimit: number;
  bandwidthMb: number;
  bandwidthLimitMb: number;
  storageUsedMb: number;
  storageLimitMb: number;
  lastResetDate: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  amount: number;
  subtotal: number;
  taxAmount: number;
  currency: string;
  status: InvoiceStatus;
  billingReason: string;
  itemDescription: string;
  items?: InvoiceItem[];
  paymentMethodLast4?: string;
  paymentMethodBrand?: string;
  paidAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  actorEmail: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface WebhookSimulationPayload {
  eventId: string;
  eventType: string;
  customerId: string;
  subscriptionId?: string;
  amount?: number;
  tier?: PlanTier;
  billingCycle?: BillingCycle;
  created: number;
}

export interface SaaSMetrics {
  mrr: number;
  arr: number;
  mrrGrowth: number;
  activeSubscribers: number;
  churnRate: number;
  ltv: number;
  arpu: number;
  subscribersByTier: {
    free: number;
    pro: number;
    enterprise: number;
  };
  revenueHistory: {
    month: string;
    revenue: number;
    subscriptions: number;
  }[];
}
