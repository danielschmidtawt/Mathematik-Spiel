// localStorage persistence with per-character save data

const SAVE_KEY = "spaceMathSave";

const DEFAULT_CHAR_DATA = () => ({
  unlockedLevel: 1,
  starsPerLevel: Array(25).fill(0),
  totalScore: 0,
});

const DEFAULT_SAVE = () => ({
  version: 1,
  lastCharacter: null,
  audioEnabled: true,
  characters: {
    bunny: DEFAULT_CHAR_DATA(),
    cat: DEFAULT_CHAR_DATA(),
    dog: DEFAULT_CHAR_DATA(),
    raccoon: DEFAULT_CHAR_DATA(),
  },
});

export function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return DEFAULT_SAVE();
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return DEFAULT_SAVE();
    // Ensure all characters exist
    const chars = ["bunny", "cat", "dog", "raccoon"];
    for (const c of chars) {
      if (!data.characters[c]) {
        data.characters[c] = DEFAULT_CHAR_DATA();
      }
    }
    return data;
  } catch {
    return DEFAULT_SAVE();
  }
}

export function saveProgress(data) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...data, version: 1 }));
  } catch {
    // Storage full or unavailable
  }
}

export function getCharData(save, character) {
  return save.characters[character] || DEFAULT_CHAR_DATA();
}

export function updateCharData(save, character, updates) {
  const newSave = {
    ...save,
    characters: {
      ...save.characters,
      [character]: { ...save.characters[character], ...updates },
    },
  };
  saveProgress(newSave);
  return newSave;
}
