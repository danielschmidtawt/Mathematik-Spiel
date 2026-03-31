// Shared styles, CSS keyframes, zone system, and gold palette

export const W = 400;
export const H = 650;

// ─── Zone System (5 zones, 5 levels each) ───────────────
export const ZONE_THEMES = {
  1: { name: "NEBULA-AUSSENPOSTEN", dark: "#0a2463", mid: "#1e6091", accent: "#22d3ee", glow: "rgba(34,211,238," },
  2: { name: "SONNENFORGE", dark: "#92400e", mid: "#f59e0b", accent: "#fbbf24", glow: "rgba(251,191,36," },
  3: { name: "KRISTALLRIFF", dark: "#064e3b", mid: "#10b981", accent: "#6ee7b7", glow: "rgba(110,231,183," },
  4: { name: "PURPURRISS", dark: "#7f1d1d", mid: "#ef4444", accent: "#fca5a5", glow: "rgba(252,165,165," },
  5: { name: "ASTRALTHRON", dark: "#312e81", mid: "#a78bfa", accent: "#fbbf24", glow: "rgba(167,139,250," },
};

export const getZone = (level) => Math.min(Math.ceil(level / 5), 5);
export const getZoneColors = (level) => ZONE_THEMES[getZone(level)];

// ─── CSS Keyframes ──────────────────────────────────────
export const css = `
  @keyframes starDrift { 0% { transform: translateY(0); } 100% { transform: translateY(100vh); } }
  @keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
  @keyframes gateGlow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(251,191,36,0.2)); } 50% { filter: drop-shadow(0 0 16px rgba(251,191,36,0.5)); } }
  @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes popIn { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes nodeGlow { 0%, 100% { filter: drop-shadow(0 0 6px rgba(251,191,36,0.3)); } 50% { filter: drop-shadow(0 0 18px rgba(251,191,36,0.8)); } }
  @keyframes heartBeat { 0% { transform: scale(1); } 15% { transform: scale(1.3); } 30% { transform: scale(1); } }
  @keyframes rainbowShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
  @keyframes unlockBurst { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }
  @keyframes pathFill { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
  @keyframes upgradeGlow { 0% { transform: scale(0); opacity: 1; } 50% { transform: scale(2); opacity: 0.5; } 100% { transform: scale(3); opacity: 0; } }
  @keyframes particleFly { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; } }
  @keyframes nebulaDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(15px); } }
  @keyframes energyPulse { 0% { stroke-dashoffset: 20; } 100% { stroke-dashoffset: 0; } }
  @keyframes stationRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes cardShine { 0% { transform: translateX(-100%) rotate(25deg); } 100% { transform: translateX(300%) rotate(25deg); } }
  @keyframes glowPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
  @keyframes barFill { from { width: 0%; } to { width: var(--fill); } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

// ─── Shared Styles ──────────────────────────────────────
export const st = {
  wrapper: { width: "100%", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#050816", fontFamily: "'SF Pro Rounded', 'Nunito', system-ui, sans-serif", padding: 12, boxSizing: "border-box" },
  scene: { position: "relative", width: W, maxWidth: "100%", height: H, background: "linear-gradient(180deg, #070b1e 0%, #0d1333 40%, #131a44 100%)", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(251,191,36,0.1)", boxShadow: "0 0 60px rgba(100,60,200,0.1), inset 0 0 80px rgba(10,5,30,0.5)" },
  hud: { position: "absolute", top: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", zIndex: 20 },
  hudBlock: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(0,0,0,0.5)", borderRadius: 10, padding: "4px 8px", backdropFilter: "blur(6px)", border: "1px solid rgba(251,191,36,0.15)", borderTop: "2px solid rgba(251,191,36,0.3)", boxShadow: "inset 0 1px 0 rgba(251,191,36,0.08), 0 2px 8px rgba(0,0,0,0.3)" },
  hudLabel: { fontSize: "0.45rem", color: "#b8860b", letterSpacing: 2, fontWeight: 700 },
  hudVal: { fontSize: "0.8rem", color: "#e2e8f0", fontWeight: 800, textShadow: "0 0 8px rgba(251,191,36,0.15)" },
  wall: { height: 12, background: "linear-gradient(90deg, rgba(251,191,36,0.08), #4c2885, rgba(251,191,36,0.08))", borderTop: "2px solid rgba(251,191,36,0.3)", borderBottom: "2px solid rgba(251,191,36,0.3)", boxShadow: "0 0 12px rgba(124,58,237,0.3)" },
  passage: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "background 0.3s" },
  centerDivider: { width: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #1a0f3d, #2d1b69)", position: "relative" },
  questionBubble: { background: "linear-gradient(135deg, #4c2885, #6d3bc4)", borderRadius: 12, padding: "8px 12px", boxShadow: "0 0 20px rgba(124,58,237,0.5)", border: "1px solid rgba(251,191,36,0.25)", borderTop: "2px solid rgba(251,191,36,0.4)" },
  questionText: { color: "#f5f0ff", fontSize: "0.95rem", fontWeight: 800, whiteSpace: "nowrap", letterSpacing: 1 },
  answerText: { fontSize: "1.8rem", fontWeight: 900, transition: "color 0.3s, transform 0.3s", textShadow: "0 2px 8px rgba(0,0,0,0.3)" },
  tapZone: { position: "absolute", bottom: 0, width: "50%", height: "40%", zIndex: 15, cursor: "pointer", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 16 },
  tapHint: { color: "rgba(251,191,36,0.5)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: 3, animation: "pulse 2s ease-in-out infinite", padding: "6px 16px", borderRadius: 8, background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" },
  mainBtn: { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", border: "1px solid rgba(251,191,36,0.3)", padding: "14px 36px", fontSize: "1rem", fontWeight: 800, borderRadius: 14, cursor: "pointer", letterSpacing: 2, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 24px rgba(124,58,237,0.4)", fontFamily: "inherit" },
  goldBorder: { border: "1px solid rgba(251,191,36,0.3)", boxShadow: "inset 0 1px 0 rgba(251,191,36,0.15), 0 0 8px rgba(251,191,36,0.1)" },
};

// ─── Character Themes ───────────────────────────────────
export const CHAR_COLORS = {
  bunny: { primary: "168,130,255", accent: "#a78bfa", glow: "rgba(168,130,255,0.6)", bg: "rgba(168,130,255,", label: "#d8d0f0", gradient: "linear-gradient(180deg, #2d1b69 0%, rgba(168,130,255,0.15) 100%)" },
  cat: { primary: "251,191,36", accent: "#fbbf24", glow: "rgba(251,191,36,0.6)", bg: "rgba(251,191,36,", label: "#fde8cd", gradient: "linear-gradient(180deg, #5c3a0e 0%, rgba(251,191,36,0.15) 100%)" },
  dog: { primary: "217,119,6", accent: "#d97706", glow: "rgba(217,119,6,0.6)", bg: "rgba(217,119,6,", label: "#fde0b0", gradient: "linear-gradient(180deg, #4a2606 0%, rgba(217,119,6,0.15) 100%)" },
  raccoon: { primary: "156,163,175", accent: "#9ca3af", glow: "rgba(156,163,175,0.6)", bg: "rgba(156,163,175,", label: "#d1d5db", gradient: "linear-gradient(180deg, #1f2937 0%, rgba(156,163,175,0.15) 100%)" },
};

export const CHAR_NAMES = { bunny: "HASE", cat: "KATZE", dog: "HUND", raccoon: "WASCHBÄR" };
export const CHAR_SUBTITLES = { bunny: "Raumschiffhase", cat: "Raumschiffkatze", dog: "Raumschiffhund", raccoon: "Raumschiffwaschbär" };

export const UPGRADE_NAMES = [
  "",
  "ENERGIESCHILD AKTIVIERT!",
  "TURBO-FLÜGEL MONTIERT!",
  "KOMMANDANTEN-KRONE!",
  "GOLDENE AURA ERWACHT!",
];
