import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fmt } from '../data/mock';
import Icon from '../components/Icon';
import { DealTag, RatingBadge } from '../components/Bits';
import Timer from '../components/Timer';

export default function AuctionPage() {
  const navigate = useNavigate();
  const { auctions, dealFilter, setDealFilter } = useStore();
  const filtered = auctions.filter((a) => dealFilter === 'all' || a.dealType === dealFilter);

  return (
    <>
      <div className="content" style={{ paddingTop: 12 }}>
        <div className="seg-row">
          <div className={`seg-opt ${dealFilter === 'all' ? 'active' : ''}`} onClick={() => setDealFilter('all')}>Все</div>
          <div className={`seg-opt ${dealFilter === 'sell' ? 'active' : ''}`} onClick={() => setDealFilter('sell')}>Продажа ↑</div>
          <div className={`seg-opt ${dealFilter === 'buy' ? 'active' : ''}`} onClick={() => setDealFilter('buy')}>Закуп ↓</div>
        </div>
        <div className="sec-title">Активные аукционы · {filtered.length}</div>
        {filtered.length === 0 && <div className="empty">Ничего не найдено</div>}
        {filtered.map((a) => {
          const isBuy = a.dealType === 'buy';
          return (
            <div key={a.id} className={`card auc-card ${isBuy ? 'buy' : ''}`} onClick={() => navigate(`/auctions/${a.id}`)}>
              <div className="card-top">
                <div>
                  <div className="card-tags">
                    <DealTag dealType={a.dealType} /><span className="tag cat">{a.cat}</span>
                    <span className="tag" style={{ background: isBuy ? 'var(--blue-pale)' : 'var(--gold-pale)', color: isBuy ? 'var(--blue-deep)' : 'var(--gold-deep)', fontSize: 8, padding: '1px 5px' }}>
                      <Icon name={isBuy ? 'down' : 'up'} /> {isBuy ? '↓ закуп' : '↑ продажа'}
                    </span>
                  </div>
                  <div className="card-title">{a.title}</div>
                </div>
                <Timer endsAt={a.endsAt} />
              </div>
              <div className="card-meta"><div>Объём: <b>{a.vol}</b></div><div>{a.region}</div></div>
              <div className="auc-bid-row">
                <div>
                  <div className="lbl">{isBuy ? 'Текущая лучшая цена' : 'Текущая ставка'}</div>
                  <div className="val">{fmt(a.current)} ₽</div>
                  <div style={{ marginTop: 3 }}><RatingBadge rating={a.rating} count={a.ratingCount} /></div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/auctions/${a.id}`); }}>
                  <Icon name="gavel" /> Ставка
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="fab" onClick={() => useStore.getState().showToast('Форма создания лота скоро будет доступна')}>
        <Icon name="plus" />
      </button>
    </>
  );
}
