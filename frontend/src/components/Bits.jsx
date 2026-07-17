import Icon from './Icon';

export function DealTag({ dealType }) {
  return dealType === 'buy'
    ? <span className="tag buy">Закуп</span>
    : <span className="tag sell">Продажа</span>;
}

export function RatingBadge({ rating, count }) {
  return (
    <span className="rating-badge">
      <Icon name="star" filled /> {rating.toFixed(1)} <span style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>({count})</span>
    </span>
  );
}
