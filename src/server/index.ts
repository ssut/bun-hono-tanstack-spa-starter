import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { pinoLogger } from 'hono-pino';
import { env } from './env.ts';
import { logger } from './lib/logger.ts';

const app = new Hono();

app.use(
  '*',
  pinoLogger({
    pino: logger,
    http: {
      reqId: () => Bun.randomUUIDv7(),
    },
  }),
);
app.use(
  '/api/*',
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.get('/api/health', (c) => c.json({ status: 'ok' }));

async function startup() {
  logger.info({ port: env.PORT }, 'starting server');
}

startup().catch((err) => {
  logger.error({ error: String(err) }, 'startup failed');
});

export default {
  port: env.PORT,
  fetch: app.fetch,
};
