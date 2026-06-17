import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Local log path fallback
const EMAIL_LOG_PATH = path.join(process.cwd(), 'database/emails.log');

export async function sendEmailNotification(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'uPVC Doors & Windows <no-reply@upvcwebsite.com>';

  // Check if SMTP is configured
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(`[Email Sent] Message ID: ${info.messageId} to ${to}`);
      return true;
    } catch (err) {
      console.error('Error sending SMTP email, falling back to local logging:', err);
    }
  }

  // Fallback logging
  const timestamp = new Date().toISOString();
  const logMessage = `
========================================
[EMAIL SENT LOG] ${timestamp}
To: ${to}
Subject: ${subject}
----------------------------------------
HTML Content:
${html}
========================================
`;
  
  console.log(logMessage);
  
  // Write to database directory
  try {
    const dbDir = path.dirname(EMAIL_LOG_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    fs.appendFileSync(EMAIL_LOG_PATH, logMessage, 'utf8');
  } catch (err) {
    console.error('Failed to write email to log file:', err);
  }

  return true;
}
