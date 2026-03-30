import Fastify from 'fastify';
import cors from '@fastify/cors';

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: process.env['CLIENT_URL'] ?? 'http://localhost:5173',
});

server.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const port = Number(process.env['PORT'] ?? 3001);

try {
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
