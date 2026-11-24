import nodemailer from 'nodemailer';
import { env } from './config/env.js';

let transporter;

function getTransporter() {
  if (!transporter) {
    if (!env.emailHost || !env.emailUser || !env.emailPass || !env.emailTo) {
      throw new Error('SMTP email is not fully configured. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS and EMAIL_TO.');
    }
    transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: env.emailPort,
      secure: env.emailSecure,
      auth: { user: env.emailUser, pass: env.emailPass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }
  return transporter;
}

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export async function sendDemoRequestEmail(lead) {
  const mail = getTransporter();
  const rows = [
    ['Name', lead.name],
    ['Company', lead.company],
    ['Designation', lead.designation],
    ['Work email', lead.workEmail],
    ['Mobile', lead.mobileNumber],
    ['Message', lead.message || '—'],
    ['Submitted', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)'],
  ];

  const htmlRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e7e7ef;color:#606070;font-weight:600;width:150px;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e7e7ef;color:#171321;white-space:pre-wrap;">${escapeHtml(value)}</td>
    </tr>`).join('');

  const result = await mail.sendMail({
    from: env.emailFrom,
    to: env.emailTo,
    replyTo: lead.workEmail,
    subject: `Sales Soccer demo request — ${lead.name}`,
    text: rows.map(([label, value]) => `${label}: ${value || '—'}`).join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;background:#f5f4f8;padding:24px;">
        <div style="max-width:640px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
          <div style="background:#160d27;padding:22px 24px;color:#fff;">
            <h1 style="margin:0;font-size:22px;">New Sales Soccer demo request</h1>
            <p style="margin:8px 0 0;color:#d8c9f5;">A new enquiry was submitted from the microsite.</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">${htmlRows}</table>
          <p style="padding:18px 24px;margin:0;color:#777;font-size:12px;">Reply directly to this email to contact the lead.</p>
        </div>
      </div>`,
  });

  const recipient = env.emailTo.toLowerCase();
  const accepted = (result.accepted || []).map((entry) => String(entry).toLowerCase());
  const rejected = (result.rejected || []).map((entry) => String(entry).toLowerCase());
  console.log('[email] SMTP response:', JSON.stringify({ messageId: result.messageId, response: result.response, accepted, rejected }));
  if (!accepted.includes(recipient)) {
    throw new Error(`SMTP did not accept recipient ${env.emailTo}. Rejected: ${rejected.join(', ') || 'no accepted recipient reported'}`);
  }
  return result;
}
