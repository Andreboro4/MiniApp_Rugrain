const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const DEAL_TYPE_MAP = { sell: 'SELL', buy: 'BUY' };
const EDITABLE_STATUSES = ['DRAFT', 'PENDING', 'PUBLISHED', 'CLOSED'];

const listingInclude = {
  user: {
    include: {
      orgDetails: true,
      verification: true,
      ratingsRecv: { select: { score: true } },
    },
  },
};

// Приводим Prisma-модель к тому же формату полей, который уже использует фронтенд
// (frontend/src/data/mock.js), чтобы не переписывать разметку карточек объявлений.
function serializeListing(listing) {
  const ratings = listing.user?.ratingsRecv || [];
  const ratingCount = ratings.length;
  const rating = ratingCount ? ratings.reduce((sum, r) => sum + r.score, 0) / ratingCount : 0;

  return {
    id: listing.id,
    cat: listing.category,
    dealType: listing.dealType.toLowerCase(), // SELL/BUY -> sell/buy
    title: listing.title,
    vol: `${listing.volume} ${listing.unit}`,
    price: listing.price,
    unit: listing.unit,
    region: listing.region,
    shipAddress: listing.shipAddress,
    incoterm: listing.incoterm,
    quality: listing.quality,
    desc: listing.description,
    minParty: listing.minParty,
    seller: listing.user?.orgDetails?.name || listing.user?.name || 'Без названия',
    verified: listing.user?.verification?.status === 'APPROVED',
    rating,
    ratingCount,
    sampleAvailable: listing.sampleAvailable,
    samplePickupAddress: listing.sampleAddress,
    sampleViaRugrain: listing.sampleViaRugrain,
    status: listing.status,
    createdAt: listing.createdAt,
  };
}

async function loadOwnedListingOr403(request, reply) {
  const existing = await prisma.listing.findUnique({ where: { id: request.params.id } });
  if (!existing) {
    reply.code(404).send({ error: 'Объявление не найдено' });
    return null;
  }
  if (existing.userId !== request.user.id) {
    reply.code(403).send({ error: 'Это не ваше объявление' });
    return null;
  }
  return existing;
}

module.exports = async function (fastify, opts) {
  // GET /api/listings?category=Зерновые&dealType=sell — публичная лента
  fastify.get('/', async (request, reply) => {
    const { category, dealType } = request.query || {};

    // Модерации ещё нет, поэтому пока показываем всё, кроме отклонённых/закрытых.
    // Когда появится админ-модерация — сузить до status: 'PUBLISHED'.
    const where = { status: { notIn: ['REJECTED', 'CLOSED'] } };
    if (category && category !== 'Все') where.category = category;
    if (dealType && DEAL_TYPE_MAP[dealType]) where.dealType = DEAL_TYPE_MAP[dealType];

    const listings = await prisma.listing.findMany({
      where,
      include: listingInclude,
      orderBy: { createdAt: 'desc' },
    });

    return { listings: listings.map(serializeListing) };
  });

  // GET /api/listings/mine — все свои объявления, в любом статусе (для личного кабинета).
  // Регистрируется как отдельный статический путь — Fastify отдаёт ему приоритет над /:id.
  fastify.get('/mine', { preHandler: authMiddleware }, async (request, reply) => {
    const listings = await prisma.listing.findMany({
      where: { userId: request.user.id },
      include: listingInclude,
      orderBy: { createdAt: 'desc' },
    });
    return { listings: listings.map(serializeListing) };
  });

  // GET /api/listings/:id
  fastify.get('/:id', async (request, reply) => {
    const listing = await prisma.listing.findUnique({
      where: { id: request.params.id },
      include: listingInclude,
    });
    if (!listing) return reply.code(404).send({ error: 'Объявление не найдено' });
    return { listing: serializeListing(listing) };
  });

  // POST /api/listings — создать объявление (нужна авторизация)
  fastify.post('/', { preHandler: authMiddleware }, async (request, reply) => {
    const b = request.body || {};
    const required = ['title', 'category', 'dealType', 'volume', 'price', 'region', 'shipAddress', 'incoterm'];
    const missing = required.filter((k) => b[k] === undefined || b[k] === null || b[k] === '');
    if (missing.length) {
      return reply.code(400).send({ error: `Не заполнены поля: ${missing.join(', ')}` });
    }

    const listing = await prisma.listing.create({
      data: {
        userId: request.user.id,
        title: b.title,
        category: b.category,
        dealType: DEAL_TYPE_MAP[b.dealType] || b.dealType,
        volume: Number(b.volume),
        price: Number(b.price),
        unit: b.unit || 'т',
        region: b.region,
        shipAddress: b.shipAddress,
        incoterm: b.incoterm,
        quality: b.quality || null,
        description: b.description || null,
        minParty: b.minParty || null,
        paymentTerms: b.paymentTerms || null,
        sampleAvailable: !!b.sampleAvailable,
        sampleAddress: b.samplePickupAddress || null,
        sampleViaRugrain: !!b.sampleViaRugrain,
        status: 'PENDING', // ждёт модерации
      },
      include: listingInclude,
    });

    return reply.code(201).send({ listing: serializeListing(listing) });
  });

  // PATCH /api/listings/:id — редактировать своё объявление (нужна авторизация + владение)
  fastify.patch('/:id', { preHandler: authMiddleware }, async (request, reply) => {
    const existing = await loadOwnedListingOr403(request, reply);
    if (!existing) return; // ответ уже отправлен в loadOwnedListingOr403

    const b = request.body || {};
    const data = {};
    if (b.title !== undefined) data.title = b.title;
    if (b.category !== undefined) data.category = b.category;
    if (b.dealType !== undefined) data.dealType = DEAL_TYPE_MAP[b.dealType] || b.dealType;
    if (b.volume !== undefined) data.volume = Number(b.volume);
    if (b.price !== undefined) data.price = Number(b.price);
    if (b.unit !== undefined) data.unit = b.unit;
    if (b.region !== undefined) data.region = b.region;
    if (b.shipAddress !== undefined) data.shipAddress = b.shipAddress;
    if (b.incoterm !== undefined) data.incoterm = b.incoterm;
    if (b.quality !== undefined) data.quality = b.quality || null;
    if (b.description !== undefined) data.description = b.description || null;
    if (b.minParty !== undefined) data.minParty = b.minParty || null;
    if (b.paymentTerms !== undefined) data.paymentTerms = b.paymentTerms || null;
    if (b.sampleAvailable !== undefined) data.sampleAvailable = !!b.sampleAvailable;
    if (b.samplePickupAddress !== undefined) data.sampleAddress = b.samplePickupAddress || null;
    if (b.sampleViaRugrain !== undefined) data.sampleViaRugrain = !!b.sampleViaRugrain;
    // Позволяем самому продавцу снять объявление с публикации или вернуть его обратно.
    if (b.status !== undefined && EDITABLE_STATUSES.includes(b.status)) data.status = b.status;

    const updated = await prisma.listing.update({
      where: { id: existing.id },
      data,
      include: listingInclude,
    });
    return { listing: serializeListing(updated) };
  });

  // DELETE /api/listings/:id — снять объявление с публикации.
  // Это мягкое удаление (status -> CLOSED), а не физическое: на объявление в будущем
  // могут ссылаться заявки/сделки, а GET /api/listings и так скрывает CLOSED из общей ленты.
  fastify.delete('/:id', { preHandler: authMiddleware }, async (request, reply) => {
    const existing = await loadOwnedListingOr403(request, reply);
    if (!existing) return;

    const updated = await prisma.listing.update({
      where: { id: existing.id },
      data: { status: 'CLOSED' },
      include: listingInclude,
    });
    return { listing: serializeListing(updated) };
  });
};
