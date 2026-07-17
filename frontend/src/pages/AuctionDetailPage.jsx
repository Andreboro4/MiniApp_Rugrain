import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fmt } from '../data/mock';
import Icon from '../components/Icon';
import { DealTag, RatingBadge } from '../components/Bits';
import Timer from '../components/Timer';
import SampleSheet from '../components/SampleSheet';

export default function AuctionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auctions, placeBid, bidError } = useStore();
  const [bidValue, setBidValue] = useState('');
  const [sampleOpen, setSampleOpen] = useState(false);

  const a = auctions.find((x) => x.id === Number(id));
  if (!a) return <div className="content"><div className="empty">Лот не найден</div></div>;

  const isBuy = a.dealType === 'buy';
  const suggested = isBuy ? a.current - a.step : a.current + a.step;

  function handleBid() {
    const amt = parseInt(bidValue, 10) || suggested;
    const err = bidError(a.id, amt);
    if (err) {
      useStore.getState().showToast(err);
      return;
    }
    placeBid(a.id, amt);
    setBidValue('');
  }

  return (
    <>
      <div className="back-row" onClick={() => navigate('/auctions')}><Icon name="back" /> Назад к аукционам</div>
      <div className="content" style={{ paddingTop: 10 }}>
        <div className="detail-hero">
          <span style={{ fontSize: 34, fontWeight: 800, color: '#fff', opacity: 0.92, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Р</span>
        </div>
        <div className="card-tags">
          <DealTag dealType={a.dealType} /><span className="tag cat">{a.cat}</span>
          <span className="tag" style={{ background: isBuy ? 'var(--blue-pale)' : 'var(--gold-pale)', color: isBuy ? 'var(--blue-deep)' : 'var(--gold-deep)', fontSize: 8, padding: '1px 5px' }}>
            <Icon name={isBuy ? 'down' : 'up'} /> {isBuy ? '↓ закуп' : '↑ продажа'}
          </span>
        </div>
        <div className="detail-title">{a.title}</div>
        <Timer endsAt={a.endsAt} detail />
        <div className="info-grid">
          <div className="info-cell"><div className="lbl">{isBuy ? 'Текущая лучшая цена' : 'Текущая ставка'}</div><div className="val">{fmt(a.current)} ₽</div></div>
          <div className="info-cell"><div className="lbl">Шаг ставки</div><div className="val">{fmt(a.step)} ₽</div></div>
          <div className="info-cell"><div className="lbl">Базис поставки</div><div className="val">{a.incoterm}</div></div>
          <div className="info-cell"><div className="lbl">Адрес</div><div className="val" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>{a.shipAddress}</div></div>
          <div className="info-cell wide"><div className="lbl">Показатели качества{isBuy ? ' / требования' : ''}</div><div className="val" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>{a.quality}</div></div>
        </div>
        <div className="seller-row">
          <div className="avatar">{a.seller[0]}</div>
          <div style={{ flex: 1 }}>
            <div className="name">{a.seller}{a.verified && <> <Icon name="check" /></>}</div>
            <div style={{ marginTop: 2 }}><RatingBadge rating={a.rating} count={a.ratingCount} /></div>
          </div>
        </div>
        <div className="sec-title">История ставок</div>
        <div className="bid-history">
          {a.bids.slice(0, 5).map((b, i) => (
            <div className="hrow" key={i}><div>{b.who}</div><b>{fmt(b.amt)} ₽ · {b.t}</b></div>
          ))}
        </div>
        <div className="bid-input-row">
          <input type="number" placeholder={fmt(suggested)} value={bidValue} onChange={(e) => setBidValue(e.target.value)} />
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={handleBid}><Icon name="gavel" /> Сделать ставку</button>
          {a.sampleAvailable && (
            <button className="btn btn-outline" onClick={() => setSampleOpen(true)}><Icon name="vial" /> Заказать пробу</button>
          )}
        </div>
        <div className="free-note">
          {isBuy ? 'Аукцион на понижение: побеждает участник с самой низкой ценой к моменту закрытия.' : 'Аукцион на повышение: побеждает участник с самой высокой ставкой к моменту закрытия.'}
        </div>
      </div>
      {sampleOpen && <SampleSheet item={a} onClose={() => setSampleOpen(false)} />}
    </>
  );
}
