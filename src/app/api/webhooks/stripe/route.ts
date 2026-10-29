import { NextRequest, NextResponse } from 'next/server';
import { stripe, handleWebhookEvent } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    if (webhookSecret && signature && !webhookSecret.includes('placeholder')) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In dev or sandbox mode without webhook secrets, parse payload directly
      event = JSON.parse(body);
    }

    const result = await handleWebhookEvent(event);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
}
