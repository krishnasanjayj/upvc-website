import { Request, Response } from 'express';
import { InquiriesRepository } from '../config/db';
import { sendEmailNotification } from '../config/mailer';

export async function createInquiry(req: Request, res: Response) {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields (name, email, phone, message) are required.' });
  }

  try {
    const inquiry = await InquiriesRepository.create({ name, email, phone, message });

    // Send email alert to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@upvcwebsite.com';
    const emailSubject = `New Contact Inquiry from ${name}`;
    const emailHtml = `
      <h3>New Lead Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;
    
    // Non-blocking email sending
    sendEmailNotification(adminEmail, emailSubject, emailHtml).catch(err => {
      console.error('Failed to send admin email alert:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully.',
      data: inquiry
    });
  } catch (err) {
    console.error('Error creating inquiry:', err);
    return res.status(500).json({ message: 'Failed to submit inquiry.' });
  }
}

export async function getInquiries(req: Request, res: Response) {
  try {
    const inquiries = await InquiriesRepository.findAll();
    return res.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return res.status(500).json({ message: 'Failed to fetch inquiries.' });
  }
}

export async function updateInquiryStatus(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status || !['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
    return res.status(400).json({ message: 'Valid status (NEW, CONTACTED, CLOSED) is required.' });
  }

  try {
    const updated = await InquiriesRepository.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    return res.status(500).json({ message: 'Failed to update status.' });
  }
}

export async function deleteInquiry(req: Request, res: Response) {
  const id = parseInt(req.params.id);

  try {
    const deleted = await InquiriesRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    return res.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return res.status(500).json({ message: 'Failed to delete inquiry.' });
  }
}
