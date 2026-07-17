import { useStore } from '../store/useStore';
import Icon from '../components/Icon';

const STATUS_MAP = {
  new: ['gold', 'Новая'],
  approved: ['green', 'Одобрена'],
  rejected: ['red', 'Отклонена'],
};

export default function RequestsPage() {
  const {
    incoming, outgoing, outgoingBids, reqSub, setReqSub,
    approveRequest, rejectRequest, showDeal, openDeal, closeDealSheet,
  } = useStore();

  const newCount = incoming.filter((r) => r.status === 'new').length;
  const outgoingCombined = [...outgoing, ...outgoingBids];
  const list = reqSub === 'incoming' ? incoming : outgoingCombined;

  return (
    <>
      <div className="content" style={{ paddingTop: 12 }}>
        <div className="seg-row">
          <div className={`seg-opt ${reqSub === 'incoming' ? 'active' : ''}`} onClick={() => setReqSub('incoming')}>
            Входящие{newCount > 0 && <span className="dot" />}
          </div>
          <div className={`seg-opt ${reqSub === 'outgoing' ? 'active' : ''}`} onClick={() => setReqSub('outgoing')}>Исходящие</div>
        </div>

        {list.length === 0 && <div className="empty">Пока нет заявок и ставок</div>}

        {list.map((r) => {
          const [cls, label] = STATUS_MAP[r.status];
          const who = reqSub === 'incoming' ? r.buyer : r.seller;
          const isBid = r.type === 'bid';
          const typeLabel = isBid ? 'Ставка' : r.type === 'sample' ? 'Заявка на пробу' : 'Предложение цены';
          const typeIcon = isBid ? 'gavel' : r.type === 'sample' ? 'vial' : 'gavel';

          return (
            <div className="inbox-card" key={r.id}>
              <div className="inbox-top">
                <div className="inbox-type"><Icon name={typeIcon} /> {typeLabel}</div>
                <span className={`pill ${cls}`}>{label}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 2 }}>{who}</div>
              <div className="inbox-detail">
                {r.listing ? `${r.listing} — ${r.detail}` : r.detail}
                <br /><span style={{ fontSize: 10 }}>{r.date}</span>
              </div>

              {reqSub === 'incoming' && r.status === 'new' && (
                <div className="btn-row">
                  <button className="btn btn-primary btn-sm" onClick={() => approveRequest(r.id)}>Одобрить</button>
                  <button className="btn btn-ghost btn-sm" style={{ background: 'var(--red-pale)', color: '#B91C1C' }} onClick={() => rejectRequest(r.id)}>Отклонить</button>
                </div>
              )}

              {reqSub === 'incoming' && r.status === 'approved' && r.type === 'sample' && (
                <div style={{ background: 'var(--blue-pale)', border: '1px solid var(--blue)', borderRadius: 8, padding: 8, margin: '8px 0', fontSize: 11 }}>
                  <strong>📍 Адрес доставки:</strong> {r.address || 'Уточняется'}<br />
                  <strong>🚚 Способ:</strong> {r.method || 'Не указан'}
                </div>
              )}

              {reqSub === 'incoming' && r.status === 'approved' && (r.type === 'offer' || isBid) && (
                <button className="btn btn-outline btn-sm btn-block" onClick={() => showDeal(r.id)}><Icon name="file" /> Реквизиты организации</button>
              )}

              {reqSub === 'outgoing' && (
                <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>{r.status === 'approved' ? 'Одобрено' : 'Ожидает решения'}</div>
              )}
            </div>
          );
        })}
      </div>

      {openDeal && (
        <div className="overlay show" onClick={closeDealSheet}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">Реквизиты контрагента</div>
            <div className="sheet-sub">{openDeal.name}</div>
            <div className="deal-grid">
              <div>ИНН<b>{openDeal.inn}</b></div>
              <div>ОГРН<b>{openDeal.ogrn}</b></div>
              <div className="wide">Адрес<b>{openDeal.addr}</b></div>
              <div>Телефон<b>{openDeal.phone}</b></div>
              <div>Email<b>{openDeal.email}</b></div>
              <div>Банк<b>{openDeal.bank}</b></div>
              <div>Р/с<b>{openDeal.rs}</b></div>
              <div>БИК<b>{openDeal.bik}</b></div>
              <div>К/с<b>{openDeal.ks}</b></div>
            </div>
            <button className="btn btn-primary btn-block" onClick={closeDealSheet}>Закрыть</button>
          </div>
        </div>
      )}
    </>
  );
}
