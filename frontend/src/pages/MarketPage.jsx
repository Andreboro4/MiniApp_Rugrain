import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CATS, fmt } from '../data/mock';
import Icon from '../components/Icon';
import { DealTag, RatingBadge } from '../components/Bits';
import CreateListingSheet from '../components/CreateListingSheet';

export default function MarketPage() {
  const navigate = useNavigate();
  const {
    filter, setFilter, dealFilter, setDealFilter, isFav, toggleFav,
    listings, listingsLoading, listingsError, fetchListings, requireAuth,
  } = useStore();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const filtered = listings.filter(
    (l) => (filter === 'Все' || l.cat === filter) && (dealFilter === 'all' || l.dealType === dealFilter)
  );

  return (
    <>
      <div className="chips-row">
        {CATS.map((c) => (
          <div key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</div>
        ))}
      </div>
      <div className="content">
        <div className="seg-row">
          <div className={`seg-opt ${dealFilter === 'all' ? 'active' : ''}`} onClick={() => setDealFilter('all')}>Все</div>
          <div className={`seg-opt ${dealFilter === 'sell' ? 'active' : ''}`} onClick={() => setDealFilter('sell')}>Продажа</div>
          <div className={`seg-opt ${dealFilter === 'buy' ? 'active' : ''}`} onClick={() => setDealFilter('buy')}>Закуп</div>
        </div>
        <div className="sec-title">Объявления · {filtered.length}</div>
        {listingsLoading && <div className="empty">Загрузка объявлений…</div>}
        {listingsError && <div className="empty">{listingsError}</div>}
        {!listingsLoading && !listingsError && filtered.length === 0 && <div className="empty">Ничего не найдено</div>}
        {filtered.map((l) => {
          const fav = isFav(l.id, 'listing');
          const isBuy = l.dealType === 'buy';
          return (
            <div key={l.id} className="card" onClick={() => navigate(`/market/${l.id}`)}>
              <div className="card-top">
                <div>
                  <div className="card-tags"><DealTag dealType={l.dealType} /><span className="tag cat">{l.cat}</span></div>
                  <div className="card-title">{l.title}</div>
                </div>
                <div className={`heart ${fav ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleFav(l.id, 'listing'); }}>
                  <Icon name="heart" filled={fav} />
                </div>
              </div>
              <div className="card-meta"><div>Объём: <b>{l.vol}</b></div><div>{l.region}</div><div>{l.incoterm}</div></div>
              <div className="card-price">{fmt(l.price)} ₽<span> / {l.unit}{isBuy ? ' (закуп)' : ''}</span></div>
              <div className="card-bottom">
                <div className="seller">
                  <div className="avatar">{l.seller[0]}</div>
                  <div>
                    {l.seller}{l.verified && <span className="verified-badge"><Icon name="check" /></span>}
                    <br /><RatingBadge rating={l.rating} count={l.ratingCount} />
                  </div>
                </div>
                <button className="btn btn-gold btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/market/${l.id}`); }}>
                  {isBuy ? 'Откликнуться' : 'Купить'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="fab" onClick={() => { if (requireAuth('создать объявление')) setCreateOpen(true); }}>
        <Icon name="plus" />
      </button>
      {createOpen && <CreateListingSheet onClose={() => setCreateOpen(false)} />}
    </>
  );
}
