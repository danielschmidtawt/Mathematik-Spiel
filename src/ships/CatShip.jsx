const CatShip = ({ x, wiggle, style }) => (
  <div
    style={{
      position: "absolute",
      bottom: 70,
      left: x - 28,
      width: 56,
      height: 64,
      transition: "left 0.4s cubic-bezier(.34,1.56,.64,1)",
      filter: "drop-shadow(0 0 12px rgba(251,191,36,0.6))",
      zIndex: 10,
      animation: wiggle ? "none" : "hover 2s ease-in-out infinite",
      ...style,
    }}
  >
    <svg viewBox="0 0 56 64" width="56" height="64">
      <ellipse cx="28" cy="62" rx="8" ry="5" fill="#f97316" opacity="0.9">
        <animate attributeName="ry" values="5;8;5" dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="28" cy="61" rx="5" ry="3" fill="#facc15" opacity="0.9">
        <animate attributeName="ry" values="3;5;3" dur="0.25s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#fde8cd" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#catGrad)" />
      <ellipse cx="28" cy="34" rx="10" ry="12" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
      <ellipse cx="28" cy="30" rx="6" ry="6" fill="#fff7ed" />
      <ellipse cx="24.5" cy="28.5" rx="1.8" ry="1.2" fill="#1e1b4b" />
      <ellipse cx="31.5" cy="28.5" rx="1.8" ry="1.2" fill="#1e1b4b" />
      <polygon points="28,31 26.8,32.5 29.2,32.5" fill="#f9a8d4" />
      <path d="M25.5 33.5 Q27 32.5 28 33.5 Q29 32.5 30.5 33.5" stroke="#1e1b4b" strokeWidth="0.8" fill="none" />
      <line x1="17" y1="30" x2="23" y2="31" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="17" y1="32" x2="23" y2="32" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="17" y1="34" x2="23" y2="33" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="39" y1="30" x2="33" y2="31" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="39" y1="32" x2="33" y2="32" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="39" y1="34" x2="33" y2="33" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <polygon points="18,22 14,4 26,18" fill="#fde8cd" stroke="#e8c9a0" strokeWidth="1" />
      <polygon points="19,20 16,8 24,18" fill="#f9a8d4" opacity="0.5" />
      <polygon points="38,22 42,4 30,18" fill="#fde8cd" stroke="#e8c9a0" strokeWidth="1" />
      <polygon points="37,20 40,8 32,18" fill="#f9a8d4" opacity="0.5" />
      <path d="M10 42 Q2 38 6 30 L14 36Z" fill="#fbbf24" opacity="0.7" />
      <path d="M46 42 Q54 38 50 30 L42 36Z" fill="#fbbf24" opacity="0.7" />
      <defs>
        <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default CatShip;
