import { NextRequest, NextResponse } from 'next/server';
import { pairingService } from '@/services/pairingService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partnerId') || undefined;

    // Simulated account store lookup
    const allAccountsStr = req.headers.get('x-bloomnest-accounts');
    const allAccounts = allAccountsStr ? JSON.parse(allAccountsStr) : [];

    const availableMothers = pairingService.getAvailableMothers(allAccounts, partnerId);
    return NextResponse.json({ success: true, availableMothers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching available mothers' },
      { status: 500 }
    );
  }
}
