"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailNotification = sendEmailNotification;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const EMAIL_LOG_PATH = path_1.default.join(__dirname, '../../database/emails.log');
async function sendEmailNotification(to, subject, html) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'uPVC Doors & Windows <no-reply@upvcwebsite.com>';
    // Check if SMTP is configured
    if (host && user && pass) {
        try {
            const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (err) {
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
        const dbDir = path_1.default.dirname(EMAIL_LOG_PATH);
        if (!fs_1.default.existsSync(dbDir)) {
            fs_1.default.mkdirSync(dbDir, { recursive: true });
        }
        fs_1.default.appendFileSync(EMAIL_LOG_PATH, logMessage, 'utf8');
    }
    catch (err) {
        console.error('Failed to write email to log file:', err);
    }
    return true;
}
