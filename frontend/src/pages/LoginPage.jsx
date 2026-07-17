import { useStore } from '../store/useStore';
import Icon from '../components/Icon';

export default function LoginPage() {
  const { loginMax, loginGuest } = useStore();
  return (
    <div className="login-wrap">
      <div style={{ width: 64, height: 64, marginBottom: 14, borderRadius: 18, background: 'linear-gradient(135deg,var(--green) 0%,var(--green-deep) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800 }}>Р</div>
      <h2>Добро пожаловать в Ругрейн</h2>
      <p>Аграрная биржа внутри MAX. Войдите через свой аккаунт MAX, чтобы покупать, продавать, закупать и участвовать в аукционах.</p>
      <div className="login-actions">
        <button className="btn btn-primary btn-block" onClick={loginMax}><Icon name="chat" /> Войти через MAX</button>
      </div>
      <button className="guest-link" onClick={loginGuest}>Продолжить как гость →</button>
    </div>
  );
}
