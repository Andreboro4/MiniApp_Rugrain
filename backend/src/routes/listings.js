const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');

const DEAL_TYPE_MAP = { sell: 'SELL', buy: 'BUY' };

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

module.exports = async function (fastify, opts) {
  // GET /api/listings?category=Зерновые&dealType=sell
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
};
