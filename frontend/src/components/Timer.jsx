import { useEffect, useState } from 'react';
import { fmtTime } from '../data/mock';
import Icon from './Icon';

export default function Timer({ endsAt, detail = false }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="timer" style={detail ? { width: 'fit-content', marginBottom: 10 } : undefined}>
      <Icon name="clock" /> {detail ? 'До конца: ' : ''}{fmtTime(endsAt - Date.now())}
    </div>
  );
}
