import { NextRequest, NextResponse } from 'next/server';
import { InquiriesRepository } from '../../../../lib/db';
import { requireAuth } from '../../../../lib/auth';

// DELETE /api/inquiries/[id] — Admin: delete an inquiry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const numId = parseInt(id);

  try {
    const deleted = await InquiriesRepository.delete(numId);
    if (!deleted) {
      return NextResponse.json({ message: 'Inquiry not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return NextResponse.json({ message: 'Failed to delete inquiry.' }, { status: 500 });
  }
}
