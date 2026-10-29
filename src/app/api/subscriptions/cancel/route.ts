import { NextRequest, NextResponse } from 'next/server';
import { getSubscription, updateSubscription, addAuditLog, getUserById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const sub = await getSubscription(userId);
    const user = await getUserById(userId);
    if (!sub) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Set cancelAtPeriodEnd to true
    const updated = await updateSubscription(
      userId,
      sub.tier,
      sub.billingCycle,
      'CANCELED',
      true
    );

    await addAuditLog({
      userId,
      actorEmail: user?.email || 'user',
      action: 'SUBSCRIPTION_CANCELED',
      details: { tier: sub.tier, effectiveAt: sub.currentPeriodEnd },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
