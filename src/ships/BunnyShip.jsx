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
      <ellipse cx="28" cy="62" rx="8" ry="5" fill="#f97316" opacity="0.9">
        <animate attributeName="ry" values="5;8;5" dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="28" cy="61" rx="5" ry="3" fill="#facc15" opacity="0.9">
        <animate attributeName="ry" values="3;5;3" dur="0.25s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#d8d0f0" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#bunnyGrad)" />
      <ellipse cx="28" cy="34" rx="10" ry="12" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />
      <ellipse cx="28" cy="30" rx="6" ry="6" fill="#f5f0ff" />
      <circle cx="25" cy="29" r="1.5" fill="#1e1b4b" />
      <circle cx="31" cy="29" r="1.5" fill="#1e1b4b" />
      <ellipse cx="28" cy="32" rx="2" ry="1.2" fill="#f9a8d4" />
      <path d="M26 33 Q28 35 30 33" stroke="#1e1b4b" strokeWidth="0.8" fill="none" />
      <ellipse cx="22" cy="14" rx="5" ry="12" fill="#d8d0f0" stroke="#b8a8e0" strokeWidth="1" />
      <ellipse cx="22" cy="12" rx="3" ry="8" fill="#f9a8d4" opacity="0.5" />
      <ellipse cx="34" cy="14" rx="5" ry="12" fill="#d8d0f0" stroke="#b8a8e0" strokeWidth="1" />
      <ellipse cx="34" cy="12" rx="3" ry="8" fill="#f9a8d4" opacity="0.5" />
      <path d="M10 42 Q2 38 6 30 L14 36Z" fill="#a78bfa" opacity="0.7" />
      <path d="M46 42 Q54 38 50 30 L42 36Z" fill="#a78bfa" opacity="0.7" />
      <defs>
        <linearGradient id="bunnyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default BunnyShip;
