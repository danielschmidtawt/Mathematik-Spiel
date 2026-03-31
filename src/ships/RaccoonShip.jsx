const RaccoonShip = ({ x, wiggle, style }) => (
  <div
    style={{
      position: "absolute",
      bottom: 70,
      left: x - 28,
      width: 56,
      height: 64,
      transition: "left 0.4s cubic-bezier(.34,1.56,.64,1)",
      filter: "drop-shadow(0 0 12px rgba(156,163,175,0.6))",
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
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#c0c4cc" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#raccoonGrad)" />
      {/* Face window */}
      <ellipse cx="28" cy="34" rx="10" ry="12" fill="#1e1b4b" stroke="#6b7280" strokeWidth="1.5" />
      {/* Face */}
      <ellipse cx="28" cy="30" rx="6.5" ry="6" fill="#e5e7eb" />
      {/* Eye mask – dark bands */}
      <ellipse cx="24.5" cy="28.5" rx="3" ry="2" fill="#374151" opacity="0.7" />
      <ellipse cx="31.5" cy="28.5" rx="3" ry="2" fill="#374151" opacity="0.7" />
      {/* Eyes – bright in mask */}
      <circle cx="24.5" cy="28.5" r="1.3" fill="#f0f0f0" />
      <circle cx="31.5" cy="28.5" r="1.3" fill="#f0f0f0" />
      <circle cx="24.5" cy="28.5" r="0.7" fill="#1e1b4b" />
      <circle cx="31.5" cy="28.5" r="0.7" fill="#1e1b4b" />
      {/* Nose – small pointed */}
      <polygon points="28,31.5 27,32.8 29,32.8" fill="#374151" />
      {/* Mouth */}
      <path d="M26.5 33.5 Q28 34.5 29.5 33.5" stroke="#374151" strokeWidth="0.7" fill="none" />
      {/* Ears – small rounded */}
      <ellipse cx="20" cy="14" rx="4" ry="5" fill="#c0c4cc" stroke="#9ca3af" strokeWidth="1" />
      <ellipse cx="20" cy="13" rx="2.5" ry="3" fill="#e5e7eb" opacity="0.5" />
      <ellipse cx="36" cy="14" rx="4" ry="5" fill="#c0c4cc" stroke="#9ca3af" strokeWidth="1" />
      <ellipse cx="36" cy="13" rx="2.5" ry="3" fill="#e5e7eb" opacity="0.5" />
      {/* Striped tail deco – behind body */}
      <path d="M42 50 Q52 48 50 40 Q48 35 52 32" stroke="#9ca3af" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M42 50 Q52 48 50 40 Q48 35 52 32" stroke="#374151" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" strokeDasharray="3 4" />
      {/* Wings */}
      <path d="M10 42 Q2 38 6 30 L14 36Z" fill="#9ca3af" opacity="0.7" />
      <path d="M46 42 Q54 38 50 30 L42 36Z" fill="#9ca3af" opacity="0.7" />
      <defs>
        <linearGradient id="raccoonGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6b7280" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default RaccoonShip;
