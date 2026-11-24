import { Router } from 'express';
import { validateLead } from '../validators/lead.js';

/** Validate a demo request and email it. Nothing is persisted. */
export function leadsRouter({ sendEmail }) {
  const router = Router();
  router.post('/', async (req, res, next) => {
    try {
      const body = req.body && typeof req.body === 'object' ? req.body : {};
      if (typeof body.website === 'string' && body.website.trim() !== '') {
        return res.status(201).json({ success: true, emailSent: true, message: 'Thank you. Your demo request has been received.' });
      }
      const { value, errors } = validateLead(body);
      if (Object.keys(errors).length) {
        return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors });
      }
      try {
        const mailResult = await sendEmail(value);
        console.log('[demo] Email notification accepted by SMTP for:', value.workEmail, '| Message ID:', mailResult?.messageId || 'n/a');
      } catch (mailErr) {
        console.error('[email] demo request notification failed:', mailErr.message);
        return res.status(502).json({ success: false, emailSent: false, message: 'We could not send your request right now. Please try again in a moment.' });
      }
      return res.status(201).json({ success: true, emailSent: true, message: 'Thank you. Your demo request has been received.' });
    } catch (err) {
      return next(err);
    }
  });
  return router;
}
