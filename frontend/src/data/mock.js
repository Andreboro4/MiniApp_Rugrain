export const CATS = ['Все', 'Зерновые', 'Масличные', 'Бобовые', 'Мука и крупы', 'Корма', 'Другое'];

export const LISTINGS = [
  { id: 1, cat: 'Зерновые', dealType: 'sell', title: 'Пшеница озимая 3 кл.', vol: '500 т', price: 14200, unit: 'т', region: 'Краснодарский край', shipAddress: 'Элеватор №1, ст. Кущёвская', incoterm: 'FCA', quality: 'Клейковина от 23%, влажность 12.5%, натура 780 г/л', seller: 'КФХ Агро-Юг', verified: true, rating: 4.8, ratingCount: 26, minParty: '20 т', delivery: 'Доставка', payment: 'Аванс 30%', phone: '+7 913 555-21-40', desc: 'Клейковина от 23%, влажность 12.5%. Хранение на элеваторе, возможна отгрузка ж/д.', sampleAvailable: true, samplePickupAddress: 'г. Краснодар, ул. Элеваторная, 5', sampleViaRugrain: false },
  { id: 2, cat: 'Масличные', dealType: 'sell', title: 'Подсолнечник масличный', vol: '200 т', price: 28500, unit: 'т', region: 'Воронежская обл.', shipAddress: 'Склад А, п. Рамонь', incoterm: 'EXW', quality: 'Влажность 7.8%, сорность 2%', seller: 'ООО Поле-Инвест', verified: true, rating: 4.6, ratingCount: 14, minParty: '10 т', delivery: 'Самовывоз', payment: 'Рассрочка 20%', phone: '+7 903 214-08-77', desc: 'Урожай текущего года.', sampleAvailable: false },
  { id: 3, cat: 'Бобовые', dealType: 'sell', title: 'Горох посевной', vol: '80 т', price: 18900, unit: 'т', region: 'Ростовская обл.', shipAddress: 'Элеватор, х. Маяк', incoterm: 'FCA', quality: 'Протеин 22.1%, влажность 14%', seller: 'ИП Смирнов А.П.', verified: true, rating: 4.4, ratingCount: 9, minParty: '5 т', delivery: 'Доставка', payment: 'Аванс 50%', phone: '+7 919 044-12-03', desc: 'Есть сертификат качества.', sampleAvailable: true, samplePickupAddress: 'г. Ростов-на-Дону, ул. Складская, 12', sampleViaRugrain: false },
  { id: 4, cat: 'Зерновые', dealType: 'buy', title: 'Закупаем кукурузу фуражную', vol: '1000 т', price: 12800, unit: 'т', region: 'Ставропольский край', shipAddress: 'Приём на элеваторе, г. Изобильный', incoterm: 'CPT', quality: 'Требования: влажность до 14%, сорность до 3%', seller: 'АО Степные Зори', verified: true, rating: 4.7, ratingCount: 31, minParty: '50 т', delivery: 'Доставка от продавца', payment: 'Аванс 30%', phone: '+7 928 611-44-90', desc: 'Закупаем крупные партии, оплата по факту приёмки на элеваторе.', sampleAvailable: false },
  { id: 5, cat: 'Мука и крупы', dealType: 'sell', title: 'Мука пшеничная в/с', vol: '30 т', price: 26800, unit: 'т', region: 'Омская обл.', shipAddress: 'г. Омск, ул. Мельничная, 3', incoterm: 'FCA', quality: 'Зольность до 0.55%, белизна 60 ед.', seller: 'МельКомбинат-7', verified: false, rating: 4.1, ratingCount: 5, minParty: '2 т', delivery: 'Доставка', payment: 'Аванс 30%', phone: '+7 917 663-90-08', desc: 'Регулярные поставки, возможна отсрочка.', sampleAvailable: true, samplePickupAddress: 'г. Омск, ул. Мельничная, 3', sampleViaRugrain: true },
  { id: 6, cat: 'Корма', dealType: 'buy', title: 'Закупаем жмых подсолнечный', vol: '60 т', price: 18200, unit: 'т', region: 'Курганская обл.', shipAddress: 'Приём: г. Курган, база №2', incoterm: 'CPT', quality: 'Требования: протеин от 36%', seller: 'КормПром', verified: false, rating: 3.9, ratingCount: 7, minParty: '5 т', delivery: '—', payment: 'Аванс 50%', phone: '+7 919 044-77-21', desc: 'Нужен регулярный поставщик.', sampleAvailable: false },
];

const nowTs = Date.now();

export const AUCTIONS = [
  { id: 101, title: 'Пшеница мягкая 4 кл., 300 т', cat: 'Зерновые', dealType: 'sell', current: 14750, step: 250, endsAt: nowTs + 2 * 3600000 + 23 * 60000, region: 'Тамбовская обл.', shipAddress: 'Элеватор, г. Тамбов', incoterm: 'FCA', quality: 'Клейковина 21%, влажность 13%', seller: 'АО Нива', verified: true, rating: 4.5, ratingCount: 12, vol: '300 т', sampleAvailable: true, samplePickupAddress: 'г. Тамбов, элеваторная база', sampleViaRugrain: false,
    bids: [{ who: 'ООО ТрейдАгро', amt: 14750, t: '15:42' }, { who: 'КФХ Стрижов', amt: 14500, t: '14:17' }] },
  { id: 102, title: 'Закупаем ячмень пивоваренный, 150 т', cat: 'Зерновые', dealType: 'buy', current: 16200, step: 200, endsAt: nowTs + 5 * 3600000 + 45 * 60000, region: 'Белгородская обл.', shipAddress: 'Приём на солодовне', incoterm: 'CPT', quality: 'Требования: белок 9.5–11.5%', seller: 'КФХ Зернышко', verified: true, rating: 4.6, ratingCount: 8, vol: '150 т', sampleAvailable: false,
    bids: [{ who: 'Балтика-Агро', amt: 16200, t: '16:01' }] },
  { id: 103, title: 'Лён масличный, 80 т', cat: 'Масличные', dealType: 'sell', current: 23500, step: 500, endsAt: nowTs + 1 * 3600000 + 8 * 60000, region: 'Омская обл.', shipAddress: 'г. Омск, склад Льновод', incoterm: 'EXW', quality: 'Масличность 42%', seller: 'КФХ Льновод', verified: false, rating: 4.0, ratingCount: 4, vol: '80 т', sampleAvailable: true, samplePickupAddress: 'г. Омск, ул. Складская, 9', sampleViaRugrain: true,
    bids: [{ who: 'ООО ЛьноПром', amt: 23500, t: '16:28' }] },
];

export const MOCK_INN = {
  '7701234567': { name: 'ООО «АгроЮг Плюс»', inn: '7701234567', ogrn: '1037700000000', status: 'ok', region: 'Краснодарский край', type: 'ООО', since: '2011', risk: 'низкий' },
  '5012345678': { name: 'КФХ Иванченко П.С.', inn: '5012345678', ogrn: '318501700012345', status: 'ok', region: 'Ростовская область', type: 'КФХ', since: '2018', risk: 'средний' },
  '0000000000': { name: 'ООО «Призрак»', inn: '0000000000', ogrn: '—', status: 'bad', region: '—', type: '—', since: '—', risk: 'высокий' },
};

export const MOCK_ORG_DETAILS = {
  'ООО ТрейдАгро': { name: 'ООО «ТрейдАгро»', inn: '7801234567', ogrn: '1147847001234', addr: '196084, г. Санкт-Петербург, Московский пр-т, 143', phone: '+7 812 305-11-20', email: 'deal@tradeagro.ru', bank: 'АО «Тинькофф Банк»', rs: '40702810500000012345', bik: '044525974', ks: '30101810145250000974' },
  'КФХ Стрижов': { name: 'КФХ Стрижов А.Н.', inn: '6234110099', ogrn: '315623400012300', addr: '393700, Тамбовская обл., с. Стрижи, ул. Полевая, 2', phone: '+7 915 220-45-10', email: 'strizhov.kfh@mail.ru', bank: 'ПАО Сбербанк', rs: '40802810300000067890', bik: '046311602', ks: '30101810600000000602' },
  'ИП Волков Д.С.': { name: 'ИП Волков Дмитрий Сергеевич', inn: '550301234567', ogrn: '318554300045600', addr: '644010, г. Омск, ул. Ленина, 25, оф. 4', phone: '+7 908 800-14-77', email: 'volkov.ds@bk.ru', bank: 'АО «Альфа-Банк»', rs: '40802810900000054321', bik: '044525593', ks: '30101810200000000593' },
  'ООО МальтТрейд': { name: 'ООО «МальтТрейд»', inn: '3123045678', ogrn: '1093123001122', addr: '308000, г. Белгород, ул. Мичурина, 41', phone: '+7 4722 35-20-10', email: 'office@malttrade.ru', bank: 'ПАО «ФК Открытие»', rs: '40702810700000012399', bik: '044525999', ks: '30101810845250000999' },
};

export function orgDetailsFor(name) {
  return MOCK_ORG_DETAILS[name] || { name, inn: '—', ogrn: '—', addr: 'Уточняется', phone: '—', email: '—', bank: '—', rs: '—', bik: '—', ks: '—' };
}

export const INCOMING_REQUESTS = [
  { id: 1, type: 'sample', buyer: 'ООО ТрейдАгро', listing: 'Пшеница озимая 3 кл.', detail: 'Проба 0.5 кг, курьером до Краснодара', status: 'new', date: '08.07.2026', address: 'г. Краснодар, ул. Складская, 12', method: 'Курьером' },
  { id: 2, type: 'offer', buyer: 'КФХ Стрижов', listing: 'Подсолнечник масличный', detail: 'Предложил 27 800 ₽/т за партию 150 т', status: 'new', date: '07.07.2026' },
  { id: 3, type: 'sample', buyer: 'ИП Волков Д.С.', listing: 'Горох посевной', detail: 'Проба 1 кг, самовывоз', status: 'approved', date: '05.07.2026', address: 'г. Ростов-на-Дону, ул. Складская, 12', method: 'Самовывоз' },
];

export const OUTGOING_REQUESTS = [
  { id: 901, type: 'sample', seller: 'КФХ Агро-Юг', listing: 'Пшеница озимая 3 кл.', detail: 'Проба 0.5 кг, курьером, ул. Полевая 4, Омск', status: 'new', date: '04.07.2026' },
];

export const OUTGOING_BIDS = [
  { id: 1001, type: 'bid', seller: 'АО Нива', listing: 'Пшеница мягкая 4 кл., 300 т', detail: 'Ставка: 14 750 ₽/т', status: 'new', date: '09.07.2026' },
];

export const ERP_ITEMS = [
  { id: 1, name: 'Пшеница озимая 3 кл.', cat: 'Зерновые', qty: 450, unit: 'т', wh: 'Элеватор №1, Краснодар', sell: 14200, quality: 'Клейковина 23%, влажность 12.5%', status: 'in_stock' },
  { id: 2, name: 'Подсолнечник', cat: 'Масличные', qty: 80, unit: 'т', wh: 'Склад А, Воронеж', sell: 28500, quality: 'Влажность 7.8%, сорность 2%', status: 'in_stock' },
  { id: 3, name: 'Соя продовольственная', cat: 'Бобовые', qty: 20, unit: 'т', wh: 'Элеватор №2, Амурск', sell: 35200, quality: 'Протеин 36%', status: 'low' },
  { id: 4, name: 'Рапс озимый', cat: 'Масличные', qty: 0, unit: 'т', wh: '—', sell: 31000, quality: 'Масличность 44%', status: 'sold' },
];

export function fmt(n) {
  return n.toLocaleString('ru-RU');
}

export function fmtTime(ms) {
  ms = Math.max(0, ms);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}ч ${String(m).padStart(2, '0')}м ${String(s).padStart(2, '0')}с`;
}

export function parseVol(v) {
  return parseInt(String(v).replace(/\D/g, '')) || 1;
}
