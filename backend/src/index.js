const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');
const multipart = require('@fastify/multipart');
require('dotenv').config();

const prisma = require('./lib/prisma');

// Register plugins
fastify.register(cors, { origin: true, credentials: true });
fastify.register(jwt, { secret: process.env.JWT_SECRET || 'dev-secret' });
fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Доступен всем роутам как fastify.prisma
fastify.decorate('prisma', prisma);

// Health check
fastify.get('/health', async () => ({ status: 'ok', time: new Date().toISOString() }));

// Routes
fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
fastify.register(require('./routes/listings'), { prefix: '/api/listings' });
// Ещё не реализованы, регистрировать по мере готовности:
// fastify.register(require('./routes/auctions'), { prefix: '/api/auctions' });
// fastify.register(require('./routes/requests'), { prefix: '/api/requests' });
// fastify.register(require('./routes/deals'), { prefix: '/api/deals' });
// fastify.register(require('./routes/erp'), { prefix: '/api/erp' });
// fastify.register(require('./routes/verification'), { prefix: '/api/verification' });
// fastify.register(require('./routes/contragent'), { prefix: '/api/contragent' });
// fastify.register(require('./routes/admin'), { prefix: '/api/admin' });

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info(`Server running on port 3001`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

const shutdown = async () => {
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
