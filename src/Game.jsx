import { useState, useEffect, useRef, useCallback } from "react";
import { W, H, css, st } from "./styles";
import { generateProblem, wrongAnswer } from "./problems";
import { loadProgress, saveProgress, getCharData, updateCharData } from "./storage";
import AudioManager from "./audio";
import Stars from "./components/Stars";
import { MenuScreen, CharSelectScreen, LevelCompleteScreen, LevelFailedScreen, LivesDisplay } from "./components/screens";
import LevelMap from "./components/LevelMap";
import UpgradeScene from "./components/UpgradeScene";
import ShipWithUpgrades from "./ships/ShipWithUpgrades";

export default function Game() {
  // ─── Persistent state (localStorage) ──────────────────
  const [saveData, setSaveData] = useState(() => loadProgress());

  // ─── Screen & navigation ──────────────────────────────
  const [screen, setScreen] = useState("menu");
  const [character, setCharacter] = useState(saveData.lastCharacter);

  // ─── Game state ───────────────────────────────────────
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
  const [lives, setLives] = useState(2);
  const [damaged, setDamaged] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(saveData.audioEnabled !== false);
  const [unlockingLevel, setUnlockingLevel] = useState(null);
  const [upgradeTier, setUpgradeTier] = useState(null);
  const animRef = useRef(null);

  // Sync audio enabled state
  useEffect(() => {
    AudioManager.enabled = audioEnabled;
  }, [audioEnabled]);

  // ─── Derived data ─────────────────────────────────────
  const charData = character ? getCharData(saveData, character) : null;
  const hasSave = saveData.lastCharacter && getCharData(saveData, saveData.lastCharacter).unlockedLevel > 1;

  // ─── Round setup ──────────────────────────────────────
  const setupRound = useCallback(() => {
    const p = generateProblem(level);
    const w = wrongAnswer(p.answer, level);
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
  }, [level]);

  useEffect(() => {
    if (screen === "game" && round > 0 && round <= 10) {
      setupRound();
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [round, screen, setupRound]);

  // Start ambient when game starts
  useEffect(() => {
    if (screen === "game") {
      AudioManager.startAmbient();
    } else {
      AudioManager.stopAmbient();
    }
  }, [screen]);

  // ─── Actions ──────────────────────────────────────────
  const startNewGame = () => setScreen("charSelect");

  const continueGame = () => {
    const char = saveData.lastCharacter;
    if (char) {
      setCharacter(char);
      setScreen("map");
    }
  };

  const selectCharacter = (char) => {
    AudioManager.init();
    setCharacter(char);
    const newSave = { ...saveData, lastCharacter: char };
    setSaveData(newSave);
    saveProgress(newSave);
    setScreen("map");
  };

  const startLevel = (lvl) => {
    // Check if entering a new upgrade tier
    const currentTier = Math.ceil(lvl / 5);
    const charD = getCharData(saveData, character);
    const previousHighest = charD.starsPerLevel.reduce((max, s, i) => s > 0 ? i + 1 : max, 0);
    const previousTier = previousHighest > 0 ? Math.ceil(previousHighest / 5) : 1;

    if (currentTier > 1 && currentTier > previousTier && lvl === (currentTier - 1) * 5 + 1) {
      setUpgradeTier(currentTier);
      setLevel(lvl);
      setScreen("upgradeScene");
      return;
    }

    beginLevel(lvl);
  };

  const beginLevel = (lvl) => {
    setLevel(lvl);
    setRound(0);
    setScore(0);
    setMistakes(0);
    setResults([]);
    setStreak(0);
    setLives(2);
    setDamaged(false);
    setScreen("game");
    setTimeout(() => setRound(1), 300);
  };

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
        AudioManager.playCorrect();
        const bonus = streak >= 2 ? 5 : 0;
        setScore((s) => s + 10 + bonus);
        setStreak((s) => s + 1);
      } else {
        AudioManager.playWrong();
        setMistakes((m) => m + 1);
        setStreak(0);
        setLives((l) => {
          const newLives = l - 1;
          if (newLives <= 0) {
            // Level failed — will be checked after result display
            setTimeout(() => {
              AudioManager.playLevelFailed();
              setScreen("levelFailed");
            }, 1200);
          }
          return newLives;
        });
        setDamaged(true);
        setTimeout(() => setDamaged(false), 600);
      }
      setResults((r) => [...r, isCorrect]);

      // Only continue if still alive
      setTimeout(() => {
        setLives((currentLives) => {
          if (currentLives <= 0) return currentLives; // Already handled
          if (round >= 10) {
            completeLevel();
          } else {
            setRound((r) => r + 1);
          }
          return currentLives;
        });
      }, 1200);
    }, 500);
  };

  const completeLevel = () => {
    AudioManager.playLevelComplete();
    const stars = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
    const charD = getCharData(saveData, character);
    const newStars = [...charD.starsPerLevel];
    newStars[level - 1] = Math.max(newStars[level - 1], stars);
    const newUnlocked = Math.max(charD.unlockedLevel, level + 1);
    const shouldUnlock = newUnlocked > charD.unlockedLevel && level < 25;

    const newSave = updateCharData(saveData, character, {
      starsPerLevel: newStars,
      unlockedLevel: Math.min(newUnlocked, 26),
      totalScore: charD.totalScore + score,
    });
    setSaveData(newSave);

    if (shouldUnlock) {
      setUnlockingLevel(level + 1);
    }
    setScreen("levelComplete");
  };

  const goToMap = () => {
    setScreen("map");
    // Clear unlock animation after delay
    if (unlockingLevel) {
      setTimeout(() => setUnlockingLevel(null), 2000);
    }
  };

  const retryLevel = () => {
    beginLevel(level);
  };

  const toggleAudio = () => {
    const newVal = AudioManager.toggle();
    setAudioEnabled(newVal);
    const newSave = { ...saveData, audioEnabled: newVal };
    setSaveData(newSave);
    saveProgress(newSave);
  };

  // ─── Render ───────────────────────────────────────────

  if (screen === "menu") {
    return (
      <>
        <style>{css}</style>
        <MenuScreen onStart={startNewGame} onContinue={continueGame} hasSave={hasSave} />
      </>
    );
  }

  if (screen === "charSelect") {
    return (
      <>
        <style>{css}</style>
        <CharSelectScreen onSelect={selectCharacter} onBack={() => setScreen("menu")} saveData={saveData} />
      </>
    );
  }

  if (screen === "map") {
    const cd = getCharData(saveData, character);
    return (
      <>
        <style>{css}</style>
        <LevelMap
          starsPerLevel={cd.starsPerLevel}
          unlockedLevel={cd.unlockedLevel}
          character={character}
          onSelectLevel={startLevel}
          onMenu={() => setScreen("menu")}
          unlockingLevel={unlockingLevel}
        />
      </>
    );
  }

  if (screen === "upgradeScene") {
    return (
      <>
        <style>{css}</style>
        <UpgradeScene
          character={character}
          tier={upgradeTier}
          onContinue={() => beginLevel(level)}
        />
      </>
    );
  }

  if (screen === "levelComplete") {
    return (
      <>
        <style>{css}</style>
        <LevelCompleteScreen
          level={level}
          score={score}
          mistakes={mistakes}
          results={results}
          onMap={goToMap}
        />
      </>
    );
  }

  if (screen === "levelFailed") {
    return (
      <>
        <style>{css}</style>
        <LevelFailedScreen
          level={level}
          onRetry={retryLevel}
          onMap={() => { setUnlockingLevel(null); setScreen("map"); }}
        />
      </>
    );
  }

  // ─── Game Screen ──────────────────────────────────────
  return (
    <div style={st.wrapper}>
      <style>{css}</style>
      <div style={st.scene}>
        <Stars count={40} />

        {/* HUD */}
        <div style={st.hud}>
          <div style={st.hudBlock}>
            <span style={st.hudLabel}>LEVEL</span>
            <span style={st.hudVal}>{level}</span>
          </div>
          <div style={st.hudBlock}>
            <span style={st.hudLabel}>RUNDE</span>
            <span style={st.hudVal}>{round}/10</span>
          </div>
          <div style={st.hudBlock}>
            <span style={st.hudLabel}>LEBEN</span>
            <LivesDisplay lives={lives} damaged={damaged} />
          </div>
          <div style={st.hudBlock}>
            <span style={st.hudLabel}>PUNKTE</span>
            <span style={{ ...st.hudVal, color: "#facc15" }}>{score}</span>
          </div>
          <div style={{ ...st.hudBlock, cursor: "pointer", padding: "4px 6px" }} onClick={toggleAudio}>
            <span style={{ fontSize: "0.9rem" }}>{audioEnabled ? "🔊" : "🔇"}</span>
          </div>
        </div>

        {/* Round progress dots */}
        <div style={{ position: "absolute", top: 48, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 5 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i < results.length
                ? results[i] ? "#22c55e" : "#ef4444"
                : i === round - 1 ? "#a78bfa" : "rgba(255,255,255,0.15)",
              transition: "background 0.3s",
              boxShadow: i === round - 1 ? "0 0 8px rgba(168,130,255,0.6)" : "none",
            }} />
          ))}
        </div>

        {/* Streak indicator */}
        {streak >= 2 && (
          <div style={{
            position: "absolute", top: 62, left: "50%", transform: "translateX(-50%)",
            color: streak >= 3 ? "#f97316" : "#a78bfa",
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: 2, zIndex: 5,
          }}>
            🔥 STREAK {streak}
          </div>
        )}

        {/* Gate with answers */}
        {problem && (
          <div style={{ position: "absolute", top: gateY, left: 0, right: 0, zIndex: 4, animation: "gateGlow 2s ease-in-out infinite" }}>
            <div style={st.wall} />
            <div style={{ display: "flex", height: 100, position: "relative" }}>
              <div onClick={() => choose("left")} style={{
                ...st.passage,
                cursor: phase === "choosing" ? "pointer" : "default",
                borderRight: "3px solid #2d2066",
                background: correct !== null && leftAnswer === problem.answer
                  ? "rgba(34,197,94,0.15)"
                  : correct !== null && leftAnswer !== problem.answer
                    ? "rgba(239,68,68,0.1)"
                    : "rgba(99,50,200,0.05)",
              }}>
                <span style={{
                  ...st.answerText,
                  color: correct !== null && leftAnswer === problem.answer ? "#22c55e"
                    : correct !== null ? "#ef4444" : "#e2e8f0",
                }}>{leftAnswer}</span>
                {correct !== null && leftAnswer === problem.answer && (
                  <span style={{ position: "absolute", top: 8, right: 8, fontSize: "1rem" }}>✓</span>
                )}
              </div>
              <div style={st.centerDivider}>
                <div style={st.questionBubble}>
                  <span style={st.questionText}>{problem.text}</span>
                </div>
              </div>
              <div onClick={() => choose("right")} style={{
                ...st.passage,
                cursor: phase === "choosing" ? "pointer" : "default",
                borderLeft: "3px solid #2d2066",
                background: correct !== null && rightAnswer === problem.answer
                  ? "rgba(34,197,94,0.15)"
                  : correct !== null && rightAnswer !== problem.answer
                    ? "rgba(239,68,68,0.1)"
                    : "rgba(99,50,200,0.05)",
              }}>
                <span style={{
                  ...st.answerText,
                  color: correct !== null && rightAnswer === problem.answer ? "#22c55e"
                    : correct !== null ? "#ef4444" : "#e2e8f0",
                }}>{rightAnswer}</span>
                {correct !== null && rightAnswer === problem.answer && (
                  <span style={{ position: "absolute", top: 8, left: 8, fontSize: "1rem" }}>✓</span>
                )}
              </div>
            </div>
            <div style={st.wall} />
          </div>
        )}

        {/* Result feedback */}
        {phase === "result" && (
          <div style={{
            position: "absolute", bottom: 150, left: "50%", transform: "translateX(-50%)",
            zIndex: 20, animation: "popIn 0.4s ease",
            fontSize: "1.4rem", fontWeight: 800, letterSpacing: 2,
            color: correct ? "#22c55e" : "#ef4444",
            textShadow: correct ? "0 0 20px rgba(34,197,94,0.5)" : "0 0 20px rgba(239,68,68,0.5)",
          }}>
            {correct ? (streak >= 3 ? "🔥 SUPER!" : "RICHTIG!") : "FALSCH!"}
          </div>
        )}

        {/* Ship */}
        <ShipWithUpgrades character={character} level={level} x={shipX} wiggle={phase === "flying"} />

        {/* Tap zones */}
        {phase === "choosing" && (
          <>
            <div onClick={() => choose("left")} style={{ ...st.tapZone, left: 0 }}>
              <div style={st.tapHint}>◀ LINKS</div>
            </div>
            <div onClick={() => choose("right")} style={{ ...st.tapZone, right: 0 }}>
              <div style={st.tapHint}>RECHTS ▶</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
