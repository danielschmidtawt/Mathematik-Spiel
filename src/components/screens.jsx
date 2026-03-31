import Stars from "./Stars";
import { ShipPreview } from "../ships/ShipWithUpgrades";
import BunnyShip from "../ships/BunnyShip";
import { st, CHAR_COLORS, CHAR_NAMES, CHAR_SUBTITLES } from "../styles";
import { getCharData } from "../storage";
import AudioManager from "../audio";

const CHARACTERS = ["bunny", "cat", "dog", "raccoon"];

// ─── Gold Star SVG (inline) ────────────────────────────
function StarIcon({ filled, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ display: "inline-block" }}>
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

// ─── Menu Screen ────────────────────────────────────────
export function MenuScreen({ onStart, onContinue, hasSave }) {
  return (
    <div style={st.wrapper}>
      <div style={st.scene}>
        <Stars />
        {/* Nebula decorations */}
        <div style={{ position: "absolute", top: "15%", right: "-10%", width: 200, height: 150, background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "25%", left: "-10%", width: 180, height: 120, background: "radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "absolute", top: "10%", width: "100%", textAlign: "center", zIndex: 5 }}>
          <div style={{
            fontSize: "0.7rem", letterSpacing: 6, fontWeight: 700, marginBottom: 8,
            background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>🚀 WELTRAUM</div>
          <h1 style={{
            fontSize: "2.4rem", fontWeight: 900, margin: 0, letterSpacing: 4,
            background: "linear-gradient(180deg, #f5f0ff 0%, #c4b5fd 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(168,130,255,0.4))",
          }}>HASEN</h1>
          <h1 style={{
            fontSize: "2.4rem", fontWeight: 900, margin: "-6px 0 0", letterSpacing: 4,
            background: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(251,191,36,0.3))",
          }}>MATHE</h1>
          {/* Gold decorative line */}
          <div style={{ width: 80, height: 2, margin: "12px auto 0", background: "linear-gradient(90deg, transparent, #fbbf24, transparent)", borderRadius: 1 }} />
        </div>

        <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
          <BunnyShip x={28} wiggle={false} style={{ position: "relative", bottom: "auto", left: "auto" }} />
        </div>

        <div style={{ position: "absolute", bottom: "13%", width: "100%", textAlign: "center", zIndex: 5 }}>
          <div style={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.8, marginBottom: 20 }}>
            Fliege durch das richtige Tor!<br />Meistere 25 Level in 5 Weltraumzonen.
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {hasSave && (
              <button onClick={onContinue} style={st.mainBtn}>🚀 WEITER</button>
            )}
            <button onClick={onStart} style={hasSave ? {
              ...st.mainBtn, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(251,191,36,0.2)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              fontSize: "0.85rem", padding: "10px 28px",
            } : st.mainBtn}>
              {hasSave ? "NEUES SPIEL" : "🚀 START"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Character Select Screen ────────────────────────────
export function CharSelectScreen({ onSelect, onBack, saveData }) {
  return (
    <div style={st.wrapper}>
      <div style={st.scene}>
        <Stars />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, padding: 12 }}>
          <div style={{
            fontSize: "0.65rem", letterSpacing: 4, fontWeight: 700, marginBottom: 4,
            background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "slideUp 0.4s ease",
          }}>WÄHLE DEINEN</div>
          <h2 style={{
            fontSize: "1.3rem", fontWeight: 800, marginBottom: 20,
            background: "linear-gradient(180deg, #f5f0ff, #fbbf24)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "slideUp 0.5s ease",
          }}>CHARAKTER</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, animation: "slideUp 0.6s ease", width: "100%", maxWidth: 310 }}>
            {CHARACTERS.map((char, idx) => {
              const colors = CHAR_COLORS[char];
              const charData = getCharData(saveData, char);
              const progress = charData.unlockedLevel - 1;
              const totalStars = charData.starsPerLevel.reduce((a, b) => a + b, 0);
              const fillPct = (progress / 25) * 100;

              return (
                <div
                  key={char}
                  onClick={() => { AudioManager.init(); onSelect(char); }}
                  style={{
                    cursor: "pointer",
                    background: colors.gradient,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(251,191,36,0.2)",
                    boxShadow: "inset 0 1px 0 rgba(251,191,36,0.1), inset 0 0 0 1px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.3s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(251,191,36,0.2), 0 0 20px rgba(251,191,36,0.15), 0 4px 16px rgba(0,0,0,0.4)";
                    e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(251,191,36,0.2)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(251,191,36,0.1), inset 0 0 0 1px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {/* Shine overlay */}
                  <div style={{
                    position: "absolute", inset: 0, overflow: "hidden", borderRadius: 16, pointerEvents: "none", zIndex: 2,
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
                      animation: "cardShine 4s ease-in-out infinite",
                      animationDelay: `${idx * 0.5}s`,
                    }} />
                  </div>

                  {/* Ship area with glow */}
                  <div style={{
                    padding: "14px 0 8px",
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                      width: 50, height: 50, borderRadius: "50%",
                      background: `radial-gradient(circle, ${colors.bg}0.2) 0%, transparent 70%)`,
                    }} />
                    <div style={{ animation: `float 2s ease-in-out infinite`, animationDelay: `${idx * 0.15}s`, transform: "scale(0.8)" }}>
                      <ShipPreview type={char} />
                    </div>
                  </div>

                  {/* Gold divider */}
                  <div style={{ width: "80%", height: 1, background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)", margin: "2px 0" }} />

                  {/* Info area */}
                  <div style={{ padding: "8px 10px 10px", textAlign: "center", width: "100%" }}>
                    <div style={{ color: colors.label, fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>{CHAR_NAMES[char]}</div>
                    <div style={{ color: "#64748b", fontSize: "0.5rem", marginBottom: 6 }}>{CHAR_SUBTITLES[char]}</div>

                    {/* Progress bar */}
                    <div style={{
                      width: "100%", height: 5, borderRadius: 3,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      overflow: "hidden", marginBottom: 4,
                    }}>
                      <div style={{
                        width: `${fillPct}%`, height: "100%", borderRadius: 3,
                        background: `linear-gradient(90deg, ${colors.accent}, ${colors.bg}0.8))`,
                        transition: "width 1s ease",
                      }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#94a3b8", fontSize: "0.45rem" }}>Lv {charData.unlockedLevel}/25</span>
                      <span style={{ color: "#fbbf24", fontSize: "0.45rem", display: "flex", alignItems: "center", gap: 2 }}>
                        <svg width="7" height="7" viewBox="0 0 16 16"><polygon points="8,0 10,5.5 16,6 11.5,10 13,16 8,12.5 3,16 4.5,10 0,6 6,5.5" fill="#fbbf24" /></svg>
                        {totalStars}/75
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={onBack} style={{
            marginTop: 16, background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(251,191,36,0.15)",
            color: "#b8860b", fontSize: "0.65rem", cursor: "pointer",
            letterSpacing: 2, fontFamily: "inherit", borderRadius: 8, padding: "6px 16px",
          }}>← ZURÜCK</button>
        </div>
      </div>
    </div>
  );
}

// ─── Level Complete Screen ──────────────────────────────
export function LevelCompleteScreen({ level, score, mistakes, results, onMap }) {
  const stars = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
  return (
    <div style={st.wrapper}>
      <div style={st.scene}>
        <Stars />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, padding: 24 }}>
          <div style={{ fontSize: "0.75rem", color: "#b8860b", letterSpacing: 4, marginBottom: 8, animation: "slideUp 0.5s ease", fontWeight: 700 }}>LEVEL {level}</div>
          <h2 style={{
            fontSize: "1.8rem", fontWeight: 800, marginBottom: 16, animation: "slideUp 0.6s ease",
            background: "linear-gradient(180deg, #f5f0ff, #fbbf24)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>GESCHAFFT!</h2>

          {/* Stars with gold glow */}
          <div style={{ marginBottom: 16, animation: "popIn 0.8s ease", display: "flex", gap: 8, position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
            {[1, 2, 3].map(s => <StarIcon key={s} filled={s <= stars} size={32} />)}
          </div>

          <div style={{ display: "flex", gap: 5, marginBottom: 12, animation: "slideUp 0.7s ease", flexWrap: "wrap", justifyContent: "center" }}>
            {results.map((r, i) => (
              <div key={i} style={{
                width: 22, height: 22, borderRadius: "50%",
                background: r ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #ef4444, #dc2626)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.55rem", color: "#fff", fontWeight: 700,
                border: "1px solid rgba(251,191,36,0.15)",
                boxShadow: r ? "0 2px 6px rgba(34,197,94,0.3)" : "0 2px 6px rgba(239,68,68,0.3)",
              }}>
                {r ? "✓" : "✗"}
              </div>
            ))}
          </div>

          <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: 6, animation: "slideUp 0.8s ease" }}>
            Punkte: <span style={{ color: "#fbbf24", fontWeight: 700 }}>{score}</span>
          </div>
          <div style={{ color: "#64748b", fontSize: "0.7rem", marginBottom: 24, animation: "slideUp 0.85s ease" }}>
            {mistakes === 0 ? "Perfekt! Kein einziger Fehler!" : `${10 - mistakes}/10 richtig`}
          </div>
          <button onClick={onMap} style={{ ...st.mainBtn, animation: "slideUp 0.9s ease" }}>ZUR KARTE →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Level Failed Screen ────────────────────────────────
export function LevelFailedScreen({ level, onRetry, onMap }) {
  return (
    <div style={st.wrapper}>
      <div style={st.scene}>
        <Stars />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, padding: 24 }}>
          <div style={{ fontSize: "0.75rem", color: "#ef4444", letterSpacing: 4, marginBottom: 8, animation: "slideUp 0.5s ease", fontWeight: 700 }}>LEVEL {level}</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f5f0ff", marginBottom: 12, animation: "slideUp 0.6s ease" }}>VERLOREN!</h2>
          <div style={{ fontSize: "3rem", marginBottom: 16, animation: "popIn 0.8s ease" }}>💔</div>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: 24, animation: "slideUp 0.7s ease" }}>Keine Leben mehr übrig.</div>
          <div style={{ display: "flex", gap: 10, animation: "slideUp 0.8s ease" }}>
            <button onClick={onRetry} style={st.mainBtn}>🔄 NOCHMAL</button>
            <button onClick={onMap} style={{
              ...st.mainBtn, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(251,191,36,0.2)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}>KARTE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lives Display (HUD) ────────────────────────────────
export function LivesDisplay({ lives, maxLives = 2, damaged }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: maxLives }, (_, i) => (
        <svg key={i} viewBox="0 0 20 18" width="14" height="12"
          style={{
            opacity: i < lives ? 1 : 0.2,
            animation: damaged && i === lives ? "heartBeat 0.5s ease" : "none",
            transition: "opacity 0.3s",
            filter: i < lives ? "drop-shadow(0 0 3px rgba(239,68,68,0.4))" : "none",
          }}>
          <path d="M10 16 C4 10 0 7 0 4 C0 1.5 2 0 4.5 0 C6.5 0 8 1.5 10 3 C12 1.5 13.5 0 15.5 0 C18 0 20 1.5 20 4 C20 7 16 10 10 16Z"
            fill={i < lives ? "#ef4444" : "#374151"} />
        </svg>
      ))}
    </div>
  );
}
