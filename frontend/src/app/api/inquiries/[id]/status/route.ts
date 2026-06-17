import { NextRequest, NextResponse } from 'next/server';
import { InquiriesRepository } from '../../../../../lib/db';
import { requireAuth } from '../../../../../lib/auth';

// PATCH /api/inquiries/[id]/status — Admin: update inquiry status
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

    if (!status || !['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ message: 'Valid status (NEW, CONTACTED, CLOSED) is required.' }, { status: 400 });
    }

    const updated = await InquiriesRepository.updateStatus(numId, status);
    if (!updated) {
      return NextResponse.json({ message: 'Inquiry not found.' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    return NextResponse.json({ message: 'Failed to update status.' }, { status: 500 });
  }
}
