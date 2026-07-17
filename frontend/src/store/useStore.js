import { create } from 'zustand';
import {
  AUCTIONS,
  INCOMING_REQUESTS,
  OUTGOING_REQUESTS,
  OUTGOING_BIDS,
  ERP_ITEMS,
  orgDetailsFor,
  parseVol,
  fmt,
} from '../data/mock';
import { getToken, saveToken, clearToken } from '../lib/api';
import { loginMax as apiLoginMax, loginGuest as apiLoginGuest, fetchMe } from '../api/auth';
import { fetchListings as apiFetchListings } from '../api/listings';

let toastTimer = null;

export const useStore = create((set, get) => ({
  // ---- auth ----
  loggedIn: false,
  guest: false,
  user: null,
  authLoading: !!getToken(), // если токен уже есть в localStorage — сначала проверяем его на бэкенде
  loginMax: async () => {
    try {
      // ВРЕМЕННАЯ ЗАГЛУШКА: реальный флоу MAX должен передавать сюда initData из MAX SDK,
      // а не придуманный на клиенте maxUserId. Подмена нужна только пока нет доступа к MAX Bot API.
      let maxUserId = localStorage.getItem('rugrain_dev_max_id');
      if (!maxUserId) {
        maxUserId = `dev-${Date.now()}`;
        localStorage.setItem('rugrain_dev_max_id', maxUserId);
      }
      const { token, user } = await apiLoginMax({ maxUserId, name: 'Пользователь MAX' });
      saveToken(token);
      set({ loggedIn: true, guest: false, user });
      get().showToast('Вход через MAX выполнен');
    } catch (e) {
      get().showToast('Не удалось войти — проверьте, что backend запущен');
    }
  },
  loginGuest: async () => {
    try {
      const { token, user } = await apiLoginGuest();
      saveToken(token);
      set({ loggedIn: true, guest: true, user });
    } catch (e) {
      get().showToast('Не удалось войти как гость — проверьте, что backend запущен');
    }
  },
  logout: () => {
    clearToken();
    set({ loggedIn: false, guest: false, user: null });
  },
  // Вызывается один раз при старте приложения, чтобы восстановить сессию по токену из localStorage
  restoreSession: async () => {
    if (!getToken()) {
      set({ authLoading: false });
      return;
    }
    try {
      const { user } = await fetchMe();
      set({ user, loggedIn: true, guest: !!user.isGuest, authLoading: false });
    } catch (e) {
      clearToken();
      set({ loggedIn: false, guest: false, user: null, authLoading: false });
    }
  },
  requireAuth: (actionLabel) => {
    if (get().guest) {
      get().showToast(`Войдите через MAX, чтобы ${actionLabel}`);
      return false;
    }
    return true;
  },

  // ---- toast ----
  toast: '',
  showToast: (msg) => {
    clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: '' }), 2600);
  },

  // ---- favorites ----
  favorites: new Set(),
  toggleFav: (id, type) => {
    if (!get().requireAuth('добавлять в избранное')) return;
    const key = `${type}:${id}`;
    const favorites = new Set(get().favorites);
    favorites.has(key) ? favorites.delete(key) : favorites.add(key);
    set({ favorites });
  },
  isFav: (id, type) => get().favorites.has(`${type}:${id}`),

  // ---- listings (реальные данные с backend, GET /api/listings) ----
  listings: [],
  listingsLoading: false,
  listingsError: null,
  fetchListings: async (params) => {
    set({ listingsLoading: true, listingsError: null });
    try {
      const listings = await apiFetchListings(params);
      set({ listings, listingsLoading: false });
    } catch (e) {
      set({ listingsError: 'Не удалось загрузить объявления — проверьте backend и БД', listingsLoading: false });
    }
  },

  // ---- market / auctions filters ----
  filter: 'Все',
  dealFilter: 'all',
  setFilter: (c) => set({ filter: c }),
  setDealFilter: (d) => set({ dealFilter: d }),

  // ---- auctions (mutable current price / bids) ----
  auctions: AUCTIONS.map((a) => ({ ...a, bids: [...a.bids] })),
  placeBid: (auctionId, amt) => {
    if (!get().requireAuth('сделать ставку')) return;
    if (!get().requireOrgDetails('сделать ставку')) return;
    const auctions = get().auctions.map((a) => {
      if (a.id !== auctionId) return a;
      const isBuy = a.dealType === 'buy';
      if (isBuy ? amt > a.current - a.step : amt < a.current + a.step) return a;
      return {
        ...a,
        current: amt,
        bids: [{ who: 'Вы', amt, t: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }, ...a.bids],
      };
    });
    const a = auctions.find((x) => x.id === auctionId);
    set({ auctions });
    const outgoingBids = [
      { id: Date.now(), type: 'bid', seller: a.seller, listing: a.title, detail: `Ставка: ${fmt(amt)} ₽/т`, status: 'new', date: new Date().toLocaleDateString('ru-RU') },
      ...get().outgoingBids,
    ];
    set({ outgoingBids });
    get().showToast('Ставка принята и добавлена в исходящие');
  },
  bidError: (auctionId, amt) => {
    const a = get().auctions.find((x) => x.id === auctionId);
    if (!a) return null;
    const isBuy = a.dealType === 'buy';
    if (isBuy && amt > a.current - a.step) return `Ставка должна быть ниже текущей минимум на шаг: не выше ${fmt(a.current - a.step)} ₽`;
    if (!isBuy && amt < a.current + a.step) return `Минимальная ставка: ${fmt(a.current + a.step)} ₽`;
    return null;
  },

  // ---- deals / monetization ----
  dealsTotal: 0,
  history: [
    { title: 'Сделка: Ячмень фуражный', date: '06.07.2026', amount: 0, paid: false },
    { title: 'Сделка: Соя кормовая', date: '05.07.2026', amount: 0, paid: false },
  ],
  pendingRating: null,
  completeDeal: (title, lotValue, counterparty) => {
    const total = get().dealsTotal + 1;
    let paid = false;
    let commission = 0;
    if (total > 2) {
      paid = true;
      commission = Math.round(lotValue * 0.005);
    }
    set({
      dealsTotal: total,
      history: [{ title: `Сделка: ${title}`, date: '09.07.2026', amount: commission, paid }, ...get().history],
      pendingRating: { counterparty, title },
    });
    get().showToast(paid ? `Сделка оформлена. Комиссия платформы: ${fmt(commission)} ₽` : 'Сделка оформлена бесплатно (в рамках первых 2 сделок)');
  },
  buyListing: (listing) => {
    if (!get().requireAuth(listing.dealType === 'buy' ? 'откликнуться на закупку' : 'купить и открыть контакт')) return;
    if (!get().requireOrgDetails(listing.dealType === 'buy' ? 'откликнуться на закупку' : 'купить')) return;
    get().completeDeal(listing.title, listing.price * parseVol(listing.vol), listing.seller);
  },
  submitRating: (stars) => {
    const p = get().pendingRating;
    get().showToast(`Спасибо! Вы поставили оценку ${stars} ★ для «${p?.counterparty}»`);
    set({ pendingRating: null });
  },
  skipRating: () => set({ pendingRating: null }),

  // ---- org details ----
  orgDetails: {
    name: 'ООО «Ругрейн»',
    inn: '5503268892',
    ogrn: '1155543123456',
    addr: '644010, г. Омск, ул. Ленина, 25, оф. 4',
    phone: '+7 3812 55-12-33',
    email: 'info@rugrain.ru',
    bank: 'ПАО Сбербанк',
    rs: '40702810900000098765',
    bik: '044525593',
    ks: '30101810200000000593',
  },
  saveOrgDetails: (d) => {
    set({ orgDetails: d });
    const missing = get().orgDetailsMissing();
    get().showToast(missing.length ? `Сохранено. Укажите обязательные поля: ${missing.join(', ')}` : '✅ Реквизиты сохранены. Теперь вы можете торговать!');
  },
  hasOrgDetails: () => {
    const d = get().orgDetails || {};
    return !!(d.name && d.inn && d.ogrn && d.addr && d.phone && d.email);
  },
  orgDetailsMissing: () => {
    const d = get().orgDetails || {};
    const missing = [];
    if (!d.name) missing.push('Название организации');
    if (!d.inn) missing.push('ИНН');
    if (!d.ogrn) missing.push('ОГРН');
    if (!d.addr) missing.push('Юридический адрес');
    if (!d.phone) missing.push('Телефон');
    if (!d.email) missing.push('Email');
    return missing;
  },
  requireOrgDetails: (actionLabel) => {
    if (!get().hasOrgDetails()) {
      const missing = get().orgDetailsMissing();
      get().showToast(`Укажите реквизиты организации (${missing.join(', ')}), чтобы ${actionLabel}`);
      return false;
    }
    return true;
  },

  // ---- verification ----
  verify: { status: 'none', docs: { egr: false, passport: false, selfie: false }, loading: false },
  toggleDoc: (key) => {
    if (!get().requireAuth('загрузить документы верификации')) return;
    const verify = { ...get().verify, docs: { ...get().verify.docs, [key]: !get().verify.docs[key] } };
    set({ verify });
  },
  submitVerify: () => {
    if (!get().requireAuth('отправить документы на проверку')) return;
    const { docs } = get().verify;
    if (!docs.egr || !docs.passport || !docs.selfie) {
      get().showToast('Загрузите все три документа');
      return;
    }
    set({ verify: { ...get().verify, loading: true } });
    setTimeout(() => {
      set({ verify: { ...get().verify, loading: false, status: 'pending' } });
      get().showToast('Документы отправлены администратору на проверку');
    }, 900);
  },

  // ---- contragent check ----
  verifyResult: null,
  verifyLoading: false,
  runVerify: (inn, mockInn) => {
    if (!get().requireAuth('проверить контрагента')) return;
    if (!inn) {
      get().showToast('Введите ИНН');
      return;
    }
    set({ verifyLoading: true });
    setTimeout(() => {
      set({
        verifyLoading: false,
        verifyResult: mockInn[inn] || { name: 'Организация не найдена', inn, status: 'bad', ogrn: '—', region: '—', type: '—', since: '—', risk: 'высокий' },
      });
    }, 1100);
  },

  // ---- ERP ----
  erp: ERP_ITEMS.map((i) => ({ ...i })),
  addErpItem: (item) => {
    if (!get().requireAuth('добавить позицию в ERP')) return;
    set({ erp: [{ id: Date.now(), status: item.qty > 0 ? 'in_stock' : 'sold', unit: 'т', ...item }, ...get().erp] });
    get().showToast('Позиция добавлена в ERP');
  },
  myListings: [],
  createListingDraft: (draft) => {
    if (!get().requireOrgDetails('создать объявление')) return;
    set({ myListings: [draft, ...get().myListings] });
    get().showToast(`«${draft.title}» сохранено как черновик и отправлено на модерацию`);
  },

  // ---- requests ----
  incoming: INCOMING_REQUESTS.map((r) => ({ ...r })),
  outgoing: OUTGOING_REQUESTS.map((r) => ({ ...r })),
  outgoingBids: OUTGOING_BIDS.map((r) => ({ ...r })),
  reqSub: 'incoming',
  setReqSub: (s) => set({ reqSub: s }),
  openDeal: null,
  approveRequest: (id) => {
    if (!get().requireAuth('обработать заявку')) return;
    const incoming = get().incoming.map((r) => (r.id === id ? { ...r, status: 'approved', deal: orgDetailsFor(r.buyer) } : r));
    const r = incoming.find((x) => x.id === id);
    set({ incoming, openDeal: r.deal });
    get().showToast('Заявка одобрена — сделка сформирована');
  },
  rejectRequest: (id) => {
    if (!get().requireAuth('обработать заявку')) return;
    set({ incoming: get().incoming.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)) });
    get().showToast('Заявка отклонена');
  },
  showDeal: (reqId) => {
    const r = get().incoming.find((x) => x.id === reqId);
    if (r && r.deal) set({ openDeal: r.deal });
  },
  closeDealSheet: () => set({ openDeal: null }),
  submitSample: ({ listing, seller, qty, method, addr, isFree }) => {
    if (!get().requireOrgDetails('заказать пробу')) return;
    const detailTxt = isFree ? `Проба ${qty} кг, ${method.toLowerCase()}` : `Проба ${qty} кг, ${method.toLowerCase()}, адрес: ${addr}`;
    set({
      outgoing: [{ id: Date.now(), type: 'sample', seller, listing, detail: detailTxt, status: 'new', date: '09.07.2026' }, ...get().outgoing],
    });
    get().showToast('Заявка на пробу отправлена продавцу');
  },
}));
