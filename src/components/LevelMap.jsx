import { useEffect, useRef, useState } from "react";
import Stars from "./Stars";
import { ShipPreview } from "../ships/ShipWithUpgrades";
import { st, W, H, ZONE_THEMES, getZone } from "../styles";
import AudioManager from "../audio";

const MAP_H = 2200;
const NODE_COUNT = 25;

const NODE_POSITIONS = Array.from({ length: NODE_COUNT }, (_, i) => {
  const pattern = [0.28, 0.52, 0.72, 0.48];
  const col = pattern[i % 4];
  return { x: col * W, y: MAP_H - (i * 80 + 100) };
});

// ─── SVG Gold Star ──────────────────────────────────────
function GoldStar({ x, y, size = 10, filled }) {
  return (
    <svg x={x - size / 2} y={y - size / 2} width={size} height={size} viewBox="0 0 16 16">
      <polygon
        points="8,0 10,5.5 16,6 11.5,10 13,16 8,12.5 3,16 4.5,10 0,6 6,5.5"
        fill={filled ? "#fbbf24" : "#1e1b4b"}
        stroke={filled ? "#f59e0b" : "#374151"}
        strokeWidth="0.8"
        opacity={filled ? 1 : 0.4}
      />
    </svg>
  );
}

// ─── Layered Map Background ─────────────────────────────
function MapBackground() {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: W, height: MAP_H, pointerEvents: "none", zIndex: 0 }}
      viewBox={`0 0 ${W} ${MAP_H}`}>
      <defs>
        {/* Zone background gradients */}
        <linearGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#312e81" stopOpacity="1" />
          <stop offset="18%" stopColor="#7f1d1d" stopOpacity="0.4" />
          <stop offset="36%" stopColor="#064e3b" stopOpacity="0.3" />
          <stop offset="54%" stopColor="#92400e" stopOpacity="0.3" />
          <stop offset="72%" stopColor="#0a2463" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#050816" stopOpacity="1" />
        </linearGradient>
        <filter id="nebulaBlur"><feGaussianBlur stdDeviation="25" /></filter>
        <filter id="softBlur"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>

      {/* Layer 1: Background gradient */}
      <rect x="0" y="0" width={W} height={MAP_H} fill="url(#mapBg)" />

      {/* Layer 2: Nebula clouds */}
      <g filter="url(#nebulaBlur)">
        <ellipse cx="300" cy="200" rx="150" ry="80" fill="#a78bfa" opacity="0.08">
          <animateTransform attributeName="transform" type="translate" values="0,0;15,0;0,0" dur="20s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="80" cy="500" rx="120" ry="90" fill="#ef4444" opacity="0.06">
          <animateTransform attributeName="transform" type="translate" values="0,0;-10,0;0,0" dur="25s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="320" cy="900" rx="130" ry="70" fill="#10b981" opacity="0.07">
          <animateTransform attributeName="transform" type="translate" values="0,0;12,0;0,0" dur="18s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="60" cy="1300" rx="100" ry="60" fill="#f59e0b" opacity="0.06">
          <animateTransform attributeName="transform" type="translate" values="0,0;-8,0;0,0" dur="22s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="280" cy="1700" rx="140" ry="80" fill="#22d3ee" opacity="0.07">
          <animateTransform attributeName="transform" type="translate" values="0,0;10,0;0,0" dur="16s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Layer 3: Terrain silhouettes at zone boundaries */}
      <path d="M0,440 Q40,400 80,420 Q130,380 180,410 Q230,375 280,405 Q330,385 380,415 L400,440 L400,480 L0,480Z"
        fill="#312e81" opacity="0.12" />
      <path d="M0,860 Q50,820 110,845 Q160,800 220,835 Q280,810 340,840 L400,860 L400,900 L0,900Z"
        fill="#7f1d1d" opacity="0.1" />
      <path d="M0,1280 Q60,1240 120,1260 Q180,1220 240,1250 Q300,1230 360,1260 L400,1280 L400,1320 L0,1320Z"
        fill="#064e3b" opacity="0.1" />
      <path d="M0,1700 Q40,1660 100,1685 Q160,1650 220,1680 Q280,1655 350,1690 L400,1700 L400,1740 L0,1740Z"
        fill="#92400e" opacity="0.1" />

      {/* Layer 4: Space station silhouettes */}
      <g opacity="0.15" transform="translate(340,300)">
        <rect x="0" y="10" width="30" height="25" rx="3" fill="#a78bfa" />
        <circle cx="15" cy="5" r="8" fill="#a78bfa" />
        <rect x="12" y="-10" width="6" height="10" fill="#a78bfa" />
      </g>
      <g opacity="0.12" transform="translate(10,750)">
        <rect x="0" y="8" width="35" height="20" rx="4" fill="#ef4444" />
        <circle cx="17" cy="3" r="7" fill="#ef4444" />
        <rect x="30" y="0" width="4" height="15" fill="#ef4444" />
      </g>
      <g opacity="0.12" transform="translate(350,1150)">
        <rect x="0" y="10" width="28" height="22" rx="3" fill="#10b981" />
        <polygon points="14,-2 24,10 4,10" fill="#10b981" />
      </g>
      <g opacity="0.12" transform="translate(15,1550)">
        <rect x="0" y="5" width="32" height="24" rx="4" fill="#f59e0b" />
        <circle cx="16" cy="0" r="9" fill="#f59e0b" />
      </g>

      {/* Layer 5: Foreground asteroids */}
      {[350, 750, 1100, 1500, 1900].map((y, i) => (
        <g key={i} transform={`translate(${i % 2 === 0 ? 5 : 370},${y})`} opacity="0.25">
          <path d="M5,12 L8,3 L16,5 L20,14 L14,18 L6,16Z"
            fill={["#374151", "#4b5563", "#374151", "#4b5563", "#374151"][i]}
            stroke="#1f2937" strokeWidth="0.5" />
          <circle cx="25" cy="8" r="3" fill="#374151" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

// ─── Zone Dividers ──────────────────────────────────────
function ZoneDividers() {
  const dividerYs = [
    { y: NODE_POSITIONS[4].y + 35, zone: 2 },
    { y: NODE_POSITIONS[9].y + 35, zone: 3 },
    { y: NODE_POSITIONS[14].y + 35, zone: 4 },
    { y: NODE_POSITIONS[19].y + 35, zone: 5 },
  ];

  return (
    <>
      {dividerYs.map(({ y, zone }) => {
        const theme = ZONE_THEMES[zone];
        return (
          <div key={zone} style={{
            position: "absolute", top: y - 12, left: 0, right: 0,
            height: 24, display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 3, pointerEvents: "none",
          }}>
            {/* Left pillar */}
            <svg style={{ position: "absolute", left: 8 }} width="16" height="24" viewBox="0 0 16 24">
              <rect x="4" y="0" width="8" height="24" rx="2" fill={theme.mid} opacity="0.3" />
              <circle cx="8" cy="4" r="3" fill={theme.accent} opacity="0.5" />
            </svg>
            {/* Energy arc */}
            <svg style={{ position: "absolute", left: 24, right: 24, top: 10, height: 4 }} viewBox="0 0 352 4" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="352" y2="2" stroke={theme.accent} strokeWidth="1" opacity="0.3"
                strokeDasharray="4 3">
                <animate attributeName="stroke-dashoffset" values="7;0" dur="1s" repeatCount="indefinite" />
              </line>
            </svg>
            {/* Zone label */}
            <div style={{
              background: "rgba(0,0,0,0.6)", padding: "2px 10px", borderRadius: 8,
              border: `1px solid ${theme.glow}0.3)`,
              fontSize: "0.45rem", fontWeight: 700, letterSpacing: 2,
              color: theme.accent, zIndex: 4, whiteSpace: "nowrap",
            }}>
              {theme.name}
            </div>
            {/* Right pillar */}
            <svg style={{ position: "absolute", right: 8 }} width="16" height="24" viewBox="0 0 16 24">
              <rect x="4" y="0" width="8" height="24" rx="2" fill={theme.mid} opacity="0.3" />
              <circle cx="8" cy="4" r="3" fill={theme.accent} opacity="0.5" />
            </svg>
          </div>
        );
      })}
    </>
  );
}

// ─── Hexagonal Map Node ─────────────────────────────────
function MapNode({ level, x, y, stars, isUnlocked, isCurrent, onClick }) {
  const completed = stars > 0;
  const zone = getZone(level);
  const theme = ZONE_THEMES[zone];

  return (
    <div
      onClick={isUnlocked ? onClick : undefined}
      style={{
        position: "absolute",
        left: x - 28,
        top: y - 28,
        width: 56,
        height: 56,
        cursor: isUnlocked ? "pointer" : "default",
        zIndex: 5,
        animation: isCurrent ? "nodeGlow 2s ease-in-out infinite" : "none",
        transition: "transform 0.2s",
        transform: isCurrent ? "scale(1.15)" : "scale(1)",
      }}
    >
      <svg viewBox="0 0 56 56" width="56" height="56">
        <defs>
          <linearGradient id={`nodeGrad${level}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={completed ? theme.accent : isUnlocked ? theme.mid : "#1f2937"} stopOpacity={completed ? 0.9 : 0.6} />
            <stop offset="100%" stopColor={completed ? theme.dark : isUnlocked ? theme.dark : "#111827"} stopOpacity={completed ? 0.8 : 0.5} />
          </linearGradient>
        </defs>

        {/* Orbital ring for completed */}
        {completed && (
          <ellipse cx="28" cy="28" rx="27" ry="12"
            fill="none" stroke={theme.accent} strokeWidth="0.8" opacity="0.3"
            transform="rotate(-20 28 28)">
            <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="360 28 28" dur="30s" repeatCount="indefinite" />
          </ellipse>
        )}

        {/* Hex shape */}
        <polygon
          points="28,2 50,15 50,41 28,54 6,41 6,15"
          fill={`url(#nodeGrad${level})`}
          stroke={completed ? "#fbbf24" : isUnlocked ? theme.mid : "#374151"}
          strokeWidth={isCurrent ? 2.5 : completed ? 1.5 : 1}
          opacity={isUnlocked ? 1 : 0.3}
        />

        {/* Inner highlight */}
        {(completed || isUnlocked) && (
          <polygon
            points="28,8 44,18 44,38 28,48 12,38 12,18"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        )}

        {/* Gold glow for current */}
        {isCurrent && (
          <polygon
            points="28,2 50,15 50,41 28,54 6,41 6,15"
            fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
          </polygon>
        )}

        {/* Content */}
        {!isUnlocked ? (
          // Lock icon
          <g transform="translate(22,18)">
            <rect x="0" y="6" width="12" height="10" rx="2" fill="#4b5563" />
            <path d="M3,6 V4 C3,1.5 4.5,0 6,0 C7.5,0 9,1.5 9,4 V6" fill="none" stroke="#4b5563" strokeWidth="1.5" />
          </g>
        ) : (
          <text x="28" y="32" textAnchor="middle" fontSize="14" fontWeight="800"
            fill={completed ? "#fbbf24" : "#e2e8f0"}
            style={{ fontFamily: "system-ui" }}>
            {level}
          </text>
        )}
      </svg>

      {/* Stars below hex */}
      {completed && (
        <div style={{ position: "absolute", top: 54, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 1 }}>
          <svg width="36" height="12" viewBox="0 0 36 12">
            <GoldStar x={6} y={6} size={10} filled={stars >= 1} />
            <GoldStar x={18} y={6} size={10} filled={stars >= 2} />
            <GoldStar x={30} y={6} size={10} filled={stars >= 3} />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Energy Beam Paths ──────────────────────────────────
function MapPaths({ starsPerLevel, unlockedLevel }) {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: W, height: MAP_H, pointerEvents: "none", zIndex: 2 }}>
      <defs>
        <filter id="beamGlow"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      {NODE_POSITIONS.slice(0, -1).map((pos, i) => {
        const next = NODE_POSITIONS[i + 1];
        const mx = (pos.x + next.x) / 2;
        const my = (pos.y + next.y) / 2;
        const completed = starsPerLevel[i] > 0;
        const unlocked = i + 1 < unlockedLevel;
        const zone = getZone(i + 1);
        const theme = ZONE_THEMES[zone];
        const d = `M${pos.x},${pos.y} Q${mx + (i % 2 === 0 ? 25 : -25)},${my} ${next.x},${next.y}`;

        if (completed || unlocked) {
          return (
            <g key={i}>
              {/* Outer glow */}
              <path d={d} fill="none" stroke={theme.accent} strokeWidth="6" opacity="0.1" filter="url(#beamGlow)" />
              {/* Main beam */}
              <path d={d} fill="none" stroke={theme.mid} strokeWidth="4" opacity="0.2" />
              {/* Inner energy pulse */}
              <path d={d} fill="none" stroke={theme.accent} strokeWidth="2" opacity="0.6"
                strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" values="8;0" dur="1.5s" repeatCount="indefinite" />
              </path>
            </g>
          );
        }

        return (
          <path key={i} d={d} fill="none" stroke="#1e1b4b" strokeWidth="1.5"
            strokeDasharray="3 5" opacity="0.08" />
        );
      })}
    </svg>
  );
}

// ─── Level Map ──────────────────────────────────────────
export default function LevelMap({ starsPerLevel, unlockedLevel, character, onSelectLevel, onMenu, unlockingLevel }) {
  const scrollRef = useRef(null);
  const [showUnlock, setShowUnlock] = useState(false);

  useEffect(() => {
    if (!scrollRef.current) return;
    const targetIdx = Math.min(unlockedLevel - 1, NODE_COUNT - 1);
    const targetY = NODE_POSITIONS[targetIdx].y - H / 2 + 24;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    }, 300);
  }, [unlockedLevel]);

  useEffect(() => {
    if (unlockingLevel && unlockingLevel > 1) {
      setShowUnlock(true);
      AudioManager.playUnlock();
      const timer = setTimeout(() => setShowUnlock(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [unlockingLevel]);

  const totalStars = starsPerLevel.reduce((a, b) => a + b, 0);

  return (
    <div style={st.wrapper}>
      <div style={st.scene}>
        {/* Header */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
          background: "linear-gradient(180deg, rgba(5,8,22,0.95) 0%, transparent 100%)",
          padding: "10px 14px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid rgba(251,191,36,0.1)",
        }}>
          <button onClick={onMenu} style={{
            background: "rgba(0,0,0,0.4)", border: "1px solid rgba(251,191,36,0.2)",
            color: "#b8860b", fontSize: "0.65rem", cursor: "pointer",
            fontFamily: "inherit", letterSpacing: 1, borderRadius: 8, padding: "4px 10px",
          }}>← MENÜ</button>
          <div style={{
            fontSize: "0.65rem", fontWeight: 800, letterSpacing: 3,
            background: "linear-gradient(135deg, #22d3ee, #a78bfa, #fbbf24)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>WELTRAUMKARTE</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "rgba(0,0,0,0.4)", border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 8, padding: "3px 10px",
          }}>
            <svg width="10" height="10" viewBox="0 0 16 16">
              <polygon points="8,0 10,5.5 16,6 11.5,10 13,16 8,12.5 3,16 4.5,10 0,6 6,5.5" fill="#fbbf24" />
            </svg>
            <span style={{ color: "#fbbf24", fontSize: "0.65rem", fontWeight: 700 }}>
              {totalStars}/{NODE_COUNT * 3}
            </span>
          </div>
        </div>

        {/* Scrollable map */}
        <div
          ref={scrollRef}
          style={{
            position: "absolute", inset: 0,
            overflowY: "auto", overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ position: "relative", width: W, height: MAP_H }}>
            <MapBackground />
            <Stars count={60} />
            <MapPaths starsPerLevel={starsPerLevel} unlockedLevel={unlockedLevel} />
            <ZoneDividers />

            {NODE_POSITIONS.map((pos, i) => {
              const levelNum = i + 1;
              return (
                <MapNode
                  key={i}
                  level={levelNum}
                  x={pos.x}
                  y={pos.y}
                  stars={starsPerLevel[i]}
                  isUnlocked={levelNum <= unlockedLevel}
                  isCurrent={levelNum === unlockedLevel}
                  onClick={() => onSelectLevel(levelNum)}
                />
              );
            })}

            {/* Ship at current level */}
            <div style={{
              position: "absolute",
              left: NODE_POSITIONS[Math.min(unlockedLevel - 1, NODE_COUNT - 1)].x - 28,
              top: NODE_POSITIONS[Math.min(unlockedLevel - 1, NODE_COUNT - 1)].y - 72,
              zIndex: 10, transform: "scale(0.55)",
              animation: "float 2s ease-in-out infinite",
              pointerEvents: "none",
            }}>
              <ShipPreview type={character} />
            </div>

            {/* Unlock burst */}
            {showUnlock && unlockingLevel > 1 && unlockingLevel <= NODE_COUNT && (
              <div style={{
                position: "absolute",
                left: NODE_POSITIONS[unlockingLevel - 1].x - 30,
                top: NODE_POSITIONS[unlockingLevel - 1].y - 30,
                width: 60, height: 60, borderRadius: "50%",
                background: `radial-gradient(circle, ${ZONE_THEMES[getZone(unlockingLevel)].glow}0.6) 0%, transparent 70%)`,
                animation: "unlockBurst 1.5s ease-out forwards",
                zIndex: 15, pointerEvents: "none",
              }} />
            )}
          </div>
        </div>

        {/* Bottom gradient */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 50,
          background: "linear-gradient(0deg, rgba(5,8,22,0.95) 0%, transparent 100%)",
          zIndex: 15, pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}
