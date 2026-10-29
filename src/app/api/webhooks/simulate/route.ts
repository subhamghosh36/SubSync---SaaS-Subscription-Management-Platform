import { NextRequest, NextResponse } from 'next/server';
import { handleWebhookEvent } from '@/lib/stripe';
import { getUserById, updateSubscription, createInvoice, addAuditLog } from '@/lib/db';
import { PLANS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, userId, payload } = body;

    const user = userId ? await getUserById(userId) : null;
    const fakeEventId = `evt_sim_${Date.now()}`;

    let eventData: any = {
      id: fakeEventId,
      type: eventType,
      created: Math.floor(Date.now() / 1000),
      data: {
        object: payload || {},
      },
    };

    if (eventType === 'invoice.payment_succeeded') {
      const amount = payload?.amount || 29;
      const invNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      if (user) {
        await createInvoice({
          invoiceNumber: invNum,
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          amount,
          subtotal: amount,
          taxAmount: 0,
          currency: 'USD',
          status: 'PAID',
          billingReason: 'Simulated Webhook Payment Succeeded',
          itemDescription: 'Growth Pro Subscription Renewal (Webhook)',
          items: [{ description: 'Pro Monthly Subscription Renewal', quantity: 1, unitPrice: amount, amount }],
          paymentMethodBrand: 'Visa',
          paymentMethodLast4: '4242',
          paidAt: new Date().toISOString(),
        });
      }

      await addAuditLog({
        userId: user?.id,
        actorEmail: 'stripe_webhook_simulator',
        action: 'WEBHOOK_PAYMENT_SUCCEEDED',
        details: { invoiceNumber: invNum, amount, simulated: true },
      });
    } else if (eventType === 'invoice.payment_failed') {
      await addAuditLog({
        userId: user?.id,
        actorEmail: 'stripe_webhook_simulator',
        action: 'WEBHOOK_PAYMENT_FAILED',
        details: { reason: 'Insufficient funds (simulated charge attempt)', simulated: true },
      });
    } else if (eventType === 'customer.subscription.updated') {
      if (user) {
        const nextTier = payload?.tier || 'ENTERPRISE';
        await updateSubscription(user.id, nextTier, payload?.billingCycle || 'MONTHLY', 'ACTIVE');
      }
      await addAuditLog({
        userId: user?.id,
        actorEmail: 'stripe_webhook_simulator',
        action: 'WEBHOOK_SUBSCRIPTION_UPDATED',
        details: { newTier: payload?.tier || 'ENTERPRISE', simulated: true },
      });
    } else if (eventType === 'customer.subscription.deleted') {
      if (user) {
        await updateSubscription(user.id, 'FREE', 'MONTHLY', 'CANCELED');
      }
      await addAuditLog({
        userId: user?.id,
        actorEmail: 'stripe_webhook_simulator',
        action: 'WEBHOOK_SUBSCRIPTION_CANCELED',
        details: { reason: 'Immediate cancellation webhook received', simulated: true },
      });
    }

    return NextResponse.json({
      success: true,
      simulatedEventId: fakeEventId,
      eventType,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
