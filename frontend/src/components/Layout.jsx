import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Icon from './Icon';
import LoginPage from '../pages/LoginPage';

const TABS = [
  { id: 'market', label: 'Биржа', icon: 'store' },
  { id: 'auctions', label: 'Аукцион', icon: 'gavel' },
  { id: 'requests', label: 'Заявки', icon: 'inbox' },
  { id: 'cabinet', label: 'Кабинет', icon: 'user' },
];

function activeTabFromPath(pathname) {
  if (pathname.startsWith('/auctions')) return 'auctions';
  if (pathname.startsWith('/requests')) return 'requests';
  if (pathname.startsWith('/cabinet')) return 'cabinet';
  return 'market';
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loggedIn, guest, logout, hasOrgDetails,
    toast, pendingRating, submitRating, skipRating,
    incoming, dealsTotal, authLoading, restoreSession,
  } = useStore();

  useEffect(() => {
    restoreSession();
  }, []);

  const isDetail = /^\/(market|auctions)\/[^/]+$/.test(location.pathname);
  const activeTab = activeTabFromPath(location.pathname);
  const newCount = incoming.filter((r) => r.status === 'new').length;
  const orgWarning = loggedIn && !guest && !hasOrgDetails();

  return (
    <div className="app-shell">
      <div className="screen">
        <div className="max-chrome">
          <Icon name="back" className="icon-btn" />
          <div className="dot" />
          <div className="title">Ругрейн<span>мини-приложение · MAX</span></div>
          <svg className="icon-btn" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" />
          </svg>
        </div>

        {!loggedIn ? (
          authLoading ? (
            <div className="content"><div className="empty">Загрузка…</div></div>
          ) : (
            <LoginPage />
          )
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
            {!isDetail && (
              <>
                {orgWarning && (
                  <div
                    style={{ background: 'var(--red-pale)', borderBottom: '1px solid var(--red)', padding: '6px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10.5, color: '#B91C1C', fontWeight: 600, flexShrink: 0, cursor: 'pointer' }}
                    onClick={() => navigate('/cabinet?sub=orgdetails')}
                  >
                    <span>⚠️ Укажите реквизиты организации для торговли</span>
                    <span style={{ textDecoration: 'underline' }}>Заполнить →</span>
                  </div>
                )}
                <div className="app-header">
                  <div className="row1">
                    <div className="brand">
                      <span style={{ width: 20, height: 20, borderRadius: 6, background: '#fff', color: 'var(--green-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>Р</span>
                      Ругрейн
                    </div>
                    <div className="deals-pill" onClick={() => navigate('/cabinet?sub=profile')}>
                      <Icon name="check" /> Сделок: {dealsTotal}{dealsTotal >= 2 ? ' · комис. 0,5%' : ''}
                    </div>
                  </div>
                  <div className="tab-strip">
                    {TABS.map((t) => (
                      <div key={t.id} className={`t ${activeTab === t.id ? 'active' : ''}`} onClick={() => navigate(`/${t.id}`)}>
                        {t.label}
                      </div>
                    ))}
                  </div>
                </div>
                {guest && (
                  <div className="guest-banner">
                    <Icon name="guest" /> Режим гостя — только просмотр
                    <button onClick={logout}>Войти через MAX</button>
                  </div>
                )}
              </>
            )}

            <Outlet />

            {!isDetail && (
              <div className="bottom-nav">
                {TABS.map((t) => (
                  <div key={t.id} className={`nav-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => navigate(`/${t.id}`)} style={{ position: 'relative' }}>
                    <Icon name={t.icon} />
                    {t.id === 'requests' && newCount > 0 && (
                      <span style={{ position: 'absolute', top: 0, right: '22%', width: 7, height: 7, borderRadius: '50%', background: 'var(--red)' }} />
                    )}
                    <div>{t.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>

        {pendingRating && (
          <div className="overlay show">
            <div className="sheet">
              <div className="sheet-handle" />
              <div className="sheet-title">Оцените контрагента</div>
              <div className="sheet-sub">Сделка с «{pendingRating.counterparty}» завершена. Поставьте оценку — это поможет другим фермерам.</div>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((n) => (
                  <svg key={n} className="star-btn on" onClick={() => submitRating(n)} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
                  </svg>
                ))}
              </div>
              <button className="btn btn-ghost btn-block" onClick={skipRating}>Пропустить</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
