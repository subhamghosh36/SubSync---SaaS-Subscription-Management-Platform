import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, addAuditLog } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetUserId, adminEmail } = body;

    const user = await getUserById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = await updateUser(targetUserId, { status: nextStatus });

    await addAuditLog({
      userId: targetUserId,
      actorEmail: adminEmail || 'super_admin@subsync.io',
      action: nextStatus === 'ACTIVE' ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
      details: { targetEmail: user.email, newStatus: nextStatus },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
