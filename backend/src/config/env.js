import 'dotenv/config';

const list = (v) =>
  (v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  corsOrigins: list(process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173'),
  trustProxy: process.env.TRUST_PROXY || 'false',
  rateLimitWindowMinutes: Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 5,
  serveFrontend: process.env.SERVE_FRONTEND === 'true',
  frontendDist: process.env.FRONTEND_DIST || '../frontend/dist',
};

export const isProd = env.nodeEnv === 'production';
