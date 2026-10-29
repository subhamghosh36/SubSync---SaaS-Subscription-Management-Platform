import { NextRequest, NextResponse } from 'next/server';
import { 
  getUsers, 
  getUserById, 
  getSubscription, 
  getUsage, 
  getInvoices, 
  getAuditLogs, 
  getSaaSMetrics 
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr_super_alex';

    const users = await getUsers();
    const currentUser = (await getUserById(userId)) || users[0];
    const subscription = await getSubscription(currentUser.id);
    const usage = await getUsage(currentUser.id);
    const invoices = await getInvoices(currentUser.id);
    const allInvoices = await getInvoices();
    const auditLogs = await getAuditLogs();
    const metrics = await getSaaSMetrics();

    return NextResponse.json({
      currentUser,
      users,
      subscription,
      usage,
      invoices,
      allInvoices,
      auditLogs,
      metrics,
    });
  } catch (err: any) {
    console.error('Error fetching app-state:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
