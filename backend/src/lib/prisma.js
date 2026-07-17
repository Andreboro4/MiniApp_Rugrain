const { PrismaClient } = require('@prisma/client');

// Singleton, чтобы при hot-reload (nodemon) не плодить новые подключения к Postgres.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__rugrainPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__rugrainPrisma = prisma;
}

module.exports = prisma;
