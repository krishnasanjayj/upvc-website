import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';

// GET /api/auth/verify
export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  return NextResponse.json({
    valid: true,
    user: authResult,
  });
}
