const BunnyShip = ({ x, wiggle, style }) => (
  <div
    style={{
      position: "absolute",
      bottom: 70,
      left: x - 28,
      width: 56,
      height: 64,
      transition: "left 0.4s cubic-bezier(.34,1.56,.64,1)",
      filter: "drop-shadow(0 0 12px rgba(168,130,255,0.6))",
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
      {/* Body – round & soft */}
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#e8dff8" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#bunnyGrad)" />
      {/* Belly highlight */}
      <ellipse cx="28" cy="46" rx="10" ry="10" fill="#f5f0ff" opacity="0.3" />
      {/* Face window – bigger */}
      <ellipse cx="28" cy="33" rx="12" ry="13" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" />
      {/* Face – round & chubby */}
      <ellipse cx="28" cy="30" rx="8" ry="7.5" fill="#f5f0ff" />
      {/* Big eyes with shine */}
      <circle cx="24" cy="28" r="2.5" fill="#4c1d95" />
      <circle cx="32" cy="28" r="2.5" fill="#4c1d95" />
      <circle cx="24.8" cy="27" r="1" fill="#fff" />
      <circle cx="32.8" cy="27" r="1" fill="#fff" />
      <circle cx="23.5" cy="28.5" r="0.5" fill="#fff" opacity="0.6" />
      <circle cx="31.5" cy="28.5" r="0.5" fill="#fff" opacity="0.6" />
      {/* Rosy cheeks */}
      <ellipse cx="21.5" cy="31" rx="2" ry="1.2" fill="#f9a8d4" opacity="0.5" />
      <ellipse cx="34.5" cy="31" rx="2" ry="1.2" fill="#f9a8d4" opacity="0.5" />
      {/* Cute nose */}
      <ellipse cx="28" cy="31" rx="1.5" ry="1" fill="#f9a8d4" />
      {/* Happy smile */}
      <path d="M25 33 Q28 36 31 33" stroke="#4c1d95" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* Buck teeth */}
      <rect x="26.5" y="33" width="3" height="2" rx="0.5" fill="#fff" opacity="0.8" />
      {/* Long bunny ears */}
      <ellipse cx="21" cy="12" rx="5.5" ry="13" fill="#e8dff8" stroke="#c4b5fd" strokeWidth="1" />
      <ellipse cx="21" cy="10" rx="3" ry="9" fill="#f9a8d4" opacity="0.4" />
      <ellipse cx="35" cy="12" rx="5.5" ry="13" fill="#e8dff8" stroke="#c4b5fd" strokeWidth="1" />
      <ellipse cx="35" cy="10" rx="3" ry="9" fill="#f9a8d4" opacity="0.4" />
      {/* Wings – rounded */}
      <path d="M10 42 Q3 38 6 30 Q8 28 14 36Z" fill="#c4b5fd" opacity="0.6" />
      <path d="M46 42 Q53 38 50 30 Q48 28 42 36Z" fill="#c4b5fd" opacity="0.6" />
      <defs>
        <linearGradient id="bunnyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default BunnyShip;
