const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Демо-продавцы — перенесены из frontend/src/data/mock.js (LISTINGS), чтобы биржа
// не была пустой сразу после первой миграции.
const SELLERS = [
  {
    key: 'agro-yug',
    name: 'КФХ Агро-Юг',
    inn: '2350008080',
    ogrn: '1042305012345',
    address: 'г. Краснодар, ул. Элеваторная, 5',
    phone: '+7 913 555-21-40',
    email: 'agro-yug@example.com',
    verified: true,
    rating: 4.8,
    ratingCount: 26,
  },
  {
    key: 'pole-invest',
    name: 'ООО Поле-Инвест',
    inn: '3663088888',
    ogrn: '1113668012345',
    address: 'Воронежская обл., п. Рамонь, склад А',
    phone: '+7 903 214-08-77',
    email: 'pole-invest@example.com',
    verified: true,
    rating: 4.6,
    ratingCount: 14,
  },
  {
    key: 'smirnov',
    name: 'ИП Смирнов А.П.',
    inn: '616500123456',
    ogrn: '316619600012345',
    address: 'Ростовская обл., х. Маяк',
    phone: '+7 919 044-12-03',
    email: 'smirnov@example.com',
    verified: true,
    rating: 4.4,
    ratingCount: 9,
  },
  {
    key: 'stepnye-zori',
    name: 'АО Степные Зори',
    inn: '2632077777',
    ogrn: '1022601012345',
    address: 'Ставропольский край, г. Изобильный',
    phone: '+7 928 611-44-90',
    email: 'stepnye-zori@example.com',
    verified: true,
    rating: 4.7,
    ratingCount: 31,
  },
  {
    key: 'melkombinat-7',
    name: 'МельКомбинат-7',
    inn: '5500666666',
    ogrn: '1025500012345',
    address: 'г. Омск, ул. Мельничная, 3',
    phone: '+7 917 663-90-08',
    email: 'melkombinat7@example.com',
    verified: false,
    rating: 4.1,
    ratingCount: 5,
  },
  {
    key: 'kormprom',
    name: 'КормПром',
    inn: '4501055555',
    ogrn: '1104501012345',
    address: 'г. Курган, база №2',
    phone: '+7 919 044-77-21',
    email: 'kormprom@example.com',
    verified: false,
    rating: 3.9,
    ratingCount: 7,
  },
];

// Демо-объявления — соответствуют LISTINGS из frontend/src/data/mock.js
const LISTINGS = [
  {
    sellerKey: 'agro-yug',
    title: 'Пшеница озимая 3 кл.',
    category: 'Зерновые',
    dealType: 'SELL',
    volume: 500,
    price: 14200,
    region: 'Краснодарский край',
    shipAddress: 'Элеватор №1, ст. Кущёвская',
    incoterm: 'FCA',
    quality: 'Клейковина от 23%, влажность 12.5%, натура 780 г/л',
    description: 'Клейковина от 23%, влажность 12.5%. Хранение на элеваторе, возможна отгрузка ж/д.',
    minParty: '20 т',
    sampleAvailable: true,
    sampleAddress: 'г. Краснодар, ул. Элеваторная, 5',
    sampleViaRugrain: false,
  },
  {
    sellerKey: 'pole-invest',
    title: 'Подсолнечник масличный',
    category: 'Масличные',
    dealType: 'SELL',
    volume: 200,
    price: 28500,
    region: 'Воронежская обл.',
    shipAddress: 'Склад А, п. Рамонь',
    incoterm: 'EXW',
    quality: 'Влажность 7.8%, сорность 2%',
    description: 'Урожай текущего года.',
    minParty: '10 т',
    sampleAvailable: false,
  },
  {
    sellerKey: 'smirnov',
    title: 'Горох посевной',
    category: 'Бобовые',
    dealType: 'SELL',
    volume: 80,
    price: 18900,
    region: 'Ростовская обл.',
    shipAddress: 'Элеватор, х. Маяк',
    incoterm: 'FCA',
    quality: 'Протеин 22.1%, влажность 14%',
    description: 'Есть сертификат качества.',
    minParty: '5 т',
    sampleAvailable: true,
    sampleAddress: 'г. Ростов-на-Дону, ул. Складская, 12',
    sampleViaRugrain: false,
  },
  {
    sellerKey: 'stepnye-zori',
    title: 'Закупаем кукурузу фуражную',
    category: 'Зерновые',
    dealType: 'BUY',
    volume: 1000,
    price: 12800,
    region: 'Ставропольский край',
    shipAddress: 'Приём на элеваторе, г. Изобильный',
    incoterm: 'CPT',
    quality: 'Требования: влажность до 14%, сорность до 3%',
    description: 'Закупаем крупные партии, оплата по факту приёмки на элеваторе.',
    minParty: '50 т',
    sampleAvailable: false,
  },
  {
    sellerKey: 'melkombinat-7',
    title: 'Мука пшеничная в/с',
    category: 'Мука и крупы',
    dealType: 'SELL',
    volume: 30,
    price: 26800,
    region: 'Омская обл.',
    shipAddress: 'г. Омск, ул. Мельничная, 3',
    incoterm: 'FCA',
    quality: 'Зольность до 0.55%, белизна 60 ед.',
    description: 'Регулярные поставки, возможна отсрочка.',
    minParty: '2 т',
    sampleAvailable: true,
    sampleAddress: 'г. Омск, ул. Мельничная, 3',
    sampleViaRugrain: true,
  },
  {
    sellerKey: 'kormprom',
    title: 'Закупаем жмых подсолнечный',
    category: 'Корма',
    dealType: 'BUY',
    volume: 60,
    price: 18200,
    region: 'Курганская обл.',
    shipAddress: 'Приём: г. Курган, база №2',
    incoterm: 'CPT',
    quality: 'Требования: протеин от 36%',
    description: 'Нужен регулярный поставщик.',
    minParty: '5 т',
    sampleAvailable: false,
  },
];

// Строим набор оценок, чья сумма даёт нужный средний рейтинг (для наглядной демонстрации RatingBadge).
function buildScores(avgRating, count) {
  const total = Math.round(avgRating * count);
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  const scores = new Array(count).fill(Math.min(5, Math.max(1, base)));
  for (let i = 0; i < remainder && i < scores.length; i++) {
    scores[i] = Math.min(5, scores[i] + 1);
  }
  return scores;
}

async function main() {
  console.log('🌱 Сидирование БД демо-данными...');

  // Пользователь, от имени которого проставляются демо-оценки продавцам.
  const demoBuyer = await prisma.user.upsert({
    where: { maxUserId: 'seed-demo-buyer' },
    update: {},
    create: { maxUserId: 'seed-demo-buyer', name: 'ООО ТрейдАгро', isGuest: false },
  });

  const sellerIdByKey = {};

  for (const s of SELLERS) {
    const user = await prisma.user.upsert({
      where: { maxUserId: `seed-${s.key}` },
      update: {},
      create: {
        maxUserId: `seed-${s.key}`,
        name: s.name,
        phone: s.phone,
        isGuest: false,
        orgDetails: {
          create: {
            name: s.name,
            inn: s.inn,
            ogrn: s.ogrn,
            address: s.address,
            phone: s.phone,
            email: s.email,
          },
        },
        verification: {
          create: {
            status: s.verified ? 'APPROVED' : 'NONE',
          },
        },
      },
    });
    sellerIdByKey[s.key] = user.id;

    // Пропускаем, если у продавца уже есть оценки (повторный запуск seed).
    const existingRatings = await prisma.rating.count({ where: { receiverId: user.id } });
    if (existingRatings === 0 && s.ratingCount > 0) {
      const scores = buildScores(s.rating, s.ratingCount);
      await prisma.rating.createMany({
        data: scores.map((score, i) => ({
          giverId: demoBuyer.id,
          receiverId: user.id,
          dealId: `seed-${s.key}-${i}`,
          score,
        })),
      });
    }
  }

  for (const l of LISTINGS) {
    const userId = sellerIdByKey[l.sellerKey];
    const exists = await prisma.listing.findFirst({ where: { userId, title: l.title } });
    if (exists) continue;

    await prisma.listing.create({
      data: {
        userId,
        title: l.title,
        category: l.category,
        dealType: l.dealType,
        volume: l.volume,
        price: l.price,
        unit: 'т',
        region: l.region,
        shipAddress: l.shipAddress,
        incoterm: l.incoterm,
        quality: l.quality || null,
        description: l.description || null,
        minParty: l.minParty || null,
        sampleAvailable: !!l.sampleAvailable,
        sampleAddress: l.sampleAddress || null,
        sampleViaRugrain: !!l.sampleViaRugrain,
        status: 'PUBLISHED',
      },
    });
  }

  console.log(`✅ Готово: ${SELLERS.length} продавцов, ${LISTINGS.length} объявлений.`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидирования:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
