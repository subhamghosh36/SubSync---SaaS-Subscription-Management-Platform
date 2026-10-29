import { NextRequest, NextResponse } from 'next/server';
import { incrementUsage, addAuditLog, getUserById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, metric, amount } = body as {
      userId: string;
      metric: 'apiCalls' | 'seats' | 'bandwidth';
      amount: number;
    };

    if (!userId || !metric || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const updated = await incrementUsage(userId, metric, amount);
    const user = await getUserById(userId);

    await addAuditLog({
      userId,
      actorEmail: user?.email || 'system',
      action: 'USAGE_SIMULATION',
      details: { metric, increment: amount, currentTotal: metric === 'apiCalls' ? updated.apiCallsCount : metric === 'seats' ? updated.seatCount : updated.bandwidthMb },
    });

    return NextResponse.json({ success: true, usage: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
