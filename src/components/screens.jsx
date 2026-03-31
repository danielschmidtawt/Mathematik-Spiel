import Stars from "./Stars";
import { ShipPreview } from "../ships/ShipWithUpgrades";
import BunnyShip from "../ships/BunnyShip";
import { st, CHAR_COLORS, CHAR_NAMES, CHAR_SUBTITLES } from "../styles";
import { getCharData } from "../storage";
import AudioManager from "../audio";

const CHARACTERS = ["bunny", "cat", "dog", "raccoon"];

// ─── Menu Screen ────────────────────────────────────────
export function MenuScreen({ onStart, onContinue, hasSave }) {
  return (
    <div style={st.wrapper}>
      <div style={st.scene}>
        <Stars />
        <div style={{ position: "absolute", top: "12%", width: "100%", textAlign: "center", zIndex: 5 }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: 6, color: "#a78bfa", marginBottom: 8, fontWeight: 600 }}>🚀 WELTRAUM</div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#f5f0ff", margin: 0, letterSpacing: 3, textShadow: "0 0 30px rgba(168,130,255,0.5)" }}>HASEN</h1>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#c4b5fd", margin: "-4px 0 0", letterSpacing: 3, textShadow: "0 0 30px rgba(168,130,255,0.3)" }}>MATHE</h1>
        </div>
        <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
          <BunnyShip x={28} wiggle={false} style={{ position: "relative", bottom: "auto", left: "auto" }} />
        </div>
        <div style={{ position: "absolute", bottom: "15%", width: "100%", textAlign: "center", zIndex: 5 }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.8, marginBottom: 24 }}>
            Fliege durch das richtige Tor!<br />Löse Matheaufgaben in 25 Leveln.
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            {hasSave && (
              <button onClick={onContinue} style={st.mainBtn}>🚀 WEITER</button>
            )}
            <button onClick={onStart} style={hasSave ? { ...st.mainBtn, background: "rgba(255,255,255,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.2)", fontSize: "0.85rem", padding: "10px 28px" } : st.mainBtn}>
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
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, padding: 16 }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: 4, color: "#a78bfa", marginBottom: 6, fontWeight: 600, animation: "slideUp 0.4s ease" }}>WÄHLE DEINEN</div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f5f0ff", marginBottom: 24, animation: "slideUp 0.5s ease", textShadow: "0 0 20px rgba(168,130,255,0.4)" }}>CHARAKTER</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animation: "slideUp 0.6s ease", width: "100%", maxWidth: 300 }}>
            {CHARACTERS.map((char, idx) => {
              const colors = CHAR_COLORS[char];
              const charData = getCharData(saveData, char);
              const progress = charData.unlockedLevel - 1;
              return (
                <div
                  key={char}
                  onClick={() => { AudioManager.init(); onSelect(char); }}
                  style={{
                    cursor: "pointer",
                    background: `${colors.bg}0.08)`,
                    border: `2px solid ${colors.bg}0.25)`,
                    borderRadius: 16,
                    padding: "16px 12px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${colors.bg}0.6)`;
                    e.currentTarget.style.background = `${colors.bg}0.15)`;
                    e.currentTarget.style.boxShadow = `0 0 24px ${colors.bg}0.2)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${colors.bg}0.25)`;
                    e.currentTarget.style.background = `${colors.bg}0.08)`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ animation: `float 2s ease-in-out infinite`, animationDelay: `${idx * 0.15}s`, transform: "scale(0.85)" }}>
                    <ShipPreview type={char} />
                  </div>
                  <div style={{ color: colors.label, fontSize: "0.8rem", fontWeight: 700, letterSpacing: 1 }}>{CHAR_NAMES[char]}</div>
                  <div style={{ color: "#64748b", fontSize: "0.6rem" }}>{CHAR_SUBTITLES[char]}</div>
                  {progress > 0 && (
                    <div style={{ color: "#94a3b8", fontSize: "0.55rem", marginTop: -2 }}>Level {charData.unlockedLevel}/25</div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={onBack} style={{ marginTop: 20, background: "none", border: "none", color: "#64748b", fontSize: "0.7rem", cursor: "pointer", letterSpacing: 2, fontFamily: "inherit" }}>← ZURÜCK</button>
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
          <div style={{ fontSize: "0.8rem", color: "#a78bfa", letterSpacing: 4, marginBottom: 8, animation: "slideUp 0.5s ease" }}>LEVEL {level}</div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f5f0ff", marginBottom: 20, animation: "slideUp 0.6s ease", textShadow: "0 0 20px rgba(168,130,255,0.4)" }}>GESCHAFFT!</h2>
          <div style={{ fontSize: "2.2rem", marginBottom: 16, animation: "popIn 0.8s ease" }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12, animation: "slideUp 0.7s ease", flexWrap: "wrap", justifyContent: "center" }}>
            {results.map((r, i) => (
              <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: r ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #ef4444, #dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#fff", fontWeight: 700, boxShadow: r ? "0 2px 6px rgba(34,197,94,0.4)" : "0 2px 6px rgba(239,68,68,0.4)" }}>
                {r ? "✓" : "✗"}
              </div>
            ))}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: 8, animation: "slideUp 0.8s ease" }}>Punkte: <span style={{ color: "#facc15", fontWeight: 700 }}>{score}</span></div>
          <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: 28, animation: "slideUp 0.85s ease" }}>{mistakes === 0 ? "Perfekt! Kein einziger Fehler!" : `${10 - mistakes}/10 richtig`}</div>
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
          <div style={{ fontSize: "0.8rem", color: "#ef4444", letterSpacing: 4, marginBottom: 8, animation: "slideUp 0.5s ease" }}>LEVEL {level}</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f5f0ff", marginBottom: 12, animation: "slideUp 0.6s ease" }}>VERLOREN!</h2>
          <div style={{ fontSize: "3rem", marginBottom: 16, animation: "popIn 0.8s ease" }}>💔</div>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: 28, animation: "slideUp 0.7s ease" }}>Keine Leben mehr übrig.</div>
          <div style={{ display: "flex", gap: 12, animation: "slideUp 0.8s ease" }}>
            <button onClick={onRetry} style={st.mainBtn}>🔄 NOCHMAL</button>
            <button onClick={onMap} style={{ ...st.mainBtn, background: "rgba(255,255,255,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>KARTE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lives Display (HUD) ────────────────────────────────
export function LivesDisplay({ lives, maxLives = 2, damaged }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: maxLives }, (_, i) => (
        <svg key={i} viewBox="0 0 20 18" width="16" height="14"
          style={{
            opacity: i < lives ? 1 : 0.25,
            animation: damaged && i === lives ? "heartBeat 0.5s ease" : "none",
            transition: "opacity 0.3s",
          }}>
          <path d="M10 16 C4 10 0 7 0 4 C0 1.5 2 0 4.5 0 C6.5 0 8 1.5 10 3 C12 1.5 13.5 0 15.5 0 C18 0 20 1.5 20 4 C20 7 16 10 10 16Z"
            fill={i < lives ? "#ef4444" : "#374151"} />
        </svg>
      ))}
    </div>
  );
}
