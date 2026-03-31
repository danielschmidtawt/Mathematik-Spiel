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
      {/* Body */}
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#e8c9a0" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#dogGrad)" />
      {/* Face window */}
      <ellipse cx="28" cy="34" rx="10" ry="12" fill="#1e1b4b" stroke="#d97706" strokeWidth="1.5" />
      {/* Face */}
      <ellipse cx="28" cy="30" rx="6" ry="6" fill="#fef3e2" />
      {/* Eyes – round, friendly */}
      <circle cx="25" cy="28.5" r="1.8" fill="#1e1b4b" />
      <circle cx="31" cy="28.5" r="1.8" fill="#1e1b4b" />
      {/* Eye shine */}
      <circle cx="25.8" cy="27.8" r="0.6" fill="#fff" />
      <circle cx="31.8" cy="27.8" r="0.6" fill="#fff" />
      {/* Nose – round black */}
      <circle cx="28" cy="31.5" r="1.5" fill="#1e1b4b" />
      {/* Mouth – open happy with tongue */}
      <path d="M25 33 Q28 36 31 33" stroke="#1e1b4b" strokeWidth="0.8" fill="none" />
      <ellipse cx="28" cy="34.5" rx="1.5" ry="1" fill="#f87171" />
      {/* Ears – floppy, hanging down */}
      <ellipse cx="17" cy="20" rx="6" ry="10" fill="#c8a070" stroke="#b08050" strokeWidth="1" transform="rotate(-15 17 20)" />
      <ellipse cx="17" cy="19" rx="4" ry="7" fill="#deb887" opacity="0.5" transform="rotate(-15 17 19)" />
      <ellipse cx="39" cy="20" rx="6" ry="10" fill="#c8a070" stroke="#b08050" strokeWidth="1" transform="rotate(15 39 20)" />
      <ellipse cx="39" cy="19" rx="4" ry="7" fill="#deb887" opacity="0.5" transform="rotate(15 39 19)" />
      {/* Wings */}
      <path d="M10 42 Q2 38 6 30 L14 36Z" fill="#d97706" opacity="0.7" />
      <path d="M46 42 Q54 38 50 30 L42 36Z" fill="#d97706" opacity="0.7" />
      <defs>
        <linearGradient id="dogGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default DogShip;
