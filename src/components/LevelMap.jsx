import { useEffect, useRef, useState } from "react";
import Stars from "./Stars";
import { ShipPreview } from "../ships/ShipWithUpgrades";
import { st, W, H } from "../styles";
import AudioManager from "../audio";

const MAP_H = 2100;
const NODE_COUNT = 25;

// Zigzag positions: bottom to top
const NODE_POSITIONS = Array.from({ length: NODE_COUNT }, (_, i) => {
  const pattern = [0.3, 0.55, 0.7, 0.45];
  const col = pattern[i % 4];
  return { x: col * W, y: MAP_H - (i * 78 + 80) };
});

// ─── Map Decorations ────────────────────────────────────
function MapDecorations() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Planet 1 - large purple */}
      <svg style={{ position: "absolute", top: 120, right: 20 }} width="60" height="60" viewBox="0 0 60 60">
        <defs>
          <radialGradient id="p1"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#3b0f80" /></radialGradient>
        </defs>
        <circle cx="30" cy="30" r="25" fill="url(#p1)" opacity="0.4" />
        <ellipse cx="30" cy="30" rx="32" ry="8" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.3" transform="rotate(-20 30 30)" />
      </svg>

      {/* Planet 2 - orange small */}
      <svg style={{ position: "absolute", top: 550, left: 15 }} width="35" height="35" viewBox="0 0 35 35">
        <defs>
          <radialGradient id="p2"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#92400e" /></radialGradient>
        </defs>
        <circle cx="17" cy="17" r="14" fill="url(#p2)" opacity="0.35" />
      </svg>

      {/* Planet 3 - blue-green */}
      <svg style={{ position: "absolute", top: 1000, right: 30 }} width="45" height="45" viewBox="0 0 45 45">
        <defs>
          <radialGradient id="p3"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#0e4a5a" /></radialGradient>
        </defs>
        <circle cx="22" cy="22" r="18" fill="url(#p3)" opacity="0.3" />
        <ellipse cx="22" cy="22" rx="24" ry="5" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.25" transform="rotate(15 22 22)" />
      </svg>

      {/* Planet 4 - red */}
      <svg style={{ position: "absolute", top: 1500, left: 25 }} width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <radialGradient id="p4"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#7f1d1d" /></radialGradient>
        </defs>
        <circle cx="20" cy="20" r="16" fill="url(#p4)" opacity="0.3" />
      </svg>

      {/* Nebula blobs */}
      <div style={{ position: "absolute", top: 300, left: "10%", width: 150, height: 100, background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: 800, right: "5%", width: 120, height: 80, background: "radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: 1300, left: "20%", width: 180, height: 120, background: "radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />

      {/* Asteroid clusters */}
      {[400, 900, 1400, 1800].map((y, idx) => (
        <svg key={idx} style={{ position: "absolute", top: y, left: idx % 2 === 0 ? 10 : "auto", right: idx % 2 === 1 ? 10 : "auto" }} width="30" height="25" viewBox="0 0 30 25">
          <polygon points="5,10 10,3 18,5 15,12 8,14" fill="#374151" opacity="0.3" />
          <polygon points="20,15 25,8 28,12 24,20 18,18" fill="#4b5563" opacity="0.25" />
          <circle cx="12" cy="20" r="3" fill="#374151" opacity="0.2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Map Node ───────────────────────────────────────────
function MapNode({ level, x, y, stars, isUnlocked, isCurrent, onClick }) {
  const completed = stars > 0;

  return (
    <div
      onClick={isUnlocked ? onClick : undefined}
      style={{
        position: "absolute",
        left: x - 24,
        top: y - 24,
        width: 48,
        height: 48,
        cursor: isUnlocked ? "pointer" : "default",
        zIndex: 5,
        animation: isCurrent ? "nodeGlow 2s ease-in-out infinite" : "none",
        transition: "transform 0.2s",
      }}
    >
      {/* Node circle */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: completed
          ? "linear-gradient(135deg, #7c3aed, #a855f7)"
          : isUnlocked
            ? "linear-gradient(135deg, #4c2885, #6d3bc4)"
            : "rgba(30,27,75,0.6)",
        border: isCurrent
          ? "3px solid #a78bfa"
          : completed
            ? "2px solid rgba(168,130,255,0.5)"
            : "2px solid rgba(100,100,120,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isUnlocked ? 1 : 0.35,
        boxShadow: isCurrent
          ? "0 0 20px rgba(168,130,255,0.5)"
          : completed
            ? "0 0 10px rgba(168,130,255,0.2)"
            : "none",
        transition: "all 0.3s",
        transform: isCurrent ? "scale(1.15)" : "scale(1)",
      }}>
        {!isUnlocked ? (
          <svg viewBox="0 0 16 20" width="12" height="15" fill="#64748b">
            <rect x="2" y="8" width="12" height="10" rx="2" />
            <path d="M5 8 V5 C5 2.2 6.8 1 8 1 C9.2 1 11 2.2 11 5 V8" fill="none" stroke="#64748b" strokeWidth="1.5" />
          </svg>
        ) : (
          <span style={{ color: "#f5f0ff", fontSize: "0.85rem", fontWeight: 800 }}>{level}</span>
        )}
      </div>

      {/* Stars below */}
      {completed && (
        <div style={{ position: "absolute", top: 50, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 1, whiteSpace: "nowrap" }}>
          {[1, 2, 3].map(s => (
            <span key={s} style={{ fontSize: "0.55rem", opacity: s <= stars ? 1 : 0.3 }}>⭐</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SVG Paths between nodes ────────────────────────────
function MapPaths({ starsPerLevel, unlockedLevel }) {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: W, height: MAP_H, pointerEvents: "none", zIndex: 2 }}>
      {NODE_POSITIONS.slice(0, -1).map((pos, i) => {
        const next = NODE_POSITIONS[i + 1];
        const mx = (pos.x + next.x) / 2;
        const my = (pos.y + next.y) / 2;
        const completed = starsPerLevel[i] > 0;
        const unlocked = i + 1 < unlockedLevel;

        return (
          <path
            key={i}
            d={`M${pos.x},${pos.y} Q${mx + (i % 2 === 0 ? 30 : -30)},${my} ${next.x},${next.y}`}
            fill="none"
            stroke={completed || unlocked ? "#7c3aed" : "#1e1b4b"}
            strokeWidth={completed ? 3 : 2}
            strokeDasharray={completed || unlocked ? "none" : "6 4"}
            opacity={completed ? 0.6 : unlocked ? 0.4 : 0.15}
          />
        );
      })}
    </svg>
  );
}

// ─── Level Map ──────────────────────────────────────────
export default function LevelMap({ starsPerLevel, unlockedLevel, character, onSelectLevel, onMenu, unlockingLevel }) {
  const scrollRef = useRef(null);
  const [showUnlock, setShowUnlock] = useState(false);

  // Auto-scroll to current level
  useEffect(() => {
    if (!scrollRef.current) return;
    const targetIdx = Math.min(unlockedLevel - 1, NODE_COUNT - 1);
    const targetY = NODE_POSITIONS[targetIdx].y - H / 2 + 24;
    // Delay for smooth entry
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    }, 300);
  }, [unlockedLevel]);

  // Unlock animation
  useEffect(() => {
    if (unlockingLevel && unlockingLevel > 1) {
      setShowUnlock(true);
      AudioManager.playUnlock();
      const timer = setTimeout(() => setShowUnlock(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [unlockingLevel]);

  return (
    <div style={st.wrapper}>
      <div style={st.scene}>
        {/* Header */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
          background: "linear-gradient(180deg, rgba(7,11,30,0.95) 0%, transparent 100%)",
          padding: "10px 16px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <button onClick={onMenu} style={{ background: "none", border: "none", color: "#64748b", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>← MENÜ</button>
          <div style={{ color: "#a78bfa", fontSize: "0.7rem", fontWeight: 700, letterSpacing: 2 }}>WELTRAUMKARTE</div>
          <div style={{ color: "#facc15", fontSize: "0.7rem", fontWeight: 700 }}>
            ⭐ {starsPerLevel.reduce((a, b) => a + b, 0)}/{NODE_COUNT * 3}
          </div>
        </div>

        {/* Scrollable map area */}
        <div
          ref={scrollRef}
          style={{
            position: "absolute", inset: 0,
            overflowY: "auto", overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ position: "relative", width: W, height: MAP_H }}>
            <Stars count={80} />
            <MapDecorations />
            <MapPaths starsPerLevel={starsPerLevel} unlockedLevel={unlockedLevel} />

            {NODE_POSITIONS.map((pos, i) => {
              const levelNum = i + 1;
              const isUnlocked = levelNum <= unlockedLevel;
              const isCurrent = levelNum === unlockedLevel;

              return (
                <MapNode
                  key={i}
                  level={levelNum}
                  x={pos.x}
                  y={pos.y}
                  stars={starsPerLevel[i]}
                  isUnlocked={isUnlocked}
                  isCurrent={isCurrent}
                  onClick={() => onSelectLevel(levelNum)}
                />
              );
            })}

            {/* Ship icon at current level */}
            <div style={{
              position: "absolute",
              left: NODE_POSITIONS[Math.min(unlockedLevel - 1, NODE_COUNT - 1)].x - 28,
              top: NODE_POSITIONS[Math.min(unlockedLevel - 1, NODE_COUNT - 1)].y - 70,
              zIndex: 10,
              transform: "scale(0.6)",
              animation: "float 2s ease-in-out infinite",
              pointerEvents: "none",
            }}>
              <ShipPreview type={character} />
            </div>

            {/* Unlock burst animation */}
            {showUnlock && unlockingLevel > 1 && unlockingLevel <= NODE_COUNT && (
              <div style={{
                position: "absolute",
                left: NODE_POSITIONS[unlockingLevel - 1].x - 30,
                top: NODE_POSITIONS[unlockingLevel - 1].y - 30,
                width: 60, height: 60,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(168,130,255,0.6) 0%, transparent 70%)",
                animation: "unlockBurst 1.5s ease-out forwards",
                zIndex: 15,
                pointerEvents: "none",
              }} />
            )}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
          background: "linear-gradient(0deg, rgba(7,11,30,0.9) 0%, transparent 100%)",
          zIndex: 15, pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}
