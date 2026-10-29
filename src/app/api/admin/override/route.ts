import { NextRequest, NextResponse } from 'next/server';
import { PlanTier, BillingCycle } from '@/types';
import { updateSubscription, addAuditLog, getUserById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetUserId, tier, billingCycle, adminEmail } = body as {
      targetUserId: string;
      tier: PlanTier;
      billingCycle: BillingCycle;
      adminEmail?: string;
    };

    if (!targetUserId || !tier) {
      return NextResponse.json({ error: 'Missing targetUserId or tier' }, { status: 400 });
    }

    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = await updateSubscription(targetUserId, tier, billingCycle || 'MONTHLY', 'ACTIVE', false);

    await addAuditLog({
      userId: targetUserId,
      actorEmail: adminEmail || 'super_admin@subsync.io',
      action: 'ADMIN_MANUAL_PLAN_OVERRIDE',
      details: {
        targetUser: targetUser.email,
        targetUserName: targetUser.name,
        newTier: tier,
        billingCycle: billingCycle || 'MONTHLY',
        reason: 'Super Admin manual compensation/upgrade',
      },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
