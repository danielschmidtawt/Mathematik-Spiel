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
      {/* Engine flame */}
      <ellipse cx="28" cy="62" rx="8" ry="5" fill="#f97316" opacity="0.9">
        <animate attributeName="ry" values="5;8;5" dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="28" cy="61" rx="5" ry="3" fill="#facc15" opacity="0.9">
        <animate attributeName="ry" values="3;5;3" dur="0.25s" repeatCount="indefinite" />
      </ellipse>
      {/* Body – round & warm */}
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#fde8cd" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#catGrad)" />
      {/* Belly highlight */}
      <ellipse cx="28" cy="46" rx="10" ry="10" fill="#fff7ed" opacity="0.3" />
      {/* Face window – bigger */}
      <ellipse cx="28" cy="33" rx="12" ry="13" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1.5" />
      {/* Face – round & cute */}
      <ellipse cx="28" cy="30" rx="8" ry="7.5" fill="#fff7ed" />
      {/* Big cat eyes with vertical pupils */}
      <ellipse cx="24" cy="28" rx="2.5" ry="2.8" fill="#65a30d" />
      <ellipse cx="32" cy="28" rx="2.5" ry="2.8" fill="#65a30d" />
      <ellipse cx="24" cy="28" rx="1" ry="2.2" fill="#1e1b4b" />
      <ellipse cx="32" cy="28" rx="1" ry="2.2" fill="#1e1b4b" />
      <circle cx="24.8" cy="27" r="0.8" fill="#fff" />
      <circle cx="32.8" cy="27" r="0.8" fill="#fff" />
      {/* Rosy cheeks */}
      <ellipse cx="21" cy="31.5" rx="2" ry="1.2" fill="#fca5a5" opacity="0.4" />
      <ellipse cx="35" cy="31.5" rx="2" ry="1.2" fill="#fca5a5" opacity="0.4" />
      {/* Small triangle nose */}
      <polygon points="28,31 26.8,32.2 29.2,32.2" fill="#f9a8d4" />
      {/* Happy cat mouth – "w" shape */}
      <path d="M25.5 33.5 Q27 32.5 28 33.5 Q29 32.5 30.5 33.5" stroke="#92400e" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* Cute whiskers */}
      <line x1="17" y1="30.5" x2="22" y2="31.5" stroke="#d4a574" strokeWidth="0.5" opacity="0.5" strokeLinecap="round" />
      <line x1="17" y1="33" x2="22" y2="32.5" stroke="#d4a574" strokeWidth="0.5" opacity="0.5" strokeLinecap="round" />
      <line x1="39" y1="30.5" x2="34" y2="31.5" stroke="#d4a574" strokeWidth="0.5" opacity="0.5" strokeLinecap="round" />
      <line x1="39" y1="33" x2="34" y2="32.5" stroke="#d4a574" strokeWidth="0.5" opacity="0.5" strokeLinecap="round" />
      {/* Pointy cat ears – rounder tips */}
      <path d="M18,22 Q14,6 13,4 Q16,10 26,18Z" fill="#fde8cd" stroke="#e8c9a0" strokeWidth="1" />
      <path d="M19,20 Q16,10 15,7 Q17,12 24,18Z" fill="#f9a8d4" opacity="0.4" />
      <path d="M38,22 Q42,6 43,4 Q40,10 30,18Z" fill="#fde8cd" stroke="#e8c9a0" strokeWidth="1" />
      <path d="M37,20 Q40,10 41,7 Q39,12 32,18Z" fill="#f9a8d4" opacity="0.4" />
      {/* Wings – rounded */}
      <path d="M10 42 Q3 38 6 30 Q8 28 14 36Z" fill="#fbbf24" opacity="0.5" />
      <path d="M46 42 Q53 38 50 30 Q48 28 42 36Z" fill="#fbbf24" opacity="0.5" />
      <defs>
        <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default CatShip;
