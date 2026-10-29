import { NextRequest, NextResponse } from 'next/server';
import { PlanTier, BillingCycle } from '@/types';
import { createCheckoutSession } from '@/lib/stripe';
import { getUserById, updateSubscription, addAuditLog } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tier, billingCycle } = body as {
      userId: string;
      tier: PlanTier;
      billingCycle: BillingCycle;
    };

    if (!userId || !tier) {
      return NextResponse.json({ error: 'Missing userId or tier' }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const session = await createCheckoutSession({
      userId,
      email: user.email,
      name: user.name,
      tier,
      billingCycle: billingCycle || 'MONTHLY',
      successUrl: `${baseUrl}/billing?success=true`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.sessionId,
      isMock: session.isMock,
    });
  } catch (err: any) {
    console.error('Subscription change error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
