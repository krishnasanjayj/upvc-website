import { NextRequest, NextResponse } from 'next/server';
import { InquiriesRepository } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';
import { sendEmailNotification } from '../../../lib/mailer';

// POST /api/inquiries — Public: submit a new contact inquiry
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ message: 'All fields (name, email, phone, message) are required.' }, { status: 400 });
    }

    const inquiry = await InquiriesRepository.create({ name, email, phone, message });

    // Send email alert to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@upvcwebsite.com';
    const adminEmailSubject = `New Contact Inquiry from ${name}`;
    const adminEmailHtml = `
      <h3>New Lead Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send confirmation email to customer
    const customerEmailSubject = `Thank you for contacting CN Doors & Windows`;
    const customerEmailHtml = `
      <h3>Hello ${name},</h3>
      <p>Thank you for reaching out to CN Doors & Windows. We have received your inquiry and our team will get back to you shortly.</p>
      <hr />
      <p><strong>Your Message:</strong></p>
      <p><em>${message.replace(/\n/g, '<br>')}</em></p>
      <hr />
      <p>Best regards,<br /><strong>CN Doors & Windows Team</strong></p>
    `;

    sendEmailNotification(adminEmail, adminEmailSubject, adminEmailHtml).catch((err) => {
      console.error('Failed to send admin inquiry email:', err);
    });

    sendEmailNotification(email, customerEmailSubject, customerEmailHtml).catch((err) => {
      console.error('Failed to send customer inquiry email:', err);
    });

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
