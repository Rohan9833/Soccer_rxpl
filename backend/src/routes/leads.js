import { Router } from 'express';
import { validateLead } from '../validators/lead.js';

/**
 * POST /api/leads: store a Request a Demo enquiry.
 * The Lead model is injected so the route can be tested without a database.
 */
export function leadsRouter({ LeadModel, isDbReady }) {
  const router = Router();

  router.post('/', async (req, res, next) => {
    try {
      const body = req.body && typeof req.body === 'object' ? req.body : {};

      // Honeypot: real users never fill this hidden field. Pretend success, store nothing.
      if (typeof body.website === 'string' && body.website.trim() !== '') {
        return res.status(201).json({ success: true, message: 'Thank you. Your demo request has been received.' });
      }

      const { value, errors } = validateLead(body);
      if (Object.keys(errors).length) {
        return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors });
      }

      if (!isDbReady()) {
        return res
          .status(503)
          .json({ success: false, message: 'The service is temporarily unavailable. Please try again shortly.' });
      }

      const lead = await LeadModel.create({ ...value, submittedAt: new Date() });
      return res.status(201).json({
        success: true,
        message: 'Thank you. Your demo request has been received.',
        id: String(lead._id),
      });
    } catch (err) {
      if (err?.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: 'Please check the details you entered.' });
      }
      return next(err);
    }
  });

  return router;
}
