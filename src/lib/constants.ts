import { PlanDefinition } from '@/types';

export const PLANS: Record<string, PlanDefinition> = {
  FREE: {
    id: 'FREE',
    name: 'Developer Free',
    tagline: 'Ideal for indie developers, prototypes, and testing.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: 'from-slate-500 to-slate-700',
    limits: {
      apiCalls: 10000,
      seats: 1,
      bandwidthMb: 5120, // 5 GB
      storageMb: 1024,   // 1 GB
      rateLimitPerMinute: 60,
      webhooksAllowed: false,
      dedicatedSupport: false,
      customDomain: false,
    },
    features: [
      '10,000 API requests / month',
      '1 Workspace Seat',
      '5 GB Bandwidth allocation',
      'Real-time Quota Dashboard',
      'Community Discord & Forum',
      '7-day audit log retention',
    ],
    cta: 'Get Started Free',
  },
  PRO: {
    id: 'PRO',
    name: 'Growth Pro',
    tagline: 'For fast-growing products needing scale, seats & automation.',
    monthlyPrice: 29,
    yearlyPrice: 24, // $288 billed annually ($24/mo)
    popular: true,
    color: 'from-indigo-500 via-purple-500 to-pink-500',
    limits: {
      apiCalls: 500000,
      seats: 5,
      bandwidthMb: 51200, // 50 GB
      storageMb: 25600,  // 25 GB
      rateLimitPerMinute: 600,
      webhooksAllowed: true,
      dedicatedSupport: false,
      customDomain: true,
    },
    features: [
      '500,000 API requests / month',
      'Up to 5 Team Seats with RBAC',
      '50 GB High-speed Bandwidth',
      'Automated PDF Invoice Downloads',
      'Stripe Webhooks & Real-time Alerts',
      'Priority 4-hour Support SLA',
      '90-day detailed audit history',
      'Custom Domain Support',
    ],
    cta: 'Upgrade to Pro',
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Scale Enterprise',
    tagline: 'Uncapped power, dedicated infrastructure, and enterprise security.',
    monthlyPrice: 99,
    yearlyPrice: 82, // $984 billed annually ($82/mo)
    color: 'from-cyan-500 via-blue-600 to-indigo-700',
    limits: {
      apiCalls: 10000000,
      seats: 25,
      bandwidthMb: 512000, // 500 GB
      storageMb: 204800,  // 200 GB
      rateLimitPerMinute: 3000,
      webhooksAllowed: true,
      dedicatedSupport: true,
      customDomain: true,
    },
    features: [
      '10,000,000+ API requests / month',
      '25+ Seats with Super Admin controls',
      '500 GB High-speed CDN Bandwidth',
      'Custom Rate Limit & PO Billing',
      'Dedicated Customer Success Manager',
      '24/7 Slack Connect & Phone Support',
      'Unlimited Immutable Audit Logs',
      '99.99% Guaranteed SLA Uptime',
      'SOC2 Type II & GDPR Compliance',
    ],
    cta: 'Scale with Enterprise',
  },
};

export const APP_CONFIG = {
  name: 'SubSync',
  tagline: 'Production-Grade SaaS Subscription & Usage Management',
  company: {
    name: 'SubSync Technologies Inc.',
    address: '100 Cybernetic Way, Suite 400',
    city: 'San Francisco, CA 94107',
    email: 'billing@subsync.io',
    vatNumber: 'US-983210492',
  },
};
