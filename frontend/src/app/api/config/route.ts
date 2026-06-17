import { NextRequest, NextResponse } from 'next/server';
import { ConfigRepository } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

// GET /api/config — Public: return pricing configs
export async function GET() {
  try {
    const configs = await ConfigRepository.getAll();
    const configObj: { [key: string]: string } = {};
    configs.forEach((c) => {
      configObj[c.key] = c.value;
    });
    return NextResponse.json(configObj);
  } catch (err) {
    console.error('Error fetching system configurations:', err);
    return NextResponse.json({ message: 'Failed to fetch configurations.' }, { status: 500 });
  }
}

// PUT /api/config — Admin: update configs
export async function PUT(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const settings = await req.json();
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ message: 'Invalid payload structure. Object expected.' }, { status: 400 });
    }

    const promises = Object.keys(settings).map((key) => {
      const val = String(settings[key]);
      return ConfigRepository.set(key, val);
    });
    await Promise.all(promises);

    return NextResponse.json({ success: true, message: 'Pricing configuration updated successfully.' });
  } catch (err) {
    console.error('Error updating pricing configurations:', err);
    return NextResponse.json({ message: 'Failed to update configurations.' }, { status: 500 });
  }
}
