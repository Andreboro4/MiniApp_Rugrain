import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fmt } from '../data/mock';
import { fetchListingById } from '../api/listings';
import Icon from '../components/Icon';
import { DealTag, RatingBadge } from '../components/Bits';
import SampleSheet from '../components/SampleSheet';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const buyListing = useStore((s) => s.buyListing);
  const storeListings = useStore((s) => s.listings);
  const [sampleOpen, setSampleOpen] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Если уже загружено на странице биржи — не делаем лишний запрос.
    const found = storeListings.find((x) => String(x.id) === id);
    if (found) {
      setListing(found);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    fetchListingById(id)
      .then((data) => { if (alive) setListing(data); })
      .catch(() => { if (alive) setListing(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, storeListings]);

  if (loading) return <div className="content"><div className="empty">Загрузка…</div></div>;

  const l = listing;
  if (!l) return <div className="content"><div className="empty">Объявление не найдено</div></div>;

  const isBuy = l.dealType === 'buy';

  return (
    <>
      <div className="back-row" onClick={() => navigate('/market')}><Icon name="back" /> Назад к бирже</div>
      <div className="content" style={{ paddingTop: 10 }}>
        <div className="detail-hero">
          <span style={{ fontSize: 34, fontWeight: 800, color: '#fff', opacity: 0.92, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Р</span>
        </div>
        <div className="card-tags"><DealTag dealType={l.dealType} /><span className="tag cat">{l.cat}</span></div>
        <div className="detail-title">{l.title}</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 21, fontWeight: 800, marginBottom: 12 }}>
          {fmt(l.price)} ₽ <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-soft)', fontFamily: "'Inter',sans-serif" }}>за {l.unit} · {l.region}</span>
        </div>
        <div className="info-grid">
          <div className="info-cell"><div className="lbl">Объём партии</div><div className="val">{l.vol}</div></div>
          <div className="info-cell"><div className="lbl">Мин. партия</div><div className="val">{l.minParty}</div></div>
          <div className="info-cell"><div className="lbl">Базис поставки</div><div className="val">{l.incoterm}</div></div>
          <div className="info-cell"><div className="lbl">Адрес отгрузки</div><div className="val" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>{l.shipAddress}</div></div>
          <div className="info-cell wide"><div className="lbl">Показатели качества</div><div className="val" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>{l.quality}</div></div>
        </div>
        <div className="desc">{l.desc}</div>
        <div className="seller-row">
          <div className="avatar">{l.seller[0]}</div>
          <div style={{ flex: 1 }}>
            <div className="name">{l.seller}{l.verified && <span className="verified-badge"> <Icon name="check" /> верифицирован</span>}</div>
            <div style={{ marginTop: 2 }}><RatingBadge rating={l.rating} count={l.ratingCount} /></div>
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-gold" onClick={() => buyListing(l)}><Icon name="check" /> {isBuy ? 'Откликнуться' : 'Купить'}</button>
          {l.sampleAvailable && (
            <button className="btn btn-outline" onClick={() => setSampleOpen(true)}><Icon name="vial" /> Заказать пробу</button>
          )}
        </div>
      </div>
      {sampleOpen && <SampleSheet item={l} onClose={() => setSampleOpen(false)} />}
    </>
  );
}
