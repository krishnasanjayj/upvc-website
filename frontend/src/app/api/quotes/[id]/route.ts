import { NextRequest, NextResponse } from 'next/server';
import { QuotationsRepository } from '../../../../lib/db';
import { requireAuth } from '../../../../lib/auth';

// DELETE /api/quotes/[id] — Admin: delete a quotation
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const numId = parseInt(id);

  try {
    const deleted = await QuotationsRepository.delete(numId);
    if (!deleted) {
      return NextResponse.json({ message: 'Quotation not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Quotation deleted successfully.' });
  } catch (err) {
    console.error('Error deleting quote:', err);
    return NextResponse.json({ message: 'Failed to delete quotation.' }, { status: 500 });
  }
}
