import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { leadsRouter } from './routes/leads.js';
import { sendDemoRequestEmail } from './mailer.js';
import { errorHandler, notFound } from './middleware/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp({
  corsOrigins = env.corsOrigins,
  rateLimitMax = env.rateLimitMax,
  rateLimitWindowMinutes = env.rateLimitWindowMinutes,
  serveFrontend = env.serveFrontend,
  sendEmail = sendDemoRequestEmail,
} = {}) {
  const app = express();

  app.disable('x-powered-by');
  if (env.trustProxy !== 'false') {
    const tp = env.trustProxy;
    app.set('trust proxy', /^\d+$/.test(tp) ? Number(tp) : tp === 'true' ? 1 : tp);
  }

  app.use(
    helmet({
      contentSecurityPolicy: serveFrontend
        ? {
            directives: {
              defaultSrc: ["'self'"],
              imgSrc: ["'self'", 'data:'],
              mediaSrc: ["'self'"],
              fontSrc: ["'self'", 'data:'],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              connectSrc: ["'self'"],
            },
          }
        : undefined,
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.use(compression());

  // CORS: allow same-origin requests (browsers send an Origin header on POST even when
  // same-origin), requests without an Origin, and explicitly allow-listed origins.
  const corsMw = cors((req, cb) => {
    const origin = req.get('Origin');
    const self = `${req.protocol}://${req.get('host')}`;
    if (origin && origin !== self && !corsOrigins.includes(origin)) {
      return cb(new Error('CORS_NOT_ALLOWED'));
    }
    return cb(null, {
      origin: Boolean(origin),
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      maxAge: 600,
    });
  });

  app.use('/api', corsMw);
  app.use('/api', express.json({ limit: '10kb' }));

  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok' });
  });

  const leadLimiter = rateLimit({
    windowMs: rateLimitWindowMinutes * 60 * 1000,
    limit: rateLimitMax,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again in a few minutes.' },
  });

  app.use('/api/leads', leadLimiter, leadsRouter({ sendEmail }));
  app.use('/api', notFound);

  // Optional: serve the built frontend from the same origin (single-service deployment).
  if (serveFrontend) {
    const dist = path.resolve(__dirname, '..', env.frontendDist);
    app.use(
      express.static(dist, {
        maxAge: '7d',
        setHeaders(res, filePath) {
          if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
        },
      }),
    );
    app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
