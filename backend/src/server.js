import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();
const server = app.listen(env.port, () => {
  console.log(`[api] Sales Soccer microsite API listening on http://localhost:${env.port} (${env.nodeEnv})`);
});

const shutdown = (signal) => {
  console.log(`[api] ${signal} received, shutting down`);
  server.close(() => process.exit(0));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
