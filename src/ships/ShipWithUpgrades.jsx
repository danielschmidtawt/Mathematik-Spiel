import BunnyShip from "./BunnyShip";
import CatShip from "./CatShip";
import DogShip from "./DogShip";
import RaccoonShip from "./RaccoonShip";

const SHIPS = { bunny: BunnyShip, cat: CatShip, dog: DogShip, raccoon: RaccoonShip };

// Shield glow ring (tier 2, levels 6-10+)
const ShieldGlow = () => (
  <svg style={{ position: "absolute", top: -6, left: -6, pointerEvents: "none" }}
    viewBox="0 0 68 76" width="68" height="76">
    <ellipse cx="34" cy="46" rx="30" ry="34" fill="none"
      stroke="rgba(100,200,255,0.4)" strokeWidth="2">
      <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="34" cy="46" rx="28" ry="32" fill="none"
      stroke="rgba(100,200,255,0.15)" strokeWidth="1" />
  </svg>
);

// Extended wings (tier 3, levels 11-15+)
const WingExtensions = ({ color }) => (
  <svg style={{ position: "absolute", top: 0, left: -8, pointerEvents: "none" }}
    viewBox="0 0 72 76" width="72" height="76">
    <path d="M8 48 Q-4 42 2 28 L12 36Z" fill={color} opacity="0.5" />
    <path d="M64 48 Q76 42 70 28 L60 36Z" fill={color} opacity="0.5" />
    <path d="M6 44 Q-2 40 3 32 L10 38Z" fill={color} opacity="0.3" />
    <path d="M66 44 Q74 40 69 32 L62 38Z" fill={color} opacity="0.3" />
  </svg>
);

// Crown (tier 4, levels 16-20+)
const CrownHelmet = () => (
  <svg style={{ position: "absolute", top: -2, left: 6, pointerEvents: "none" }}
    viewBox="0 0 44 20" width="44" height="20">
    <polygon points="8,18 4,6 12,12 22,2 32,12 40,6 36,18"
      fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
    <circle cx="12" cy="12" r="1.5" fill="#ef4444" />
    <circle cx="22" cy="4" r="1.5" fill="#3b82f6" />
    <circle cx="32" cy="12" r="1.5" fill="#22c55e" />
    <polygon points="8,18 4,6 12,12 22,2 32,12 40,6 36,18"
      fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.5">
      <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
    </polygon>
  </svg>
);

// Golden rainbow aura (tier 5, levels 21-25)
const GoldenAura = () => (
  <div style={{
    position: "absolute", top: -10, left: -10,
    width: 76, height: 84,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(168,130,255,0.15) 50%, transparent 70%)",
    animation: "rainbowShift 3s linear infinite",
    pointerEvents: "none",
  }} />
);

const WING_COLORS = {
  bunny: "#a78bfa",
  cat: "#fbbf24",
  dog: "#d97706",
  raccoon: "#9ca3af",
};

export default function ShipWithUpgrades({ character, level, x, wiggle }) {
  const Ship = SHIPS[character] || BunnyShip;
  const tier = Math.min(Math.ceil(level / 5), 5);

  if (tier <= 1) {
    return <Ship x={x} wiggle={wiggle} />;
  }

  return (
    <div style={{
      position: "absolute",
      bottom: 60,
      left: x - 38,
      width: 76,
      height: 84,
      zIndex: 10,
      transition: "left 0.4s cubic-bezier(.34,1.56,.64,1)",
    }}>
      {tier >= 5 && <GoldenAura />}
      {tier >= 2 && <ShieldGlow />}
      {tier >= 4 && <CrownHelmet />}
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <Ship x={28} wiggle={wiggle} style={{ position: "relative", bottom: "auto", left: "auto" }} />
      </div>
      {tier >= 3 && <WingExtensions color={WING_COLORS[character] || "#a78bfa"} />}
    </div>
  );
}

// For previews (map, charSelect)
export function ShipPreview({ type }) {
  const Ship = SHIPS[type] || BunnyShip;
  return (
    <div style={{ position: "relative", width: 56, height: 64, margin: "0 auto" }}>
      <Ship x={28} wiggle={false} style={{ position: "relative", bottom: "auto", left: "auto" }} />
    </div>
  );
}
