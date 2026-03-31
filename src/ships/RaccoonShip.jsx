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
      {/* Body – round & fluffy gray */}
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#d1d5db" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#raccoonGrad)" />
      {/* Belly highlight */}
      <ellipse cx="28" cy="46" rx="10" ry="10" fill="#f3f4f6" opacity="0.3" />
      {/* Face window – bigger */}
      <ellipse cx="28" cy="33" rx="12" ry="13" fill="#1e1b4b" stroke="#9ca3af" strokeWidth="1.5" />
      {/* Face – round, light */}
      <ellipse cx="28" cy="30" rx="8.5" ry="7.5" fill="#f3f4f6" />
      {/* Cute raccoon mask – soft & round */}
      <ellipse cx="24" cy="28" rx="3.5" ry="2.5" fill="#4b5563" opacity="0.6" rx="3.5" />
      <ellipse cx="32" cy="28" rx="3.5" ry="2.5" fill="#4b5563" opacity="0.6" />
      {/* Big sparkly eyes inside mask */}
      <circle cx="24" cy="28" r="2.2" fill="#f9fafb" />
      <circle cx="32" cy="28" r="2.2" fill="#f9fafb" />
      <circle cx="24" cy="28" r="1.3" fill="#374151" />
      <circle cx="32" cy="28" r="1.3" fill="#374151" />
      <circle cx="24.7" cy="27.2" r="0.7" fill="#fff" />
      <circle cx="32.7" cy="27.2" r="0.7" fill="#fff" />
      <circle cx="23.5" cy="28.5" r="0.4" fill="#fff" opacity="0.5" />
      <circle cx="31.5" cy="28.5" r="0.4" fill="#fff" opacity="0.5" />
      {/* Rosy cheeks */}
      <ellipse cx="20.5" cy="31" rx="1.8" ry="1" fill="#f9a8d4" opacity="0.4" />
      <ellipse cx="35.5" cy="31" rx="1.8" ry="1" fill="#f9a8d4" opacity="0.4" />
      {/* Small cute nose */}
      <ellipse cx="28" cy="31.5" rx="1.3" ry="0.9" fill="#4b5563" />
      <ellipse cx="28.3" cy="31.2" rx="0.4" ry="0.3" fill="#fff" opacity="0.3" />
      {/* Happy smile */}
      <path d="M25.5 33 Q28 35.5 30.5 33" stroke="#4b5563" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* Round fluffy ears */}
      <circle cx="19" cy="13" r="5.5" fill="#d1d5db" stroke="#b0b5bd" strokeWidth="1" />
      <circle cx="19" cy="12.5" r="3" fill="#f3f4f6" opacity="0.5" />
      <circle cx="37" cy="13" r="5.5" fill="#d1d5db" stroke="#b0b5bd" strokeWidth="1" />
      <circle cx="37" cy="12.5" r="3" fill="#f3f4f6" opacity="0.5" />
      {/* Cute striped tail – curling up */}
      <path d="M42 50 Q50 47 49 41 Q48 37 51 34" stroke="#d1d5db" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M42 50 Q50 47 49 41 Q48 37 51 34" stroke="#6b7280" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="3.5 3.5" opacity="0.5" />
      {/* Wings – rounded */}
      <path d="M10 42 Q3 38 6 30 Q8 28 14 36Z" fill="#9ca3af" opacity="0.5" />
      <path d="M46 42 Q53 38 50 30 Q48 28 42 36Z" fill="#9ca3af" opacity="0.5" />
      <defs>
        <linearGradient id="raccoonGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6b7280" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default RaccoonShip;
