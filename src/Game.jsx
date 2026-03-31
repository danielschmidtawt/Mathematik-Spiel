import { useState, useEffect, useRef, useCallback } from "react";

const W = 400;
const H = 650;

function mulProblem() {
  const a = Math.floor(Math.random() * 9) + 2;
  const b = Math.floor(Math.random() * 9) + 2;
  return { a, b, answer: a * b };
}

function wrongAnswer(correct) {
  const offsets = [-3, -2, -1, 1, 2, 3, 5, -5, 10, -10];
  let w = correct + offsets[Math.floor(Math.random() * offsets.length)];
  if (w <= 0 || w === correct) w = correct + 3;
  return w;
}

function Stars({ count = 60 }) {
  const stars = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      speed: 0.3 + Math.random() * 0.7,
      opacity: 0.3 + Math.random() * 0.7,
    }))
  );
  return (
    <>
      {stars.current.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            opacity: s.opacity,
            animation: `starDrift ${4 / s.speed}s linear infinite`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

const BunnyShip = ({ x, wiggle }) => (
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

const CatShip = ({ x, wiggle }) => (
  <div
    style={{
      position: "absolute",
      bottom: 70,
      left: x - 28,
      width: 56,
      height: 64,
      transition: "left 0.4s cubic-bezier(.34,1.56,.64,1)",
      filter: "drop-shadow(0 0 12px rgba(251,191,36,0.6))",
      zIndex: 10,
      animation: wiggle ? "none" : "hover 2s ease-in-out infinite",
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
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="#fde8cd" />
      <ellipse cx="28" cy="40" rx="18" ry="22" fill="url(#catGrad)" />
      {/* Face window */}
      <ellipse cx="28" cy="34" rx="10" ry="12" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
      {/* Face */}
      <ellipse cx="28" cy="30" rx="6" ry="6" fill="#fff7ed" />
      {/* Eyes – slightly narrower/angular */}
      <ellipse cx="24.5" cy="28.5" rx="1.8" ry="1.2" fill="#1e1b4b" />
      <ellipse cx="31.5" cy="28.5" rx="1.8" ry="1.2" fill="#1e1b4b" />
      {/* Nose – small triangle */}
      <polygon points="28,31 26.8,32.5 29.2,32.5" fill="#f9a8d4" />
      {/* Mouth – "w" cat mouth */}
      <path d="M25.5 33.5 Q27 32.5 28 33.5 Q29 32.5 30.5 33.5" stroke="#1e1b4b" strokeWidth="0.8" fill="none" />
      {/* Whiskers – left */}
      <line x1="17" y1="30" x2="23" y2="31" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="17" y1="32" x2="23" y2="32" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="17" y1="34" x2="23" y2="33" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      {/* Whiskers – right */}
      <line x1="39" y1="30" x2="33" y2="31" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="39" y1="32" x2="33" y2="32" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      <line x1="39" y1="34" x2="33" y2="33" stroke="#1e1b4b" strokeWidth="0.5" opacity="0.6" />
      {/* Ears – triangular pointy cat ears */}
      <polygon points="18,22 14,4 26,18" fill="#fde8cd" stroke="#e8c9a0" strokeWidth="1" />
      <polygon points="19,20 16,8 24,18" fill="#f9a8d4" opacity="0.5" />
      <polygon points="38,22 42,4 30,18" fill="#fde8cd" stroke="#e8c9a0" strokeWidth="1" />
      <polygon points="37,20 40,8 32,18" fill="#f9a8d4" opacity="0.5" />
      {/* Wings */}
      <path d="M10 42 Q2 38 6 30 L14 36Z" fill="#fbbf24" opacity="0.7" />
      <path d="M46 42 Q54 38 50 30 L42 36Z" fill="#fbbf24" opacity="0.7" />
      <defs>
        <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const ShipPreview = ({ type }) => {
  const Ship = type === "bunny" ? BunnyShip : CatShip;
  return (
    <div style={{ position: "relative", width: 56, height: 64, margin: "0 auto" }}>
      <Ship x={28} wiggle={false} />
    </div>
  );
};

export default function Game() {
  const [screen, setScreen] = useState("menu");
  const [character, setCharacter] = useState(null);
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState(null);
  const [leftAnswer, setLeftAnswer] = useState(0);
  const [rightAnswer, setRightAnswer] = useState(0);
  const [shipX, setShipX] = useState(W / 2);
  const [phase, setPhase] = useState("waiting");
  const [correct, setCorrect] = useState(null);
  const [gateY, setGateY] = useState(-200);
  const [mistakes, setMistakes] = useState(0);
  const [results, setResults] = useState([]);
  const [streak, setStreak] = useState(0);
  const animRef = useRef(null);

  const Ship = character === "cat" ? CatShip : BunnyShip;

  const setupRound = useCallback(() => {
    const p = mulProblem();
    const w = wrongAnswer(p.answer);
    const correctLeft = Math.random() > 0.5;
    setProblem(p);
    setLeftAnswer(correctLeft ? p.answer : w);
    setRightAnswer(correctLeft ? w : p.answer);
    setShipX(W / 2);
    setPhase("approaching");
    setCorrect(null);
    setGateY(-200);

    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / 1800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setGateY(-200 + eased * (H / 2 - 40 + 200));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("choosing");
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, []);

  const startGame = () => {
    setScreen("charSelect");
  };

  const selectCharacter = (char) => {
    setCharacter(char);
    setScreen("game");
    setLevel(1);
    setRound(0);
    setScore(0);
    setMistakes(0);
    setResults([]);
    setStreak(0);
    setTimeout(() => setRound(1), 300);
  };

  useEffect(() => {
    if (screen === "game" && round > 0 && round <= 10) {
      setupRound();
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [round, screen, setupRound]);

  const choose = (side) => {
    if (phase !== "choosing") return;
    setPhase("flying");
    const targetX = side === "left" ? W * 0.25 : W * 0.75;
    const chosen = side === "left" ? leftAnswer : rightAnswer;
    const isCorrect = chosen === problem.answer;
    setShipX(targetX);
    setCorrect(isCorrect);

    setTimeout(() => {
      setPhase("result");
      if (isCorrect) {
        const bonus = streak >= 2 ? 5 : 0;
        setScore((s) => s + 10 + bonus);
        setStreak((s) => s + 1);
      } else {
        setMistakes((m) => m + 1);
        setStreak(0);
      }
      setResults((r) => [...r, isCorrect]);
      setTimeout(() => {
        if (round >= 10) {
          setScreen("levelComplete");
        } else {
          setRound((r) => r + 1);
        }
      }, 1200);
    }, 500);
  };

  const nextLevel = () => {
    setLevel((l) => l + 1);
    setRound(0);
    setResults([]);
    setMistakes(0);
    setStreak(0);
    setScreen("game");
    setTimeout(() => setRound(1), 300);
  };

  const css = `
    @keyframes starDrift { 0% { transform: translateY(0); } 100% { transform: translateY(100vh); } }
    @keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    @keyframes gateGlow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(168,130,255,0.3)); } 50% { filter: drop-shadow(0 0 16px rgba(168,130,255,0.6)); } }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes popIn { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
  `;

  if (screen === "menu") {
    return (
      <div style={st.wrapper}>
        <style>{css}</style>
        <div style={st.scene}>
          <Stars />
          <div style={{ position: "absolute", top: "12%", width: "100%", textAlign: "center", zIndex: 5 }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: 6, color: "#a78bfa", marginBottom: 8, fontWeight: 600 }}>🚀 WELTRAUM</div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#f5f0ff", margin: 0, letterSpacing: 3, textShadow: "0 0 30px rgba(168,130,255,0.5)" }}>HASEN</h1>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#c4b5fd", margin: "-4px 0 0", letterSpacing: 3, textShadow: "0 0 30px rgba(168,130,255,0.3)" }}>MATHE</h1>
          </div>
          <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
            <BunnyShip x={28} wiggle={false} />
          </div>
          <div style={{ position: "absolute", bottom: "18%", width: "100%", textAlign: "center", zIndex: 5 }}>
            <div style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.8, marginBottom: 28 }}>
              Fliege durch das richtige Tor!<br />Löse 10 Multiplikationen pro Level.
            </div>
            <button onClick={startGame} style={st.mainBtn}>🚀 START</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "charSelect") {
    return (
      <div style={st.wrapper}>
        <style>{css}</style>
        <div style={st.scene}>
          <Stars />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, padding: 24 }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: 4, color: "#a78bfa", marginBottom: 8, fontWeight: 600, animation: "slideUp 0.4s ease" }}>WÄHLE DEINEN</div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f5f0ff", marginBottom: 36, animation: "slideUp 0.5s ease", textShadow: "0 0 20px rgba(168,130,255,0.4)" }}>CHARAKTER</h2>
            <div style={{ display: "flex", gap: 24, animation: "slideUp 0.6s ease" }}>
              {/* Bunny option */}
              <div
                onClick={() => selectCharacter("bunny")}
                style={{
                  cursor: "pointer",
                  background: "rgba(168,130,255,0.08)",
                  border: "2px solid rgba(168,130,255,0.25)",
                  borderRadius: 18,
                  padding: "24px 20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.3s",
                  width: 140,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(168,130,255,0.6)";
                  e.currentTarget.style.background = "rgba(168,130,255,0.15)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(168,130,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(168,130,255,0.25)";
                  e.currentTarget.style.background = "rgba(168,130,255,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ animation: "float 2s ease-in-out infinite" }}>
                  <ShipPreview type="bunny" />
                </div>
                <div style={{ color: "#d8d0f0", fontSize: "0.85rem", fontWeight: 700, letterSpacing: 1 }}>HASE</div>
                <div style={{ color: "#64748b", fontSize: "0.65rem" }}>Raumschiffhase</div>
              </div>
              {/* Cat option */}
              <div
                onClick={() => selectCharacter("cat")}
                style={{
                  cursor: "pointer",
                  background: "rgba(251,191,36,0.08)",
                  border: "2px solid rgba(251,191,36,0.25)",
                  borderRadius: 18,
                  padding: "24px 20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.3s",
                  width: 140,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(251,191,36,0.6)";
                  e.currentTarget.style.background = "rgba(251,191,36,0.15)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(251,191,36,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(251,191,36,0.25)";
                  e.currentTarget.style.background = "rgba(251,191,36,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ animation: "float 2s ease-in-out infinite", animationDelay: "0.3s" }}>
                  <ShipPreview type="cat" />
                </div>
                <div style={{ color: "#fde8cd", fontSize: "0.85rem", fontWeight: 700, letterSpacing: 1 }}>KATZE</div>
                <div style={{ color: "#64748b", fontSize: "0.65rem" }}>Raumschiffkatze</div>
              </div>
            </div>
            <button onClick={() => setScreen("menu")} style={{ marginTop: 32, background: "none", border: "none", color: "#64748b", fontSize: "0.75rem", cursor: "pointer", letterSpacing: 2, fontFamily: "inherit" }}>← ZURÜCK</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "levelComplete") {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    return (
      <div style={st.wrapper}>
        <style>{css}</style>
        <div style={st.scene}>
          <Stars />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, padding: 24 }}>
            <div style={{ fontSize: "0.8rem", color: "#a78bfa", letterSpacing: 4, marginBottom: 8, animation: "slideUp 0.5s ease" }}>LEVEL {level}</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f5f0ff", marginBottom: 20, animation: "slideUp 0.6s ease", textShadow: "0 0 20px rgba(168,130,255,0.4)" }}>GESCHAFFT!</h2>
            <div style={{ fontSize: "2.2rem", marginBottom: 16, animation: "popIn 0.8s ease" }}>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12, animation: "slideUp 0.7s ease" }}>
              {results.map((r, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: r ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #ef4444, #dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#fff", fontWeight: 700, boxShadow: r ? "0 2px 8px rgba(34,197,94,0.4)" : "0 2px 8px rgba(239,68,68,0.4)" }}>
                  {r ? "✓" : "✗"}
                </div>
              ))}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: 8, animation: "slideUp 0.8s ease" }}>Punkte: <span style={{ color: "#facc15", fontWeight: 700 }}>{score}</span></div>
            <div style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: 28, animation: "slideUp 0.85s ease" }}>{mistakes === 0 ? "Perfekt! Kein einziger Fehler!" : `${10 - mistakes}/10 richtig`}</div>
            <div style={{ display: "flex", gap: 12, animation: "slideUp 0.9s ease" }}>
              <button onClick={nextLevel} style={st.mainBtn}>Nächstes Level →</button>
              <button onClick={() => setScreen("menu")} style={{ ...st.mainBtn, background: "rgba(255,255,255,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>Menü</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={st.wrapper}>
      <style>{css}</style>
      <div style={st.scene}>
        <Stars count={40} />
        <div style={st.hud}>
          <div style={st.hudBlock}><span style={st.hudLabel}>LEVEL</span><span style={st.hudVal}>{level}</span></div>
          <div style={st.hudBlock}><span style={st.hudLabel}>RUNDE</span><span style={st.hudVal}>{round}/10</span></div>
          <div style={st.hudBlock}><span style={st.hudLabel}>PUNKTE</span><span style={{ ...st.hudVal, color: "#facc15" }}>{score}</span></div>
          <div style={st.hudBlock}><span style={st.hudLabel}>STREAK</span><span style={{ ...st.hudVal, color: streak >= 3 ? "#f97316" : "#94a3b8" }}>{streak >= 2 ? "🔥" : ""}{streak}</span></div>
        </div>
        <div style={{ position: "absolute", top: 48, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 5 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < results.length ? results[i] ? "#22c55e" : "#ef4444" : i === round - 1 ? "#a78bfa" : "rgba(255,255,255,0.15)", transition: "background 0.3s", boxShadow: i === round - 1 ? "0 0 8px rgba(168,130,255,0.6)" : "none" }} />
          ))}
        </div>
        {problem && (
          <div style={{ position: "absolute", top: gateY, left: 0, right: 0, zIndex: 4, animation: "gateGlow 2s ease-in-out infinite" }}>
            <div style={st.wall} />
            <div style={{ display: "flex", height: 100, position: "relative" }}>
              <div onClick={() => choose("left")} style={{ ...st.passage, cursor: phase === "choosing" ? "pointer" : "default", borderRight: "3px solid #2d2066", background: correct !== null && leftAnswer === problem.answer ? "rgba(34,197,94,0.15)" : correct !== null && leftAnswer !== problem.answer ? "rgba(239,68,68,0.1)" : "rgba(99,50,200,0.05)" }}>
                <span style={{ ...st.answerText, color: correct !== null && leftAnswer === problem.answer ? "#22c55e" : correct !== null ? "#ef4444" : "#e2e8f0" }}>{leftAnswer}</span>
                {correct !== null && leftAnswer === problem.answer && <span style={{ position: "absolute", top: 8, right: 8, fontSize: "1rem" }}>✓</span>}
              </div>
              <div style={st.centerDivider}>
                <div style={st.questionBubble}><span style={st.questionText}>{problem.a} × {problem.b}</span></div>
              </div>
              <div onClick={() => choose("right")} style={{ ...st.passage, cursor: phase === "choosing" ? "pointer" : "default", borderLeft: "3px solid #2d2066", background: correct !== null && rightAnswer === problem.answer ? "rgba(34,197,94,0.15)" : correct !== null && rightAnswer !== problem.answer ? "rgba(239,68,68,0.1)" : "rgba(99,50,200,0.05)" }}>
                <span style={{ ...st.answerText, color: correct !== null && rightAnswer === problem.answer ? "#22c55e" : correct !== null ? "#ef4444" : "#e2e8f0" }}>{rightAnswer}</span>
                {correct !== null && rightAnswer === problem.answer && <span style={{ position: "absolute", top: 8, left: 8, fontSize: "1rem" }}>✓</span>}
              </div>
            </div>
            <div style={st.wall} />
          </div>
        )}
        {phase === "result" && (
          <div style={{ position: "absolute", bottom: 150, left: "50%", transform: "translateX(-50%)", zIndex: 20, animation: "popIn 0.4s ease", fontSize: "1.4rem", fontWeight: 800, color: correct ? "#22c55e" : "#ef4444", textShadow: correct ? "0 0 20px rgba(34,197,94,0.5)" : "0 0 20px rgba(239,68,68,0.5)", letterSpacing: 2 }}>
            {correct ? (streak >= 3 ? "🔥 SUPER!" : "RICHTIG!") : "FALSCH!"}
          </div>
        )}
        <Ship x={shipX} wiggle={phase === "flying"} />
        {phase === "choosing" && (
          <>
            <div onClick={() => choose("left")} style={{ ...st.tapZone, left: 0 }}><div style={st.tapHint}>◀ LINKS</div></div>
            <div onClick={() => choose("right")} style={{ ...st.tapZone, right: 0 }}><div style={st.tapHint}>RECHTS ▶</div></div>
          </>
        )}
      </div>
    </div>
  );
}

const st = {
  wrapper: { width: "100%", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#050816", fontFamily: "'SF Pro Rounded', 'Nunito', system-ui, sans-serif", padding: 12, boxSizing: "border-box" },
  scene: { position: "relative", width: W, maxWidth: "100%", height: H, background: "linear-gradient(180deg, #070b1e 0%, #0d1333 40%, #131a44 100%)", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(168,130,255,0.12)", boxShadow: "0 0 60px rgba(100,60,200,0.1), inset 0 0 80px rgba(10,5,30,0.5)" },
  hud: { position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", zIndex: 20 },
  hudBlock: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(0,0,0,0.35)", borderRadius: 10, padding: "4px 10px", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.05)" },
  hudLabel: { fontSize: "0.5rem", color: "#64748b", letterSpacing: 2, fontWeight: 600 },
  hudVal: { fontSize: "0.9rem", color: "#e2e8f0", fontWeight: 800 },
  wall: { height: 12, background: "linear-gradient(90deg, #2d1b69, #4c2885, #2d1b69)", borderTop: "2px solid #7c3aed", borderBottom: "2px solid #7c3aed", boxShadow: "0 0 12px rgba(124,58,237,0.3)" },
  passage: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "background 0.3s" },
  centerDivider: { width: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #1a0f3d, #2d1b69)", position: "relative" },
  questionBubble: { background: "linear-gradient(135deg, #4c2885, #6d3bc4)", borderRadius: 12, padding: "8px 12px", boxShadow: "0 0 20px rgba(124,58,237,0.5)", border: "1px solid rgba(168,130,255,0.3)" },
  questionText: { color: "#f5f0ff", fontSize: "0.95rem", fontWeight: 800, whiteSpace: "nowrap", letterSpacing: 1 },
  answerText: { fontSize: "1.8rem", fontWeight: 900, transition: "color 0.3s, transform 0.3s", textShadow: "0 2px 8px rgba(0,0,0,0.3)" },
  tapZone: { position: "absolute", bottom: 0, width: "50%", height: "40%", zIndex: 15, cursor: "pointer", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 16 },
  tapHint: { color: "rgba(168,130,255,0.5)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: 3, animation: "pulse 2s ease-in-out infinite", padding: "6px 16px", borderRadius: 8, background: "rgba(168,130,255,0.08)", border: "1px solid rgba(168,130,255,0.15)" },
  mainBtn: { background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", padding: "14px 36px", fontSize: "1rem", fontWeight: 800, borderRadius: 14, cursor: "pointer", letterSpacing: 2, boxShadow: "0 4px 24px rgba(124,58,237,0.4)", fontFamily: "inherit" },
};
