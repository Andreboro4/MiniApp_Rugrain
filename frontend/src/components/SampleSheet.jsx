import { useState } from 'react';
import { useStore } from '../store/useStore';
import Icon from './Icon';

export default function SampleSheet({ item, onClose }) {
  const submitSample = useStore((s) => s.submitSample);
  const isViaRugrain = !!item.sampleViaRugrain;
  const [qty, setQty] = useState('0.5');
  const [method, setMethod] = useState(isViaRugrain ? 'Передача через Ругрейн (бесплатно)' : 'Курьером');
  const [addr, setAddr] = useState('');

  const isFree = method === 'Передача через Ругрейн (бесплатно)' || method === 'Самовывоз со склада продавца';

  function handleSubmit() {
    if (!isFree && !addr) {
      useStore.getState().showToast('Укажите адрес доставки');
      return;
    }
    submitSample({ listing: item.title, seller: item.seller, qty, method, addr, isFree });
    onClose();
  }

  return (
    <div className="overlay show" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Заказать пробу</div>
        <div className="sheet-sub">{item.title}</div>
        {item.samplePickupAddress && (
          <div className="sample-note"><Icon name="truck" /><span>Забрать пробу можно по адресу: {item.samplePickupAddress}</span></div>
        )}
        <div className="field">
          <label>Количество, кг</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
        <div className="field">
          <label>Способ получения</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {isViaRugrain && <option>Передача через Ругрейн (бесплатно)</option>}
            <option>Курьером</option>
            <option>Самовывоз со склада продавца</option>
          </select>
        </div>
        {!isFree && (
          <div className="field">
            <label>Адрес доставки</label>
            <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Город, улица, дом" />
          </div>
        )}
        <button className="btn btn-primary btn-block" onClick={handleSubmit}><Icon name="vial" /> Отправить заявку</button>
      </div>
    </div>
  );
}
