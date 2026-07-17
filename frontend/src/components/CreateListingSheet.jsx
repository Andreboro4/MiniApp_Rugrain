import { useState } from 'react';
import { useStore } from '../store/useStore';
import { createListing } from '../api/listings';
import { CATS } from '../data/mock';
import Icon from './Icon';

const INCOTERMS = ['FCA', 'CPT', 'EXW'];
const CATEGORIES = CATS.filter((c) => c !== 'Все');

export default function CreateListingSheet({ onClose }) {
  const { requireOrgDetails, fetchListings, showToast } = useStore();

  const [dealType, setDealType] = useState('sell');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [volume, setVolume] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');
  const [shipAddress, setShipAddress] = useState('');
  const [incoterm, setIncoterm] = useState('FCA');
  const [quality, setQuality] = useState('');
  const [minParty, setMinParty] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!requireOrgDetails('создать объявление')) {
      onClose();
      return;
    }
    if (!title || !category || !volume || !price || !region || !shipAddress || !incoterm) {
      showToast('Заполните обязательные поля (отмечены *)');
      return;
    }

    setSubmitting(true);
    try {
      await createListing({
        title,
        category,
        dealType,
        volume: Number(volume),
        price: Number(price),
        region,
        shipAddress,
        incoterm,
        quality: quality || undefined,
        minParty: minParty || undefined,
        description: description || undefined,
      });
      showToast('Объявление создано и отправлено на модерацию');
      await fetchListings();
      onClose();
    } catch (e) {
      showToast(e?.response?.data?.error || 'Не удалось создать объявление — проверьте backend');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="overlay show" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Новое объявление</div>

        <div className="seg-row">
          <div className={`seg-opt ${dealType === 'sell' ? 'active' : ''}`} onClick={() => setDealType('sell')}>Продажа</div>
          <div className={`seg-opt ${dealType === 'buy' ? 'active' : ''}`} onClick={() => setDealType('buy')}>Закуп</div>
        </div>

        <div className="field">
          <label>Название *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Пшеница озимая 3 кл." />
        </div>
        <div className="field">
          <label>Категория *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Объём, т *</label>
          <input type="number" min="0" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="500" />
        </div>
        <div className="field">
          <label>Цена за т, ₽ *</label>
          <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="14200" />
        </div>
        <div className="field">
          <label>Регион *</label>
          <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Краснодарский край" />
        </div>
        <div className="field">
          <label>Адрес отгрузки *</label>
          <input value={shipAddress} onChange={(e) => setShipAddress(e.target.value)} placeholder="Элеватор №1, ст. Кущёвская" />
        </div>
        <div className="field">
          <label>Базис поставки *</label>
          <select value={incoterm} onChange={(e) => setIncoterm(e.target.value)}>
            {INCOTERMS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Показатели качества</label>
          <input value={quality} onChange={(e) => setQuality(e.target.value)} placeholder="Клейковина от 23%, влажность 12.5%" />
        </div>
        <div className="field">
          <label>Мин. партия</label>
          <input value={minParty} onChange={(e) => setMinParty(e.target.value)} placeholder="20 т" />
        </div>
        <div className="field">
          <label>Описание</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Дополнительные детали" />
        </div>

        <button className="btn btn-primary btn-block" disabled={submitting} onClick={handleSubmit}>
          <Icon name="check" /> {submitting ? 'Отправка…' : 'Создать объявление'}
        </button>
      </div>
    </div>
  );
}
