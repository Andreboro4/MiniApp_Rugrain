const PATHS = {
  back: <path d="M15 18l-6-6 6-6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  gavel: <><path d="M14 4l6 6-3 3-6-6z" /><path d="M2 21l7-7" /><path d="M9.5 8.5l6 6" /></>,
  store: <><path d="M4 9l1-5h14l1 5" /><path d="M4 9h16v10a1 1 0 01-1 1H5a1 1 0 01-1-1V9z" /><path d="M9 20v-6h6v6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>,
  shield: <><path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  boxes: <><rect x="3" y="10" width="7" height="7" /><rect x="14" y="10" width="7" height="7" /><rect x="8.5" y="3" width="7" height="7" /></>,
  heart: <path d="M12 20s-7-4.3-9.3-8.6C1 8 2.4 4.8 5.6 4.1c2-.4 3.8.5 4.9 2.1 1.1-1.6 2.9-2.5 4.9-2.1 3.2.7 4.6 3.9 2.9 7.3C19 15.7 12 20 12 20z" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  inbox: <><path d="M3 12h4l2 3h6l2-3h4" /><path d="M5.4 5h13.2L21 12v6a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18v-6z" /></>,
  docs: <><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><path d="M9 13h6M9 17h6M9 9h2" /></>,
  id: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="12" r="2" /><path d="M6 16.5c.5-1.5 1.8-2 2.5-2s2 .5 2.5 2" /><path d="M14 10h5M14 13h5" /></>,
  cam: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7l1.5-3h5L16 7" /><circle cx="12" cy="13.5" r="3.5" /></>,
  vial: <><path d="M9 2h6M10 2v6.5l-4.5 8A3 3 0 008.1 21h7.8a3 3 0 002.6-4.5l-4.5-8V2" /><path d="M8 16h8" /></>,
  star: <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />,
  guest: <><circle cx="12" cy="8" r="4" strokeDasharray="2 2" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeDasharray="2 2" /></>,
  chat: <path d="M4 4h16v12H8l-4 4z" />,
  fns: <path d="M12 3l8 4v5c0 5.2-3.4 8.7-8 10-4.6-1.3-8-4.8-8-10V7z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  truck: <><rect x="1" y="7" width="13" height="9" rx="1" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="5.5" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  down: <path d="M12 5v14M5 12l7 7 7-7" />,
  up: <path d="M12 19V5M5 12l7-7 7 7" />,
  building: <><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /></>,
  file: <><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><path d="M9 13h6M9 17h6" /></>,
};

export default function Icon({ name, filled = false, style, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
