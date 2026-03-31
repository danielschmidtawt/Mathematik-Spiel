import { useState, useEffect, useRef } from "react";
import Stars from "./Stars";
import { ShipPreview } from "../ships/ShipWithUpgrades";
import { st, UPGRADE_NAMES } from "../styles";
import AudioManager from "../audio";

// Particles that fly outward from center
function UpgradeParticles() {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 80 + Math.random() * 40;
      return {
        px: Math.cos(angle) * dist,
        py: Math.sin(angle) * dist,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.3,
        color: ["#fbbf24", "#a78bfa", "#22d3ee", "#f97316", "#22c55e"][i % 5],
      };
    })
  );

  return (
    <>
      {particles.current.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            "--px": `${p.px}px`,
            "--py": `${p.py}px`,
            animation: `particleFly 1.2s ${p.delay}s ease-out forwards`,
            pointerEvents: "none",
            zIndex: 12,
          }}
        />
      ))}
    </>
  );
}

export default function UpgradeScene({ character, tier, onContinue }) {
  const [phase, setPhase] = useState("intro"); // intro -> burst -> reveal -> ready
  const upgradeName = UPGRADE_NAMES[tier - 1] || "NEUES UPGRADE!";

  useEffect(() => {
    AudioManager.playPowerUp();

    const t1 = setTimeout(() => setPhase("burst"), 800);
    const t2 = setTimeout(() => {
      setPhase("reveal");
      AudioManager.playLevelComplete();
    }, 1600);
    const t3 = setTimeout(() => setPhase("ready"), 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={st.wrapper}>
      <div style={st.scene}>
        <Stars count={40} />

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 5,
        }}>
          {/* Title */}
          <div style={{
            fontSize: "0.65rem", letterSpacing: 4,
            marginBottom: 6, fontWeight: 700,
            background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "slideUp 0.5s ease",
          }}>
            TIER {tier}
          </div>

          {/* Gold line above */}
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #fbbf24, transparent)", marginBottom: 8 }} />

          <h2 style={{
            fontSize: "1.8rem", fontWeight: 900,
            marginBottom: 8,
            animation: phase === "intro" ? "popIn 0.8s ease" : "none",
            letterSpacing: 4,
            background: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(251,191,36,0.4))",
          }}>
            UPGRADE!
          </h2>

          {/* Gold line below */}
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #fbbf24, transparent)", marginBottom: 20 }} />

          {/* Ship area with hex frame */}
          <div style={{ position: "relative", width: 120, height: 120, marginBottom: 20 }}>
            {/* Hexagonal frame */}
            <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} viewBox="0 0 120 120" width="120" height="120">
              <polygon points="60,5 110,30 110,90 60,115 10,90 10,30"
                fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
              </polygon>
              <polygon points="60,12 104,34 104,86 60,108 16,86 16,34"
                fill="none" stroke="rgba(251,191,36,0.15)" strokeWidth="0.8" />
            </svg>
            {/* Light burst */}
            {(phase === "burst" || phase === "reveal") && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 40, height: 40,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(251,191,36,0.8) 0%, rgba(168,130,255,0.4) 40%, transparent 70%)",
                animation: "upgradeGlow 1.2s ease-out forwards",
                zIndex: 11,
              }} />
            )}

            {/* Particles */}
            {phase === "burst" && <UpgradeParticles />}

            {/* Ship */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%) scale(1.3)",
              opacity: phase === "burst" ? 0.5 : 1,
              transition: "opacity 0.3s",
              animation: phase === "reveal" || phase === "ready" ? "float 2s ease-in-out infinite" : "none",
            }}>
              <ShipPreview type={character} />
            </div>
          </div>

          {/* Upgrade name */}
          {(phase === "reveal" || phase === "ready") && (
            <div style={{
              color: "#fbbf24", fontSize: "0.85rem", fontWeight: 700,
              letterSpacing: 2, marginBottom: 8,
              animation: "slideUp 0.5s ease",
              textAlign: "center",
              textShadow: "0 0 15px rgba(251,191,36,0.4)",
            }}>
              {upgradeName}
            </div>
          )}

          {/* Tier description */}
          {(phase === "reveal" || phase === "ready") && (
            <div style={{
              color: "#94a3b8", fontSize: "0.7rem",
              animation: "slideUp 0.6s ease",
              marginBottom: 24,
            }}>
              {tier === 2 && "Dein Schiff hat jetzt einen Energieschild!"}
              {tier === 3 && "Neue Turbo-Flügel für mehr Geschwindigkeit!"}
              {tier === 4 && "Du bist jetzt ein Weltraum-Kommandant!"}
              {tier === 5 && "Maximale Energie erreicht!"}
            </div>
          )}

          {/* Continue button */}
          {phase === "ready" && (
            <button onClick={onContinue} style={{ ...st.mainBtn, animation: "slideUp 0.5s ease" }}>
              WEITER →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
