import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { getSupabaseAdmin } from './db/supabase.js';

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: process.env['CLIENT_URL'] ?? 'http://localhost:5173',
});

server.get('/api/health', async () => {
  // Quick Supabase connectivity check
  const { error } = await getSupabaseAdmin().from('users').select('id').limit(1);
  return {
    status: error ? 'degraded' : 'ok',
    supabase: error ? error.message : 'connected',
    timestamp: new Date().toISOString(),
  };
});

const port = Number(process.env['PORT'] ?? 3001);

try {
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
