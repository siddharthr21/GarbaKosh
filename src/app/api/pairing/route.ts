import { NextRequest, NextResponse } from 'next/server';
import { pairingService } from '@/services/pairingService';
import { UserAccount } from '@/types';

// Helper to simulate session/account extraction from request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { partnerAccount, targetMotherAccount } = body as {
      partnerAccount: UserAccount;
      targetMotherAccount: UserAccount;
    };

    if (!partnerAccount || !targetMotherAccount) {
      return NextResponse.json(
        { success: false, message: 'Missing partner or mother account details.' },
        { status: 400 }
      );
    }

    // Role enforcement
    if (partnerAccount.role !== 'partner') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Requesting account must have role PARTNER.' },
        { status: 403 }
      );
    }
    if (targetMotherAccount.role !== 'mother') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Target account must have role MOTHER.' },
        { status: 400 }
      );
    }

    const result = pairingService.connectPartnerWithMother(partnerAccount, targetMotherAccount);
    if (!result.success) {
      return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const relationshipId = searchParams.get('relationshipId');
    const userId = searchParams.get('userId');

    if (!relationshipId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing relationshipId or userId' },
        { status: 400 }
      );
    }

    const result = pairingService.disconnectRelationship(relationshipId, userId);
    if (!result.success) {
      return NextResponse.json(result, { status: 403 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { relationshipId, motherId, permissions } = body;

    if (!relationshipId || !motherId || !permissions) {
      return NextResponse.json(
        { success: false, message: 'Missing parameters for permission update' },
        { status: 400 }
      );
    }

    const result = pairingService.updatePermissions(relationshipId, motherId, permissions);
    if (!result.success) {
      return NextResponse.json(result, { status: 403 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
