import { NextRequest, NextResponse } from 'next/server';
import { QuotationsRepository } from '../../../../../lib/db';
import { requireAuth } from '../../../../../lib/auth';

// PATCH /api/quotes/[id]/status — Admin: update quotation status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const numId = parseInt(id);

  try {
    const { status } = await req.json();

    if (!status || !['NEW', 'CONTACTED', 'SENT', 'CLOSED'].includes(status)) {
      return NextResponse.json(
        { message: 'Valid status (NEW, CONTACTED, SENT, CLOSED) is required.' },
        { status: 400 }
      );
    }

    const updated = await QuotationsRepository.updateStatus(numId, status);
    if (!updated) {
      return NextResponse.json({ message: 'Quotation not found.' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating quotation status:', err);
    return NextResponse.json({ message: 'Failed to update quotation status.' }, { status: 500 });
  }
}
