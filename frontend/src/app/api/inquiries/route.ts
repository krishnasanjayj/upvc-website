import { NextRequest, NextResponse } from 'next/server';
import { InquiriesRepository } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

// POST /api/inquiries — Public: submit a new contact inquiry
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ message: 'All fields (name, email, phone, message) are required.' }, { status: 400 });
    }

    const inquiry = await InquiriesRepository.create({ name, email, phone, message });

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully.', data: inquiry },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating inquiry:', err);
    return NextResponse.json({ message: 'Failed to submit inquiry.' }, { status: 500 });
  }
}

// GET /api/inquiries — Admin: list all inquiries
export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const inquiries = await InquiriesRepository.findAll();
    return NextResponse.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return NextResponse.json({ message: 'Failed to fetch inquiries.' }, { status: 500 });
  }
}
