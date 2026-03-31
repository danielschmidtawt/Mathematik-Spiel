// Problem generation with difficulty scaling across 25 levels

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblem(level) {
  if (level <= 5) {
    const a = randInt(2, 5), b = randInt(2, 5);
    return { a, b, answer: a * b, text: `${a} × ${b}` };
  }
  if (level <= 10) {
    const a = randInt(2, 9), b = randInt(2, 9);
    return { a, b, answer: a * b, text: `${a} × ${b}` };
  }
  if (level <= 15) {
    const a = randInt(5, 12), b = randInt(2, 9);
    return { a, b, answer: a * b, text: `${a} × ${b}` };
  }
  if (level <= 20) {
    if (Math.random() < 0.6) {
      const a = randInt(5, 12), b = randInt(2, 9);
      return { a, b, answer: a * b, text: `${a} × ${b}` };
    } else {
      const b = randInt(2, 9), answer = randInt(2, 12);
      const a = b * answer;
      return { a, b, answer, text: `${a} ÷ ${b}` };
    }
  }
  // Levels 21-25: harder
  if (Math.random() < 0.5) {
    const a = randInt(6, 15), b = randInt(3, 12);
    return { a, b, answer: a * b, text: `${a} × ${b}` };
  } else {
    const b = randInt(3, 12), answer = randInt(3, 15);
    const a = b * answer;
    return { a, b, answer, text: `${a} ÷ ${b}` };
  }
}

export function wrongAnswer(correct, level) {
  if (level >= 21) {
    const offsets = [-2, -1, 1, 2];
    let w = correct + offsets[Math.floor(Math.random() * offsets.length)];
    if (w <= 0 || w === correct) w = correct + 1;
    return w;
  }
  const offsets = [-3, -2, -1, 1, 2, 3, 5, -5, 10, -10];
  let w = correct + offsets[Math.floor(Math.random() * offsets.length)];
  if (w <= 0 || w === correct) w = correct + 3;
  return w;
}
