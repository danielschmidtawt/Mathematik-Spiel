import { useRef } from "react";

export default function Stars({ count = 60 }) {
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
