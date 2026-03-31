import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { getSupabaseAdmin } from './db/supabase.js';
import { AIService } from './services/ai/ai-service.js';
import { ClaudeProvider } from './services/ai/claude-provider.js';
import { registerCoSRoutes } from './routes/cos.js';
import { registerCompanyRoutes } from './routes/company.js';

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: process.env['CLIENT_URL'] ?? 'http://localhost:5173',
});

// ── AI Service setup ────────────────────────────────────────────────
const aiService = new AIService();

const anthropicKey = process.env['ANTHROPIC_API_KEY'];
if (anthropicKey && anthropicKey !== 'your_anthropic_api_key') {
  aiService.registerProvider(new ClaudeProvider(anthropicKey));
  console.log('Claude provider registered');
} else {
  console.warn('ANTHROPIC_API_KEY not set — AI features will use fallback responses');
}

// ── Routes ──────────────────────────────────────────────────────────
server.get('/api/health', async () => {
  const { error } = await getSupabaseAdmin().from('users').select('id').limit(1);
  return {
    status: error ? 'degraded' : 'ok',
    supabase: error ? error.message : 'connected',
    timestamp: new Date().toISOString(),
  };
});

registerCoSRoutes(server, aiService);
registerCompanyRoutes(server);

// ── Start ───────────────────────────────────────────────────────────
const port = Number(process.env['PORT'] ?? 3001);

try {
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
