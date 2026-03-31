const DogShip = ({ x, wiggle, style }) => (
  <div
    style={{
      position: "absolute",
      bottom: 70,
      left: x - 28,
      width: 56,
      height: 64,
      transition: "left 0.4s cubic-bezier(.34,1.56,.64,1)",
      filter: "drop-shadow(0 0 12px rgba(217,119,6,0.6))",
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
      {/* Body – round & warm brown */}
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#f0d4a8" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#dogGrad)" />
      {/* Belly highlight */}
      <ellipse cx="28" cy="46" rx="10" ry="10" fill="#fef3e2" opacity="0.35" />
      {/* Face window – bigger */}
      <ellipse cx="28" cy="33" rx="12" ry="13" fill="#1e1b4b" stroke="#d97706" strokeWidth="1.5" />
      {/* Face – round & chubby */}
      <ellipse cx="28" cy="30" rx="8" ry="7.5" fill="#fef3e2" />
      {/* Muzzle bump */}
      <ellipse cx="28" cy="32" rx="4" ry="3" fill="#fef3e2" opacity="0.5" />
      {/* Big happy eyes with shine */}
      <circle cx="24" cy="27.5" r="2.8" fill="#5c3317" />
      <circle cx="32" cy="27.5" r="2.8" fill="#5c3317" />
      <circle cx="25" cy="26.5" r="1.1" fill="#fff" />
      <circle cx="33" cy="26.5" r="1.1" fill="#fff" />
      <circle cx="23.3" cy="28" r="0.5" fill="#fff" opacity="0.5" />
      <circle cx="31.3" cy="28" r="0.5" fill="#fff" opacity="0.5" />
      {/* Rosy cheeks */}
      <ellipse cx="21" cy="31" rx="2" ry="1.2" fill="#fca5a5" opacity="0.4" />
      <ellipse cx="35" cy="31" rx="2" ry="1.2" fill="#fca5a5" opacity="0.4" />
      {/* Big round nose */}
      <ellipse cx="28" cy="31.5" rx="2" ry="1.5" fill="#4a2c17" />
      <ellipse cx="28.5" cy="31" rx="0.7" ry="0.5" fill="#fff" opacity="0.3" />
      {/* Big happy smile with tongue */}
      <path d="M24 33.5 Q28 37.5 32 33.5" stroke="#4a2c17" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <ellipse cx="28" cy="35.5" rx="2" ry="1.3" fill="#f87171" />
      {/* Floppy ears – big & round */}
      <ellipse cx="16" cy="21" rx="7" ry="11" fill="#d4a574" stroke="#c08850" strokeWidth="1" transform="rotate(-12 16 21)" />
      <ellipse cx="16" cy="20" rx="4.5" ry="7.5" fill="#e8c9a0" opacity="0.5" transform="rotate(-12 16 20)" />
      <ellipse cx="40" cy="21" rx="7" ry="11" fill="#d4a574" stroke="#c08850" strokeWidth="1" transform="rotate(12 40 21)" />
      <ellipse cx="40" cy="20" rx="4.5" ry="7.5" fill="#e8c9a0" opacity="0.5" transform="rotate(12 40 20)" />
      {/* Wings – rounded */}
      <path d="M10 42 Q3 38 6 30 Q8 28 14 36Z" fill="#d97706" opacity="0.5" />
      <path d="M46 42 Q53 38 50 30 Q48 28 42 36Z" fill="#d97706" opacity="0.5" />
      <defs>
        <linearGradient id="dogGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default DogShip;
