import { NextRequest, NextResponse } from 'next/server';
import { resetUsageMetrics, addAuditLog, getUserById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const updated = await resetUsageMetrics(userId);
    const user = await getUserById(userId);

    await addAuditLog({
      userId,
      actorEmail: user?.email || 'admin',
      action: 'USAGE_RESET',
      details: { timestamp: new Date().toISOString() },
    });

    return NextResponse.json({ success: true, usage: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
