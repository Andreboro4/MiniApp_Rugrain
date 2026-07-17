import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MOCK_INN, fmt } from '../data/mock';
import Icon from '../components/Icon';
import { DealTag } from '../components/Bits';

const SUBTABS = [
  { id: 'profile', label: 'Профиль', icon: 'user' },
  { id: 'orgdetails', label: 'Реквизиты', icon: 'building' },
  { id: 'verify', label: 'Верификация', icon: 'shield' },
  { id: 'contragent', label: 'Контрагент', icon: 'building' },
  { id: 'erp', label: 'ERP', icon: 'boxes' },
  { id: 'favorites', label: 'Избранное', icon: 'heart' },
];

export default function CabinetPage() {
  const [params, setParams] = useSearchParams();
  const [sub, setSub] = useState(params.get('sub') || 'profile');

  useEffect(() => {
    const s = params.get('sub');
    if (s) setSub(s);
  }, [params]);

  function changeSub(id) {
    setSub(id);
    setParams({ sub: id });
  }

  const { guest, verify, dealsTotal } = useStore();
  const vBadge = verify.status === 'verified' ? '· верифицирован' : verify.status === 'pending' ? '· документы на проверке' : '';

  return (
    <>
      <div className="profile-hero">
        <div className="profile-avatar">{guest ? <Icon name="guest" /> : 'ВК'}</div>
        <div>
          <div className="profile-name">{guest ? 'Гость' : 'Виктор Ковин'}</div>
          <div className="profile-org">{guest ? 'Войдите через MAX для полного доступа' : `ООО «Ругрейн» · Клиент ${vBadge}`}</div>
        </div>
      </div>
      <div className="subtabs">
        {SUBTABS.map((t) => (
          <div key={t.id} className={`subtab ${sub === t.id ? 'active' : ''}`} onClick={() => changeSub(t.id)}>
            <Icon name={t.icon} /> {t.label}
          </div>
        ))}
      </div>
      <div className="content">
        {sub === 'profile' && <ProfileSub dealsTotal={dealsTotal} />}
        {sub === 'orgdetails' && <OrgDetailsSub />}
        {sub === 'verify' && <VerifySub />}
        {sub === 'contragent' && <ContragentSub />}
        {sub === 'erp' && <ErpSub />}
        {sub === 'favorites' && <FavoritesSub />}
      </div>
    </>
  );
}

function ProfileSub({ dealsTotal }) {
  const history = useStore((s) => s.history);
  return (
    <>
      <div className="sec-title">Сделки и комиссия</div>
      <div className="info-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>Всего сделок</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 19, fontWeight: 800 }}>{dealsTotal}</div>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', textAlign: 'right' }}>Первые 2 — бесплатно<br />далее — 0,5% от лота</div>
      </div>
      <div className="sec-title">История сделок</div>
      {history.map((h, i) => (
        <div className="hist-row" key={i}>
          <div><div className="hist-title">{h.title}</div><div className="hist-date">{h.date}</div></div>
          <div className={`hist-amt ${h.paid ? 'paid' : 'free'}`}>{h.paid ? `комиссия −${fmt(h.amount)} ₽` : 'бесплатно'}</div>
        </div>
      ))}
      <div className="sec-title">Уведомления</div>
      <div className="info-box" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="chat" />
        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Все уведомления приходят от бота Ругрейн в MAX.</div>
      </div>
    </>
  );
}

function OrgDetailsSub() {
  const { orgDetails, orgDetailsMissing, saveOrgDetails } = useStore();
  const [form, setForm] = useState(orgDetails);
  const missing = orgDetailsMissing();
  const isComplete = missing.length === 0;

  function upd(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  const fields = [
    ['name', 'Название организации *', 'ООО «АгроЮг»'],
  ];

  return (
    <>
      <div className="sec-title">Реквизиты организации</div>
      {!isComplete ? (
        <div className="verify-result bad" style={{ marginBottom: 12 }}>
          <div className="vr-top"><div className="vr-name">⚠️ Реквизиты не заполнены</div></div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            Для торговли на бирже и аукционе необходимо указать следующие данные:<br /><b>{missing.join(', ')}</b>
          </div>
        </div>
      ) : (
        <div className="verify-result ok" style={{ marginBottom: 12 }}>
          <div className="vr-top"><div className="vr-name">✅ Реквизиты заполнены</div></div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Вы можете торговать на бирже и участвовать в аукционах.</div>
        </div>
      )}
      <div className="info-box"><label>Название организации *</label><input value={form.name || ''} onChange={upd('name')} placeholder="ООО «АгроЮг»" /></div>
      <div className="field-row">
        <div className="field"><label>ИНН *</label><input value={form.inn || ''} onChange={upd('inn')} placeholder="7701234567" /></div>
        <div className="field"><label>ОГРН *</label><input value={form.ogrn || ''} onChange={upd('ogrn')} placeholder="1157746123456" /></div>
      </div>
      <div className="info-box"><label>Юридический адрес *</label><input value={form.addr || ''} onChange={upd('addr')} placeholder="196084, г. Санкт-Петербург, Московский пр-т, 143" /></div>
      <div className="field-row">
        <div className="field"><label>Телефон *</label><input value={form.phone || ''} onChange={upd('phone')} placeholder="+7 812 305-11-20" /></div>
        <div className="field"><label>Email *</label><input value={form.email || ''} onChange={upd('email')} placeholder="deal@company.ru" /></div>
      </div>
      <div className="sec-title" style={{ marginTop: 16 }}>Банковские реквизиты</div>
      <div className="info-box"><label>Банк</label><input value={form.bank || ''} onChange={upd('bank')} placeholder="АО «Тинькофф Банк»" /></div>
      <div className="field-row">
        <div className="field"><label>Р/с</label><input value={form.rs || ''} onChange={upd('rs')} placeholder="40702810500000012345" /></div>
        <div className="field"><label>БИК</label><input value={form.bik || ''} onChange={upd('bik')} placeholder="044525974" /></div>
      </div>
      <div className="info-box"><label>К/с</label><input value={form.ks || ''} onChange={upd('ks')} placeholder="30101810145250000974" /></div>
      <button className="btn btn-primary btn-block" onClick={() => saveOrgDetails(form)}><Icon name="check" /> Сохранить реквизиты</button>
      <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 8, textAlign: 'center' }}>* — обязательные поля для торговли</div>
    </>
  );
}

function VerifySub() {
  const { verify, toggleDoc, submitVerify } = useStore();
  let badge;
  if (verify.status === 'verified') badge = <span className="badge green"><Icon name="check" /> Верифицирован</span>;
  else if (verify.status === 'pending') badge = <span className="badge gold"><Icon name="clock" /> На проверке</span>;
  else badge = <span className="badge gray">Не верифицирован</span>;

  const items = [
    { key: 'egr', icon: 'docs', title: 'Выписка из ЕГРЮЛ/ЕГРИП' },
    { key: 'passport', icon: 'id', title: 'Паспорт директора (разворот)' },
    { key: 'selfie', icon: 'cam', title: 'Фото директора с паспортом в руках', sub: 'Для проверки личности (антифрод)' },
  ];

  return (
    <>
      <div className="sec-title">Верификация аккаунта</div>
      <div className="info-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>Текущий статус</div>{badge}
      </div>
      <div className="sec-title">Документы для проверки</div>
      {items.map((it) => (
        <div key={it.key} className={`upload-item ${verify.docs[it.key] ? 'done' : ''}`} onClick={() => toggleDoc(it.key)}>
          <Icon name={it.icon} />
          <div className="t">{it.title}<div className="s">{verify.docs[it.key] ? 'Загружено' : it.sub || 'PDF, JPG — нажмите, чтобы прикрепить'}</div></div>
          {verify.docs[it.key] && <Icon name="check" />}
        </div>
      ))}
      <button className="btn btn-primary btn-block" onClick={submitVerify}>
        {verify.loading ? <span className="spinner" /> : <Icon name="check" />} Отправить на проверку
      </button>
      <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 7, textAlign: 'center' }}>Решение принимает администратор вручную, обычно до 1 рабочего дня.</div>
    </>
  );
}

function ContragentSub() {
  const { verifyLoading, verifyResult, runVerify } = useStore();
  const [inn, setInn] = useState(verifyResult ? verifyResult.inn : '');

  return (
    <>
      <div className="sec-title">Проверка контрагента</div>
      <div className="info-box">
        <label>ИНН организации или ИП</label>
        <div className="inn-row">
          <input value={inn} onChange={(e) => setInn(e.target.value)} placeholder="7701234567" />
          <button className="btn btn-blue" onClick={() => runVerify(inn.trim(), MOCK_INN)}>Проверить</button>
        </div>
        <div className="source-note"><Icon name="fns" /> Источник — сервис ФНС «Прозрачный бизнес» (pb.nalog.ru)</div>
        <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 6 }}>Тест: 7701234567 (ОК) · 5012345678 (риск) · 0000000000 (не найдено)</div>
      </div>
      {verifyLoading && (
        <div className="verify-result"><div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}><span className="spinner" /> Запрашиваем «Прозрачный бизнес»...</div></div>
      )}
      {!verifyLoading && verifyResult && (
        <div className={`verify-result ${verifyResult.status === 'ok' ? 'ok' : 'bad'}`}>
          <div className="vr-top">
            <div className="vr-name">{verifyResult.name}</div>
            <span className={`badge ${verifyResult.status === 'ok' ? 'green' : 'red'}`}>
              <Icon name={verifyResult.status === 'ok' ? 'check' : 'x'} /> {verifyResult.status === 'ok' ? 'Действующая' : 'Не подтверждено'}
            </span>
          </div>
          <div className="vr-grid">
            <div>ИНН<b>{verifyResult.inn}</b></div>
            <div>ОГРН<b>{verifyResult.ogrn}</b></div>
            <div>Форма<b>{verifyResult.type}</b></div>
            <div>С<b>{verifyResult.since}</b></div>
            <div>Регион<b>{verifyResult.region}</b></div>
            <div>Риск<b>{verifyResult.risk}</b></div>
          </div>
        </div>
      )}
    </>
  );
}

function ErpSub() {
  const { erp, myListings, addErpItem } = useStore();
  const [open, setOpen] = useState(false);
  const total = erp.reduce((s, i) => s + i.qty * i.sell, 0);

  return (
    <>
      <div className="sec-title">Складской учёт (ERP)</div>
      <div className="erp-total"><div className="lbl">Стоимость запасов</div><div className="val">{fmt(total)} ₽</div></div>
      <button className="btn btn-primary btn-block" onClick={() => setOpen(true)}><Icon name="plus" /> Добавить позицию</button>
      <div className="sec-title">Остатки</div>
      {erp.map((i) => (
        <div className="erp-row" key={i.id}>
          <div className="erp-top">
            <div className={`erp-status ${i.status}`} />
            <div className="ei">
              <div className="ei-title">{i.name}</div>
              <div className="ei-sub">{i.wh}</div>
              <div className="ei-sub" style={{ marginTop: 2, color: 'var(--green-deep)' }}>{i.quality || '—'}</div>
            </div>
            <div className="erp-qty">{i.qty} {i.unit}<span>{fmt(i.sell)} ₽/{i.unit}</span></div>
          </div>
          <button className="btn btn-outline btn-sm btn-block" onClick={() => useStore.getState().showToast(`«${i.name}» отправлено в черновик объявления`)}>
            <Icon name="store" /> Выставить на продажу
          </button>
        </div>
      ))}
      {myListings.length > 0 && (
        <>
          <div className="sec-title">Черновики объявлений из ERP</div>
          {myListings.map((m, i) => (
            <div className="inbox-card" key={i}>
              <div className="inbox-top"><div style={{ fontWeight: 700, fontSize: 12 }}>{m.title}</div><span className="pill gold">{m.status}</span></div>
              <div className="inbox-detail">{m.type || ''} · {m.vol} · {fmt(m.price)} ₽{m.incoterm ? ' · ' + m.incoterm : ''}</div>
            </div>
          ))}
        </>
      )}
      <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 6, textAlign: 'center' }}>
        Списание остатков — вручную. «Выставить на продажу» открывает черновик объявления, который можно скорректировать перед публикацией.
      </div>
      {open && <ErpAddSheet onClose={() => setOpen(false)} onSubmit={addErpItem} />}
    </>
  );
}

function ErpAddSheet({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [wh, setWh] = useState('');
  const [sell, setSell] = useState('');
  const [quality, setQuality] = useState('');

  function submit() {
    onSubmit({
      name: name || 'Новая позиция',
      cat: 'Другое',
      qty: parseInt(qty, 10) || 0,
      wh: wh || 'Не указан',
      sell: parseInt(sell, 10) || 0,
      quality: quality || 'Показатели качества не указаны',
    });
    onClose();
  }

  return (
    <div className="overlay show" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Новая позиция в ERP</div>
        <div className="field"><label>Наименование</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field-row">
          <div className="field"><label>Количество, т</label><input type="number" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
          <div className="field"><label>Цена, ₽/т</label><input type="number" value={sell} onChange={(e) => setSell(e.target.value)} /></div>
        </div>
        <div className="field"><label>Склад</label><input value={wh} onChange={(e) => setWh(e.target.value)} /></div>
        <div className="field"><label>Показатели качества</label><input value={quality} onChange={(e) => setQuality(e.target.value)} /></div>
        <button className="btn btn-primary btn-block" onClick={submit}><Icon name="check" /> Добавить</button>
      </div>
    </div>
  );
}

function FavoritesSub() {
  const navigate = useNavigate();
  const { favorites, auctions, toggleFav, listings, fetchListings } = useStore();

  useEffect(() => {
    if (!listings.length) fetchListings();
  }, []);

  const favListings = listings.filter((l) => favorites.has(`listing:${l.id}`));
  const favAuctions = auctions.filter((a) => favorites.has(`auction:${a.id}`));

  if (!favListings.length && !favAuctions.length) {
    return <><div className="sec-title">Избранное</div><div className="empty">Пока пусто — нажмите на сердечко на карточке товара</div></>;
  }

  return (
    <>
      <div className="sec-title">Избранное</div>
      {favListings.map((l) => (
        <div className="card" key={l.id} onClick={() => navigate(`/market/${l.id}`)}>
          <div className="card-top">
            <div><div className="card-tags"><DealTag dealType={l.dealType} /><span className="tag cat">{l.cat}</span></div><div className="card-title">{l.title}</div></div>
            <div className="heart on" onClick={(e) => { e.stopPropagation(); toggleFav(l.id, 'listing'); }}><Icon name="heart" filled /></div>
          </div>
          <div className="card-price">{fmt(l.price)} ₽<span> / {l.unit}</span></div>
        </div>
      ))}
      {favAuctions.map((a) => (
        <div className="card auc-card" key={a.id} onClick={() => navigate(`/auctions/${a.id}`)}>
          <div className="card-top">
            <div><div className="card-tags"><DealTag dealType={a.dealType} /><span className="tag cat">{a.cat} · аукцион</span></div><div className="card-title">{a.title}</div></div>
            <div className="heart on" onClick={(e) => { e.stopPropagation(); toggleFav(a.id, 'auction'); }}><Icon name="heart" filled /></div>
          </div>
          <div className="card-price">{fmt(a.current)} ₽<span> текущая цена</span></div>
        </div>
      ))}
    </>
  );
}
