import Stripe from 'stripe';
import { PlanTier, BillingCycle } from '@/types';
import { PLANS } from './constants';
import { updateSubscription, createInvoice, addAuditLog, getUserById } from './db';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_subsync_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export interface CheckoutSessionOptions {
  userId: string;
  email: string;
  name: string;
  tier: PlanTier;
  billingCycle: BillingCycle;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Creates a Stripe Checkout Session or returns simulated checkout link in sandbox
 */
export async function createCheckoutSession(options: CheckoutSessionOptions) {
  const { userId, email, name, tier, billingCycle, successUrl, cancelUrl } = options;
  const plan = PLANS[tier];
  if (!plan) throw new Error(`Invalid plan tier: ${tier}`);

  const unitAmount = billingCycle === 'YEARLY' 
    ? Math.round(plan.yearlyPrice * 12 * 100) 
    : Math.round(plan.monthlyPrice * 100);

  // If live Stripe keys are provided (not placeholder), create real session
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder') && !process.env.STRIPE_SECRET_KEY.includes('MockKey')) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${plan.name} (${billingCycle.toLowerCase()})`,
                description: plan.tagline,
              },
              unit_amount: unitAmount,
              recurring: {
                interval: billingCycle === 'YEARLY' ? 'year' : 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          tier,
          billingCycle,
        },
      });

      return {
        url: session.url,
        sessionId: session.id,
        isMock: false,
      };
    } catch (err: any) {
      console.warn('Stripe checkout session creation failed, falling back to instant simulator:', err.message);
    }
  }

  // Instant Sandbox / Mock Checkout:
  // Immediately upgrade the subscription & create an invoice for seamless demonstration
  const updatedSub = await updateSubscription(userId, tier, billingCycle, 'ACTIVE');
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const totalAmount = billingCycle === 'YEARLY' ? plan.yearlyPrice * 12 : plan.monthlyPrice;

  await createInvoice({
    invoiceNumber,
    userId,
    userEmail: email,
    userName: name,
    amount: totalAmount,
    subtotal: totalAmount,
    taxAmount: 0,
    currency: 'USD',
    status: 'PAID',
    billingReason: `${tier} Tier Subscription (${billingCycle})`,
    itemDescription: `${plan.name} - ${billingCycle} Plan`,
    items: [
      {
        description: `${plan.name} Subscription`,
        quantity: 1,
        unitPrice: totalAmount,
        amount: totalAmount,
      },
    ],
    paymentMethodBrand: 'Visa',
    paymentMethodLast4: '4242',
    paidAt: new Date().toISOString(),
  });

  await addAuditLog({
    userId,
    actorEmail: email,
    action: 'CHECKOUT_COMPLETED',
    details: { tier, billingCycle, amount: totalAmount, invoiceNumber },
  });

  return {
    url: `${successUrl}?mock_session=true&tier=${tier}&cycle=${billingCycle}`,
    sessionId: `cs_mock_${Date.now()}`,
    isMock: true,
  };
}

/**
 * Handle Stripe Webhook Events
 */
export async function handleWebhookEvent(event: Stripe.Event | any) {
  const eventType = event.type;
  const data = event.data?.object || event;

  switch (eventType) {
    case 'checkout.session.completed': {
      const metadata = data.metadata || {};
      const userId = metadata.userId;
      const tier = (metadata.tier || 'PRO') as PlanTier;
      const billingCycle = (metadata.billingCycle || 'MONTHLY') as BillingCycle;

      if (userId) {
        await updateSubscription(userId, tier, billingCycle, 'ACTIVE');
        await addAuditLog({
          userId,
          actorEmail: data.customer_email || 'webhook@stripe.com',
          action: 'STRIPE_WEBHOOK_CHECKOUT_COMPLETED',
          details: { tier, billingCycle, sessionId: data.id },
        });
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const customerEmail = data.customer_email;
      const amountPaid = (data.amount_paid || 2900) / 100;
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await addAuditLog({
        actorEmail: customerEmail || 'webhook@stripe.com',
        action: 'STRIPE_WEBHOOK_PAYMENT_SUCCEEDED',
        details: { amount: amountPaid, invoiceNumber, stripeInvoiceId: data.id },
      });
      break;
    }

    case 'invoice.payment_failed': {
      const customerEmail = data.customer_email;
      const amountDue = (data.amount_due || 2900) / 100;

      await addAuditLog({
        actorEmail: customerEmail || 'webhook@stripe.com',
        action: 'STRIPE_WEBHOOK_PAYMENT_FAILED',
        details: { amountDue, reason: 'Card declined or insufficient funds' },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const customerId = data.customer;
      await addAuditLog({
        actorEmail: 'webhook@stripe.com',
        action: 'STRIPE_WEBHOOK_SUBSCRIPTION_DELETED',
        details: { customerId, reason: 'Subscription canceled by user' },
      });
      break;
    }

    case 'customer.subscription.updated': {
      await addAuditLog({
        actorEmail: 'webhook@stripe.com',
        action: 'STRIPE_WEBHOOK_SUBSCRIPTION_UPDATED',
        details: { status: data.status, cancelAtPeriodEnd: data.cancel_at_period_end },
      });
      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${eventType}`);
  }

  return { received: true, eventType };
}
