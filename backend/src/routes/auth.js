const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    isGuest: user.isGuest,
    maxUserId: user.maxUserId,
    orgDetails: user.orgDetails || null,
    verification: user.verification ? { status: user.verification.status } : null,
  };
}

module.exports = async function (fastify, opts) {
  // Вход через MAX.
  // ВАЖНО: сейчас это упрощённая dev-версия — клиент просто присылает maxUserId.
  // В боевом флоу сюда должны приходить initData от MAX mini-app SDK, а бэкенд обязан
  // проверить их подпись через MAX_BOT_TOKEN, а не доверять телу запроса как есть.
  fastify.post('/max', async (request, reply) => {
    const { maxUserId, name, phone } = request.body || {};
    if (!maxUserId) {
      return reply.code(400).send({ error: 'maxUserId обязателен' });
    }

    const user = await prisma.user.upsert({
      where: { maxUserId },
      update: {
        name: name || undefined,
        phone: phone || undefined,
      },
      create: {
        maxUserId,
        name: name || null,
        phone: phone || null,
        isGuest: false,
      },
      include: { orgDetails: true, verification: true },
    });

    const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '30d' });
    return { token, user: serializeUser(user) };
  });

  // Гостевой вход — создаём временного пользователя только для просмотра.
  fastify.post('/guest', async (request, reply) => {
    const user = await prisma.user.create({
      data: { isGuest: true, name: 'Гость' },
    });

    const token = fastify.jwt.sign({ id: user.id }, { expiresIn: '7d' });
    return { token, user: serializeUser(user) };
  });

  // Текущий пользователь по JWT — используется для восстановления сессии на фронте.
  fastify.get('/me', { preHandler: authMiddleware }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: { orgDetails: true, verification: true },
    });
    if (!user) return reply.code(404).send({ error: 'Пользователь не найден' });
    return { user: serializeUser(user) };
  });
};
