const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restartButton");
const skipStageButton = document.getElementById("skipStageButton");
const mobileLeftButton = document.getElementById("mobileLeftButton");
const mobileRightButton = document.getElementById("mobileRightButton");
const mobileJumpButton = document.getElementById("mobileJumpButton");

const keys = new Set();
const CLEAR_OVERLAY_FRAMES = 420;
const CHURU_FRAMES = 60 * 60;
const BASE_PLAYER_WIDTH = 42;
const BASE_PLAYER_HEIGHT = 62;
const BOSS_INTRO_FRAMES = 120;
const BOSS_MESSAGE_FRAMES = 120;
const BOSS_AXE_COOLDOWN = 90;
const SECOND_LEVEL_SCALE = 1.28;
const SAVE_KEY = "whiteCatStageProgress";

const stages = [
  {
    name: "Stage 1",
    width: 4200,
    height: 720,
    clearX: 3980,
    spawn: { x: 90, y: 382 },
    sky: ["#7fd4f7", "#c6eff8", "#f7eab4"],
    hillColor: "#68a05f",
    topColor: "#6fb15b",
    soilColor: "#8b5a32",
    platforms: [
      { x: 0, y: 450, width: 560, height: 90 },
      { x: 680, y: 450, width: 500, height: 90 },
      { x: 1300, y: 450, width: 430, height: 90 },
      { x: 1860, y: 450, width: 620, height: 90 },
      { x: 2600, y: 450, width: 460, height: 90 },
      { x: 3180, y: 450, width: 1020, height: 90 },
      { x: 980, y: 350, width: 150, height: 24 },
      { x: 1540, y: 330, width: 170, height: 24 },
      { x: 2130, y: 340, width: 160, height: 24 },
      { x: 2860, y: 325, width: 180, height: 24 },
    ],
    enemySpawns: [
      { x: 780, platformIndex: 1, direction: 1 },
      { x: 1940, platformIndex: 3, direction: -1 },
      { x: 3320, platformIndex: 5, direction: 1 },
    ],
  },
  {
    name: "Stage 2",
    width: 5000,
    height: 760,
    clearX: 4740,
    spawn: { x: 80, y: 352 },
    sky: ["#9a8cff", "#f0c7ff", "#ffe4a8"],
    hillColor: "#4f8d78",
    topColor: "#43b8a0",
    soilColor: "#5f4a74",
    platforms: [
      { x: 0, y: 420, width: 520, height: 100 },
      { x: 560, y: 470, width: 430, height: 90 },
      { x: 1060, y: 390, width: 570, height: 90 },
      { x: 1700, y: 470, width: 440, height: 90 },
      { x: 2200, y: 410, width: 520, height: 90 },
      { x: 2780, y: 350, width: 360, height: 80 },
      { x: 3220, y: 470, width: 560, height: 90 },
      { x: 3840, y: 410, width: 430, height: 90 },
      { x: 4320, y: 450, width: 680, height: 90 },
      { x: 1260, y: 285, width: 140, height: 24 },
      { x: 2410, y: 285, width: 140, height: 24 },
      { x: 3440, y: 330, width: 160, height: 24 },
    ],
    enemySpawns: [
      { x: 650, platformIndex: 1, direction: -1 },
      { x: 1190, platformIndex: 2, direction: 1 },
      { x: 2320, platformIndex: 4, direction: -1 },
      { x: 3330, platformIndex: 6, direction: 1 },
      { x: 4460, platformIndex: 8, direction: -1 },
    ],
  },
  {
    name: "Stage 3",
    width: 5100,
    height: 760,
    clearX: 4880,
    spawn: { x: 80, y: 372 },
    sky: ["#86e7d8", "#d6fff3", "#f8f0b8"],
    hillColor: "#7ca95a",
    topColor: "#91c95f",
    soilColor: "#7a6344",
    platforms: [
      { x: 0, y: 440, width: 500, height: 90 },
      { x: 620, y: 430, width: 420, height: 90 },
      { x: 1160, y: 470, width: 520, height: 90 },
      { x: 1810, y: 390, width: 450, height: 90 },
      { x: 2390, y: 440, width: 560, height: 90 },
      { x: 3060, y: 390, width: 420, height: 90 },
      { x: 3610, y: 470, width: 520, height: 90 },
      { x: 4250, y: 430, width: 850, height: 90 },
      { x: 1330, y: 335, width: 150, height: 24 },
      { x: 2630, y: 315, width: 150, height: 24 },
      { x: 3820, y: 345, width: 170, height: 24 },
    ],
    enemySpawns: [
      { x: 700, platformIndex: 1, direction: 1 },
      { x: 1240, platformIndex: 2, direction: -1 },
      { x: 2470, platformIndex: 4, direction: 1 },
      { x: 3710, platformIndex: 6, direction: -1 },
      { x: 4380, platformIndex: 7, direction: 1 },
    ],
  },
  {
    name: "Stage 4",
    width: 5300,
    height: 780,
    clearX: 5060,
    spawn: { x: 90, y: 392 },
    sky: ["#f9b7c8", "#ffe0e6", "#fff2ba"],
    hillColor: "#c26c75",
    topColor: "#f0a35f",
    soilColor: "#71475d",
    platforms: [
      { x: 0, y: 460, width: 560, height: 90 },
      { x: 700, y: 400, width: 390, height: 90 },
      { x: 1220, y: 455, width: 470, height: 90 },
      { x: 1810, y: 420, width: 520, height: 90 },
      { x: 2470, y: 470, width: 430, height: 90 },
      { x: 3020, y: 405, width: 500, height: 90 },
      { x: 3650, y: 455, width: 470, height: 90 },
      { x: 4240, y: 390, width: 360, height: 90 },
      { x: 4740, y: 440, width: 560, height: 90 },
      { x: 940, y: 305, width: 160, height: 24 },
      { x: 2070, y: 320, width: 180, height: 24 },
      { x: 3290, y: 300, width: 160, height: 24 },
    ],
    enemySpawns: [
      { x: 760, platformIndex: 1, direction: -1 },
      { x: 1300, platformIndex: 2, direction: 1 },
      { x: 2540, platformIndex: 4, direction: -1 },
      { x: 3740, platformIndex: 6, direction: 1 },
      { x: 4820, platformIndex: 8, direction: -1 },
    ],
  },
  {
    name: "Stage 5",
    width: 5450,
    height: 800,
    clearX: 5200,
    spawn: { x: 85, y: 342 },
    sky: ["#6788ff", "#b8d5ff", "#f4f7ff"],
    hillColor: "#526f9e",
    topColor: "#8ed3ff",
    soilColor: "#425473",
    platforms: [
      { x: 0, y: 410, width: 480, height: 90 },
      { x: 610, y: 470, width: 520, height: 90 },
      { x: 1260, y: 420, width: 390, height: 90 },
      { x: 1780, y: 355, width: 390, height: 80 },
      { x: 2300, y: 455, width: 580, height: 90 },
      { x: 3010, y: 400, width: 470, height: 90 },
      { x: 3610, y: 460, width: 430, height: 90 },
      { x: 4160, y: 405, width: 520, height: 90 },
      { x: 4800, y: 450, width: 650, height: 90 },
      { x: 820, y: 335, width: 140, height: 24 },
      { x: 1940, y: 265, width: 150, height: 24 },
      { x: 3190, y: 300, width: 170, height: 24 },
    ],
    enemySpawns: [
      { x: 720, platformIndex: 1, direction: 1 },
      { x: 1330, platformIndex: 2, direction: -1 },
      { x: 2380, platformIndex: 4, direction: 1 },
      { x: 3700, platformIndex: 6, direction: -1 },
      { x: 4900, platformIndex: 8, direction: 1 },
    ],
  },
  {
    name: "Stage 6",
    width: 5600,
    height: 800,
    clearX: 5360,
    spawn: { x: 90, y: 382 },
    sky: ["#40506c", "#8fa0b8", "#f1d6a1"],
    hillColor: "#58605a",
    topColor: "#a9b36a",
    soilColor: "#4b5142",
    platforms: [
      { x: 0, y: 450, width: 520, height: 90 },
      { x: 660, y: 395, width: 430, height: 90 },
      { x: 1240, y: 470, width: 480, height: 90 },
      { x: 1870, y: 415, width: 470, height: 90 },
      { x: 2490, y: 360, width: 400, height: 80 },
      { x: 3020, y: 455, width: 560, height: 90 },
      { x: 3710, y: 405, width: 450, height: 90 },
      { x: 4300, y: 465, width: 480, height: 90 },
      { x: 4920, y: 420, width: 680, height: 90 },
      { x: 1370, y: 340, width: 160, height: 24 },
      { x: 2650, y: 265, width: 150, height: 24 },
      { x: 4450, y: 345, width: 180, height: 24 },
    ],
    enemySpawns: [
      { x: 740, platformIndex: 1, direction: -1 },
      { x: 1320, platformIndex: 2, direction: 1 },
      { x: 3100, platformIndex: 5, direction: -1 },
      { x: 3790, platformIndex: 6, direction: 1 },
      { x: 5030, platformIndex: 8, direction: -1 },
    ],
  },
  {
    name: "Stage 7",
    width: 5750,
    height: 820,
    clearX: 5500,
    spawn: { x: 90, y: 362 },
    sky: ["#ffcf7a", "#ffe9b8", "#bfe9ff"],
    hillColor: "#cf8c45",
    topColor: "#ffd166",
    soilColor: "#8a5c3d",
    platforms: [
      { x: 0, y: 430, width: 540, height: 90 },
      { x: 680, y: 480, width: 430, height: 90 },
      { x: 1240, y: 430, width: 500, height: 90 },
      { x: 1880, y: 370, width: 420, height: 80 },
      { x: 2430, y: 455, width: 530, height: 90 },
      { x: 3100, y: 400, width: 430, height: 90 },
      { x: 3660, y: 470, width: 520, height: 90 },
      { x: 4310, y: 410, width: 420, height: 90 },
      { x: 4860, y: 455, width: 890, height: 90 },
      { x: 1420, y: 305, width: 150, height: 24 },
      { x: 2030, y: 275, width: 150, height: 24 },
      { x: 3880, y: 335, width: 170, height: 24 },
    ],
    enemySpawns: [
      { x: 760, platformIndex: 1, direction: 1 },
      { x: 1330, platformIndex: 2, direction: -1 },
      { x: 2520, platformIndex: 4, direction: 1 },
      { x: 3750, platformIndex: 6, direction: -1 },
      { x: 5000, platformIndex: 8, direction: 1 },
    ],
  },
  {
    name: "Stage 8",
    width: 5900,
    height: 840,
    clearX: 5660,
    spawn: { x: 90, y: 392 },
    sky: ["#26354f", "#65708c", "#d5c3ff"],
    hillColor: "#44506a",
    topColor: "#b6a6ff",
    soilColor: "#3c3358",
    platforms: [
      { x: 0, y: 460, width: 520, height: 90 },
      { x: 650, y: 410, width: 470, height: 90 },
      { x: 1260, y: 475, width: 460, height: 90 },
      { x: 1850, y: 425, width: 520, height: 90 },
      { x: 2510, y: 365, width: 430, height: 80 },
      { x: 3080, y: 445, width: 500, height: 90 },
      { x: 3720, y: 390, width: 430, height: 90 },
      { x: 4300, y: 470, width: 510, height: 90 },
      { x: 4960, y: 420, width: 940, height: 90 },
      { x: 810, y: 300, width: 150, height: 24 },
      { x: 2130, y: 320, width: 160, height: 24 },
      { x: 5180, y: 315, width: 170, height: 24 },
    ],
    enemySpawns: [
      { x: 760, platformIndex: 1, direction: -1 },
      { x: 1340, platformIndex: 2, direction: 1 },
      { x: 1940, platformIndex: 3, direction: -1 },
      { x: 3170, platformIndex: 5, direction: 1 },
      { x: 5070, platformIndex: 8, direction: -1 },
    ],
  },
  {
    name: "Stage 9",
    width: 6200,
    height: 860,
    clearX: 5960,
    spawn: { x: 90, y: 372 },
    sky: ["#1a1e31", "#704b91", "#ffcf8a"],
    hillColor: "#6d426d",
    topColor: "#ff6b6b",
    soilColor: "#3b243d",
    platforms: [
      { x: 0, y: 440, width: 560, height: 90 },
      { x: 700, y: 475, width: 440, height: 90 },
      { x: 1280, y: 410, width: 520, height: 90 },
      { x: 1940, y: 470, width: 430, height: 90 },
      { x: 2510, y: 380, width: 470, height: 90 },
      { x: 3130, y: 455, width: 520, height: 90 },
      { x: 3790, y: 395, width: 460, height: 90 },
      { x: 4390, y: 465, width: 500, height: 90 },
      { x: 5030, y: 410, width: 430, height: 90 },
      { x: 5580, y: 450, width: 620, height: 90 },
      { x: 1460, y: 300, width: 160, height: 24 },
      { x: 2700, y: 275, width: 150, height: 24 },
      { x: 3980, y: 300, width: 170, height: 24 },
      { x: 5200, y: 315, width: 180, height: 24 },
    ],
    enemySpawns: [
      { x: 780, platformIndex: 1, direction: 1 },
      { x: 1370, platformIndex: 2, direction: -1 },
      { x: 2030, platformIndex: 3, direction: 1 },
      { x: 3210, platformIndex: 5, direction: -1 },
      { x: 4480, platformIndex: 7, direction: 1 },
      { x: 5660, platformIndex: 9, direction: -1 },
    ],
  },
  {
    name: "Stage 10",
    width: 7600,
    height: 860,
    clearX: 7240,
    spawn: { x: 90, y: 398 },
    sky: ["#3b2c2c", "#5d3d36", "#2a2024"],
    hillColor: "#4b3532",
    topColor: "#9b4d39",
    soilColor: "#5d2d25",
    theme: "brick",
    bossLineX: 6200,
    bossSpawnX: 6500,
    bossGroundY: 460,
    platforms: [
      { x: 0, y: 460, width: 7600, height: 90 },
      { x: 850, y: 350, width: 260, height: 24 },
      { x: 1620, y: 330, width: 260, height: 24 },
      { x: 2480, y: 360, width: 260, height: 24 },
      { x: 3380, y: 340, width: 260, height: 24 },
      { x: 4480, y: 350, width: 260, height: 24 },
    ],
    enemySpawns: [
      { x: 900, platformIndex: 0, direction: 1 },
      { x: 1900, platformIndex: 0, direction: -1 },
      { x: 2920, platformIndex: 0, direction: 1 },
      { x: 4040, platformIndex: 0, direction: -1 },
      { x: 5300, platformIndex: 0, direction: 1 },
    ],
    boxPositions: [
      { x: 5880, y: 334 },
      { x: 5934, y: 334 },
      { x: 5988, y: 334 },
      { x: 6042, y: 334 },
      { x: 6096, y: 334 },
    ],
  },
];

const world = {
  width: stages[0].width,
  height: stages[0].height,
  gravity: 0.75,
  cameraX: 0,
  clearX: stages[0].clearX,
};

const player = {
  x: stages[0].spawn.x,
  y: stages[0].spawn.y,
  width: BASE_PLAYER_WIDTH,
  height: BASE_PLAYER_HEIGHT,
  vx: 0,
  vy: 0,
  speed: 4.6,
  jumpPower: 15.5,
  grounded: false,
  facing: 1,
  deaths: 0,
  hits: 0,
  hurtTimer: 0,
  cleared: false,
};

const powers = {
  flame: false,
  food: false,
  churuTimer: 0,
};

let currentStageIndex = 0;
let currentLevel = 1;
let currentStage = buildStageForLevel(stages[currentStageIndex]);
let platforms = currentStage.platforms;
let enemies = createEnemies();
let itemBoxes = createItemBoxes();
let items = [];
let fireballs = [];
let axes = [];
let boss = createBoss();
let clearMessageTimer = 0;
let pendingNextStage = false;
let finalVictory = false;
let finalCeremonyTimer = 0;
let finalCeremonyBaseY = 0;
let endingTimer = 0;
let endingFinished = false;
let gameMode = "intro";
let menuButtons = [];
const exitButton = { x: 18, y: 154, width: 92, height: 34 };
let audioContext = null;
let currentMusicMode = "none";
let nextMusicNoteTime = 0;
let musicStep = 0;

function ensureAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(frequency, duration = 0.14, type = "sine", volume = 0.12, slideTo = null) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  }

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function playSound(name) {
  if (!audioContext) return;

  const sounds = {
    jump: () => playTone(330, 0.13, "triangle", 0.09, 620),
    box: () => playTone(520, 0.1, "square", 0.08, 780),
    item: () => {
      playTone(660, 0.1, "sine", 0.08);
      setTimeout(() => playTone(880, 0.12, "sine", 0.08), 80);
    },
    fire: () => playTone(180, 0.16, "sawtooth", 0.07, 360),
    hit: () => playTone(130, 0.12, "square", 0.09, 80),
    defeat: () => playTone(420, 0.14, "triangle", 0.09, 220),
    clear: () => {
      playTone(520, 0.12, "sine", 0.08);
      setTimeout(() => playTone(660, 0.12, "sine", 0.08), 120);
      setTimeout(() => playTone(880, 0.18, "sine", 0.08), 240);
    },
    boss: () => playTone(95, 0.55, "sawtooth", 0.1, 65),
    axe: () => playTone(250, 0.09, "square", 0.06, 140),
    explosion: () => playTone(80, 0.5, "sawtooth", 0.16, 35),
    menu: () => playTone(540, 0.08, "sine", 0.07, 700),
  };

  sounds[name]?.();
}

function updateMusic() {
  if (!audioContext) return;

  const wantedMode = powers.churuTimer > 0 && gameMode === "playing" && !player.cleared ? "churu" : gameMode === "intro" ? "intro" : "none";

  if (wantedMode !== currentMusicMode) {
    currentMusicMode = wantedMode;
    musicStep = 0;
    nextMusicNoteTime = audioContext.currentTime;
  }

  if (currentMusicMode === "none" || audioContext.currentTime < nextMusicNoteTime) return;

  if (currentMusicMode === "intro") {
    const notes = [262, 330, 392, 330, 294, 349, 440, 349];
    playMusicNote(notes[musicStep % notes.length], 0.44, "sine", 0.035);
    nextMusicNoteTime = audioContext.currentTime + 0.62;
  } else if (currentMusicMode === "churu") {
    const notes = [523, 659, 784, 1046, 784, 659, 698, 880];
    playMusicNote(notes[musicStep % notes.length], 0.18, "triangle", 0.045);
    nextMusicNoteTime = audioContext.currentTime + 0.2;
  }

  musicStep += 1;
}

function playMusicNote(frequency, duration, type, volume) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function buildStageForLevel(baseStage) {
  if (currentLevel === 1) return baseStage;

  const scaleX = (value) => Math.round(value * SECOND_LEVEL_SCALE);
  const platforms = baseStage.platforms.map((platform) => ({
    ...platform,
    x: scaleX(platform.x),
    width: Math.max(platform.width, scaleX(platform.width)),
  }));
  const enemySpawns = baseStage.enemySpawns.map((spawn) => ({
    ...spawn,
    x: scaleX(spawn.x),
  }));

  const extraSpawns = platforms
    .map((platform, index) => ({ platform, index }))
    .filter(({ platform }) => platform.height >= 80 && platform.width >= 420)
    .slice(0, 8)
    .map(({ platform, index }, extraIndex) => ({
      x: platform.x + Math.min(platform.width - 120, 160 + extraIndex * 55),
      platformIndex: index,
      direction: extraIndex % 2 === 0 ? 1 : -1,
    }));

  return {
    ...baseStage,
    name: `Level 2 - ${baseStage.name}`,
    width: scaleX(baseStage.width),
    clearX: scaleX(baseStage.clearX),
    spawn: { ...baseStage.spawn },
    platforms,
    enemySpawns: [...enemySpawns, ...extraSpawns],
    bossLineX: baseStage.bossLineX ? scaleX(baseStage.bossLineX) : undefined,
    bossSpawnX: baseStage.bossSpawnX ? scaleX(baseStage.bossSpawnX) : undefined,
    bossGroundY: baseStage.bossGroundY,
    boxPositions: baseStage.boxPositions?.map((box) => ({ ...box, x: scaleX(box.x) })),
  };
}

function loadProgress() {
  try {
    const raw = sessionStorage.getItem(SAVE_KEY);
    const progress = raw ? JSON.parse(raw) : null;

    return {
      level: Math.min(2, Math.max(1, Number(progress?.level) || 1)),
      stageIndex: Math.min(stages.length - 1, Math.max(0, Number(progress?.stageIndex) || 0)),
      completed: Boolean(progress?.completed),
    };
  } catch {
    return { level: 1, stageIndex: 0, completed: false };
  }
}

function saveProgress(level = currentLevel, stageIndex = currentStageIndex) {
  const previous = loadProgress();
  const currentOrder = (currentLevel - 1) * stages.length + currentStageIndex;
  const nextOrder = (level - 1) * stages.length + stageIndex;

  if (nextOrder < currentOrder && !previous.completed) return;
  sessionStorage.setItem(SAVE_KEY, JSON.stringify({ level, stageIndex, completed: previous.completed }));
}

function markGameCompleted() {
  sessionStorage.setItem(SAVE_KEY, JSON.stringify({ level: 2, stageIndex: stages.length - 1, completed: true }));
}

function startGameFromProgress() {
  const progress = loadProgress();
  currentLevel = progress.level;
  gameMode = "playing";
  applyStage(progress.stageIndex);
}

function createEnemies() {
  return currentStage.enemySpawns.map((spawnPoint, index) => {
    const platform = currentStage.platforms[spawnPoint.platformIndex];

    return {
      x: spawnPoint.x,
      y: platform.y - 44,
      width: 72,
      height: 44,
      breed: spawnPoint.breed ?? ((currentStageIndex + index) % 2 === 0 ? "golden" : "borderCollie"),
      vx: 1.35 * spawnPoint.direction,
      minX: platform.x + 24,
      maxX: platform.x + platform.width - 96,
      alive: true,
    };
  });
}

function createItemBoxes() {
  if (currentStage.boxPositions) {
    return currentStage.boxPositions.map((box, index) => ({
      x: box.x,
      y: box.y,
      width: 44,
      height: 38,
      opened: false,
      bumpTimer: 0,
      label: "?",
      id: `${currentStage.name}-fixed-${index}`,
    }));
  }

  return currentStage.platforms
    .map((platform, index) => ({ platform, index }))
    .filter(({ platform, index }) => platform.height >= 80 && platform.width >= 400 && index % 2 === 0)
    .map(({ platform }, boxIndex) => placeItemBox(platform, boxIndex))
    .filter(Boolean);
}

function placeItemBox(platform, boxIndex) {
  const candidateXs = [0.56, 0.35, 0.74, 0.2, 0.88];

  for (const ratio of candidateXs) {
    const box = {
      x: platform.x + platform.width * ratio - 22,
      y: platform.y - 126,
      width: 44,
      height: 38,
      opened: false,
      bumpTimer: 0,
      label: "?",
      id: `${currentStage.name}-${boxIndex}`,
    };

    const overlapsPlatform = currentStage.platforms.some((other) => other !== platform && rectsOverlap(box, other));
    if (!overlapsPlatform) return box;
  }

  return null;
}

function createBoss() {
  if (!currentStage.bossLineX) return null;

  return {
    x: currentStage.bossSpawnX,
    y: -190,
    width: 150,
    height: 150,
    vx: 0,
    vy: 0,
    active: false,
    descending: false,
    messageTimer: 0,
    axeCooldown: BOSS_AXE_COOLDOWN,
    hitCount: 0,
    facing: -1,
    dead: false,
    exploding: false,
    explosionTimer: 0,
    dodgeTimer: 0,
  };
}

function resetPowers() {
  powers.flame = false;
  powers.food = false;
  powers.churuTimer = 0;
  applyPlayerSize();
}

function applyPlayerSize() {
  const groundY = getStandingPlatformY();
  const oldBottom = groundY ?? player.y + player.height;
  const scale = powers.food ? 1.24 : 1;
  player.width = Math.round(BASE_PLAYER_WIDTH * scale);
  player.height = Math.round(BASE_PLAYER_HEIGHT * scale);
  player.y = oldBottom - player.height;
  snapPlayerToGround(oldBottom);
}

function getStandingPlatformY() {
  const footY = player.y + player.height;

  for (const platform of platforms) {
    const horizontallyInside = player.x + player.width > platform.x && player.x < platform.x + platform.width;
    const nearTop = Math.abs(footY - platform.y) <= 120 || player.y < platform.y;

    if (horizontallyInside && nearTop) {
      return platform.y;
    }
  }

  return null;
}

function snapPlayerToGround(targetBottom = player.y + player.height) {
  let bestPlatform = null;
  let bestDistance = Infinity;

  for (const platform of platforms) {
    const horizontallyInside = player.x + player.width > platform.x && player.x < platform.x + platform.width;
    const distance = Math.abs(targetBottom - platform.y);
    const closeToTop = distance <= 90;

    if (horizontallyInside && closeToTop && distance < bestDistance) {
      bestPlatform = platform;
      bestDistance = distance;
    }
  }

  if (bestPlatform) {
    player.y = bestPlatform.y - player.height;
    player.vy = Math.max(0, player.vy);
    player.grounded = true;
  }
}

function getMaxHits() {
  return powers.food ? 3 : 2;
}

function handleDeath(message) {
  player.deaths += 1;
  playSound("hit");
  resetPowers();
  resetPlayer(message);
}

function applyStage(stageIndex) {
  currentStageIndex = stageIndex;
  currentStage = buildStageForLevel(stages[currentStageIndex]);
  platforms = currentStage.platforms;
  world.width = currentStage.width;
  world.height = currentStage.height;
  world.clearX = currentStage.clearX;
  resetPlayer(`${currentStage.name} 시작!`);
}

function resetPlayer(message = "스폰 지점에서 다시 시작합니다.") {
  player.x = currentStage.spawn.x;
  player.y = currentStage.spawn.y + BASE_PLAYER_HEIGHT - player.height;
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.hits = 0;
  player.hurtTimer = 0;
  player.cleared = false;
  clearMessageTimer = 0;
  pendingNextStage = false;
  finalVictory = false;
  finalCeremonyTimer = 0;
  endingTimer = 0;
  endingFinished = false;
  enemies = createEnemies();
  itemBoxes = createItemBoxes();
  items = [];
  fireballs = [];
  axes = [];
  boss = createBoss();
  world.cameraX = 0;
  statusText.textContent = message;
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function updatePlayer() {
  if (gameMode !== "playing") return;
  if (endingFinished) return;
  if (endingTimer > 0) {
    endingTimer -= 1;
    if (endingTimer <= 0) {
      endingFinished = true;
      markGameCompleted();
      gameMode = "intro";
      statusText.textContent = "인트로 화면";
    }
    return;
  }

  if (player.hurtTimer > 0) {
    player.hurtTimer -= 1;
  }
  if (powers.churuTimer > 0 && !player.cleared) {
    powers.churuTimer -= 1;
  }

  if (clearMessageTimer > 0) {
    clearMessageTimer -= 1;
    if (clearMessageTimer === 0 && pendingNextStage) {
      saveProgress(currentLevel, currentStageIndex + 1);
      applyStage(currentStageIndex + 1);
      return;
    }
  }

  if (finalCeremonyTimer > 0) {
    updateFinalCeremony();
    return;
  }

  if (boss && boss.active && (boss.descending || boss.messageTimer > 0)) {
    player.vx = 0;
    player.vy = 0;
    updateBoss();
    const targetCamera = player.x + player.width / 2 - canvas.width / 2;
    world.cameraX = Math.max(0, Math.min(targetCamera, world.width - canvas.width));
    return;
  }

  if (player.cleared) {
    player.vx *= 0.85;
  } else {
    const left = keys.has("a");
    const right = keys.has("d");

    player.vx = 0;
    if (left) {
      player.vx = -player.speed;
      player.facing = -1;
    }
    if (right) {
      player.vx = player.speed;
      player.facing = 1;
    }

    if (keys.has(" ") && player.grounded) {
      player.vy = -player.jumpPower;
      player.grounded = false;
      playSound("jump");
    }
  }

  player.vy += world.gravity;
  player.x += player.vx;
  player.x = Math.max(0, Math.min(player.x, world.width - player.width));

  player.y += player.vy;
  player.grounded = false;

  for (const platform of platforms) {
    if (!rectsOverlap(player, platform)) continue;

    const previousBottom = player.y - player.vy + player.height;
    const previousTop = player.y - player.vy;
    const previousRight = player.x - player.vx + player.width;
    const previousLeft = player.x - player.vx;

    if (previousBottom <= platform.y && player.vy >= 0) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.grounded = true;
    } else if (previousTop >= platform.y + platform.height && player.vy < 0) {
      player.y = platform.y + platform.height;
      player.vy = 0;
    } else if (previousRight <= platform.x) {
      player.x = platform.x - player.width;
    } else if (previousLeft >= platform.x + platform.width) {
      player.x = platform.x + platform.width;
    }
  }

  updateItemBoxes();
  updateItems();
  updateEnemies();
  updateFireballs();
  updateBoss();
  updateAxes();
  updateEnemyCollisions();
  updateBossCollisions();

  if (player.y > world.height) {
    handleDeath(`구멍에 빠졌습니다. 사망 횟수: ${player.deaths + 1}`);
  }

  if (!player.cleared && player.x + player.width >= world.clearX) {
    if (boss && !boss.dead) {
      player.x = world.clearX - player.width;
      statusText.textContent = "보스를 먼저 처치하세요.";
      return;
    }

    if (currentStageIndex === stages.length - 1) {
      startFinalCeremony();
      return;
    }

    player.cleared = true;
    clearMessageTimer = CLEAR_OVERLAY_FRAMES;
    pendingNextStage = currentStageIndex < stages.length - 1;
    powers.churuTimer = 0;
    if (pendingNextStage) {
      saveProgress(currentLevel, currentStageIndex + 1);
    }
    statusText.textContent = `${currentStage.name} 클리어! 사망 횟수: ${player.deaths}`;
    playSound("clear");
  }

  const targetCamera = player.x + player.width / 2 - canvas.width / 2;
  world.cameraX = Math.max(0, Math.min(targetCamera, world.width - canvas.width));
}

function startFinalCeremony() {
  finalVictory = true;
  finalCeremonyTimer = 180;
  finalCeremonyBaseY = currentStage.bossGroundY - player.height;
  player.x = world.clearX - 95;
  player.y = finalCeremonyBaseY;
  player.vx = 0;
  player.vy = 0;
  player.grounded = true;
  powers.churuTimer = 0;
  statusText.textContent = "고양이가 깃발을 뽑았습니다!";
  playSound("clear");
}

function updateFinalCeremony() {
  finalCeremonyTimer -= 1;
  world.cameraX = Math.max(0, Math.min(player.x + player.width / 2 - canvas.width / 2, world.width - canvas.width));

  const elapsed = 180 - finalCeremonyTimer;
  const jumpIndex = Math.floor(elapsed / 55);
  const jumpProgress = (elapsed % 55) / 55;

  if (jumpIndex < 3) {
    player.y = finalCeremonyBaseY - Math.sin(jumpProgress * Math.PI) * 58;
  } else {
    player.y = finalCeremonyBaseY;
  }

  if (finalCeremonyTimer <= 0) {
    player.y = finalCeremonyBaseY;
    player.cleared = true;
    if (currentLevel === 2) {
      endingTimer = 480;
      saveProgress(2, stages.length - 1);
      statusText.textContent = "엔딩";
      return;
    }

    clearMessageTimer = Number.POSITIVE_INFINITY;
    pendingNextStage = false;
    saveProgress(1, stages.length - 1);
    statusText.textContent = "모든 스테이지 클리어!";
  }
}

function startNextLevel() {
  currentLevel = 2;
  player.deaths = 0;
  resetPowers();
  finalVictory = false;
  clearMessageTimer = 0;
  saveProgress(2, 0);
  applyStage(0);
  statusText.textContent = "다음 레벨 시작! 더 길고 강아지가 많아졌습니다.";
}

function updateItemBoxes() {
  for (const box of itemBoxes) {
    if (box.bumpTimer > 0) {
      box.bumpTimer -= 1;
    }

    if (box.opened || !rectsOverlap(player, box)) continue;

    const previousTop = player.y - player.vy;
    const hitFromBelow = previousTop >= box.y + box.height - 4 && player.vy < 0;

    if (hitFromBelow) {
      box.opened = true;
      box.bumpTimer = 18;
      player.y = box.y + box.height;
      player.vy = 3;
      spawnItemFromBox(box);
      playSound("box");
    }
  }
}

function spawnItemFromBox(box) {
  const roll = Math.random();
  const kind = roll < 0.35 ? "flame" : roll < 0.7 ? "food" : "churu";

  items.push({
    kind,
    x: box.x + box.width / 2 - 14,
    y: box.y - 18,
    width: 28,
    height: 28,
    vy: -2.4,
    revealTimer: 24,
    age: 0,
  });
}

function updateItems() {
  for (const item of items) {
    item.age += 1;
    if (item.revealTimer > 0) {
      item.revealTimer -= 1;
      item.y += item.vy;
      item.vy += 0.12;
    } else {
      item.y += Math.sin(item.age / 12) * 0.18;
    }

    if (!rectsOverlap(player, item)) continue;

    activateItem(item.kind);
    item.collected = true;
    playSound("item");
  }

  items = items.filter((item) => !item.collected);
}

function activateItem(kind) {
  resetPowers();

  if (kind === "flame") {
    powers.flame = true;
    statusText.textContent = "불꽃 획득! 좌클릭으로 불을 던질 수 있습니다.";
    return;
  }

  if (kind === "food") {
    powers.food = true;
    applyPlayerSize();
    statusText.textContent = "사료 획득! 몸이 커지고 3번 맞아야 죽습니다.";
    return;
  }

  powers.churuTimer = CHURU_FRAMES;
  statusText.textContent = "츄르 획득! 1분 동안 무적입니다.";
}

function updateFireballs() {
  for (const fireball of fireballs) {
    fireball.x += fireball.vx;
    fireball.y += fireball.vy;
    fireball.vy += fireball.gravity;
    fireball.life -= 1;

    if (fireball.x < 0 || fireball.x > world.width || fireball.life <= 0) {
      fireball.done = true;
      continue;
    }

    for (const enemy of enemies) {
      if (!enemy.alive || !rectsOverlap(fireball, enemy)) continue;
      enemy.alive = false;
      fireball.done = true;
      statusText.textContent = "불꽃으로 강아지를 맞췄습니다.";
      playSound("defeat");
      break;
    }

    if (!fireball.done && boss && boss.active && !boss.dead && !boss.exploding && !boss.descending && rectsOverlap(fireball, boss)) {
      damageBoss(1);
      fireball.done = true;
      statusText.textContent = `불꽃으로 보스 타격 ${boss.hitCount}/${getBossRequiredHits()}`;
    }
  }

  fireballs = fireballs.filter((fireball) => !fireball.done);
}

function getBossRequiredHits() {
  return powers.flame || powers.food || powers.churuTimer > 0 ? 17 : 20;
}

function damageBoss(amount) {
  if (!boss || boss.dead || boss.exploding) return;

  boss.hitCount += amount;
  const needed = getBossRequiredHits();

  if (boss.hitCount >= needed) {
    boss.exploding = true;
    boss.explosionTimer = 76;
    axes = [];
    statusText.textContent = "보스가 폭발합니다!";
    playSound("explosion");
  }
}

function updateBoss() {
  if (!boss || player.cleared) return;

  if (!boss.active && !boss.dead && player.x + player.width >= currentStage.bossLineX) {
    boss.active = true;
    boss.descending = true;
    boss.y = -boss.height;
    boss.x = currentStage.bossSpawnX;
    boss.facing = player.x < boss.x ? -1 : 1;
    statusText.textContent = "보스가 등장합니다.";
    playSound("boss");
  }

  if (!boss.active) return;

  if (boss.exploding) {
    boss.explosionTimer -= 1;
    boss.y -= 5.6;
    boss.x += Math.sin(boss.explosionTimer / 4) * 3;
    if (boss.explosionTimer <= 0) {
      boss.dead = true;
      boss.active = false;
      statusText.textContent = "보스를 처치했습니다. 깃발로 가세요.";
    }
    return;
  }

  if (boss.descending) {
    const targetY = currentStage.bossGroundY - boss.height;
    boss.y = Math.min(targetY, boss.y + 2.2);

    if (boss.y >= targetY) {
      boss.descending = false;
      boss.messageTimer = BOSS_MESSAGE_FRAMES;
    }
    return;
  }

  if (boss.messageTimer > 0) {
    boss.messageTimer -= 1;
    return;
  }

  const arenaLeft = currentStage.bossLineX + 28;
  const arenaRight = world.clearX - 210;
  const playerCenter = player.x + player.width / 2;
  const bossCenter = boss.x + boss.width / 2;
  boss.facing = playerCenter < bossCenter ? -1 : 1;
  const desiredDistance = 230;
  let targetVx = 0;

  if (Math.abs(playerCenter - bossCenter) < desiredDistance) {
    targetVx = bossCenter < playerCenter ? -2.2 : 2.2;
  } else if (Math.abs(playerCenter - bossCenter) > desiredDistance + 90) {
    targetVx = bossCenter < playerCenter ? 1.55 : -1.55;
  }

  if (boss.dodgeTimer > 0) {
    boss.dodgeTimer -= 1;
    targetVx *= 1.9;
  } else if (fireballs.some((fireball) => Math.abs(fireball.x - boss.x) < 180 && Math.abs(fireball.y - boss.y) < 120)) {
    boss.dodgeTimer = 34;
    targetVx = bossCenter < playerCenter ? -3.6 : 3.6;
  }

  boss.vx = targetVx;
  boss.x = Math.max(arenaLeft, Math.min(arenaRight, boss.x + boss.vx));
  boss.axeCooldown -= 1;

  if (boss.axeCooldown <= 0) {
    throwBossAxe();
    boss.axeCooldown = BOSS_AXE_COOLDOWN;
  }
}

function throwBossAxe() {
  const bossCenterX = boss.x + boss.width / 2;
  const bossCenterY = boss.y + 55;
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;
  const dx = playerCenterX - bossCenterX;
  const dy = playerCenterY - bossCenterY;
  const distance = Math.max(1, Math.hypot(dx, dy));

  axes.push({
    x: bossCenterX,
    y: bossCenterY,
    width: 26,
    height: 26,
    vx: (dx / distance) * 5.4,
    vy: (dy / distance) * 5.4,
    rotation: 0,
    life: 180,
  });
  playSound("axe");
}

function updateAxes() {
  for (const axe of axes) {
    axe.x += axe.vx;
    axe.y += axe.vy;
    axe.rotation += 0.28;
    axe.life -= 1;

    if (axe.life <= 0 || axe.x < 0 || axe.x > world.width || axe.y > world.height) {
      axe.done = true;
      continue;
    }

    if (powers.churuTimer > 0) continue;

    if (rectsOverlap(player, axe) && player.hurtTimer <= 0) {
      const maxHits = getMaxHits();
      player.hits += 1;
      player.hurtTimer = 70;
      player.vx = axe.vx > 0 ? 7 : -7;
      player.vy = -8;
      axe.done = true;

      if (player.hits >= maxHits) {
        handleDeath(`도끼에 맞았습니다. 사망 횟수: ${player.deaths + 1}`);
      } else {
        statusText.textContent = `도끼에 맞았습니다. 남은 기회: ${maxHits - player.hits}`;
        playSound("hit");
      }
    }
  }

  axes = axes.filter((axe) => !axe.done);
}

function updateBossCollisions() {
  if (!boss || !boss.active || boss.dead || boss.exploding || boss.descending || boss.messageTimer > 0) return;
  if (!rectsOverlap(player, boss)) return;

  const previousBottom = player.y - player.vy + player.height;
  const landedOnBoss = previousBottom <= boss.y + 18 && player.vy > 0 && player.hurtTimer <= 0;

  if (landedOnBoss) {
    player.vy = -player.jumpPower * 0.72;
    damageBoss(1);
    statusText.textContent = `보스 타격 ${boss.hitCount}/${getBossRequiredHits()}`;
    playSound("hit");
    return;
  }

  if (powers.churuTimer > 0 || player.hurtTimer > 0) return;

  const maxHits = getMaxHits();
  player.hits += 1;
  player.hurtTimer = 70;
  player.vx = player.x < boss.x ? -9 : 9;
  player.vy = -9;

  if (player.hits >= maxHits) {
    handleDeath(`보스에게 ${maxHits}번 닿았습니다. 사망 횟수: ${player.deaths + 1}`);
  } else {
    statusText.textContent = `보스에게 닿았습니다. 남은 기회: ${maxHits - player.hits}`;
  }
}

function throwFireball() {
  if (!powers.flame || player.cleared) return;
  if (boss && boss.active && (boss.descending || boss.messageTimer > 0)) return;

  fireballs.push({
    x: player.facing > 0 ? player.x + player.width - 6 : player.x - 16,
    y: player.y + player.height * 0.46,
    width: 18,
    height: 18,
    vx: player.facing * 7.6,
    vy: -6.2,
    gravity: 0.28,
    life: 120,
  });
  playSound("fire");
}

function updateEnemies() {
  if (player.cleared) return;

  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    enemy.x += enemy.vx;

    if (enemy.x <= enemy.minX) {
      enemy.x = enemy.minX;
      enemy.vx = Math.abs(enemy.vx);
    } else if (enemy.x >= enemy.maxX) {
      enemy.x = enemy.maxX;
      enemy.vx = -Math.abs(enemy.vx);
    }
  }
}

function updateEnemyCollisions() {
  if (player.cleared) return;

  for (const enemy of enemies) {
    if (!enemy.alive || !rectsOverlap(player, enemy)) continue;

    if (powers.churuTimer > 0) {
      enemy.alive = false;
      statusText.textContent = "츄르 무적으로 강아지를 쓰러뜨렸습니다.";
      continue;
    }

    const previousBottom = player.y - player.vy + player.height;
    const canStomp = player.hurtTimer <= 0;
    const landedOnEnemy = canStomp && previousBottom <= enemy.y + 10 && player.vy > 0;

    if (landedOnEnemy) {
      enemy.alive = false;
      player.vy = -player.jumpPower * 0.58;
      statusText.textContent = "강아지를 밟았습니다.";
      playSound("defeat");
      continue;
    }

    if (player.hurtTimer <= 0) {
      const maxHits = getMaxHits();
      player.hits += 1;
      player.hurtTimer = 70;
      player.vx = player.x < enemy.x ? -8 : 8;
      player.vy = -8;

      if (player.hits >= maxHits) {
        handleDeath(`강아지에게 ${maxHits}번 닿았습니다. 사망 횟수: ${player.deaths + 1}`);
      } else {
        statusText.textContent = `강아지에게 닿았습니다. 남은 기회: ${maxHits - player.hits}`;
        playSound("hit");
      }
    }
  }
}

function drawBackground() {
  if (currentStage.theme === "brick") {
    drawBrickBackground();
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, currentStage.sky[0]);
  gradient.addColorStop(0.6, currentStage.sky[1]);
  gradient.addColorStop(1, currentStage.sky[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.76)";
  for (let i = 0; i < 8; i += 1) {
    const x = (i * 580 - world.cameraX * 0.25) % (canvas.width + 180) - 90;
    const y = 70 + (i % 3) * 42;
    drawCloud(x, y);
  }

  ctx.fillStyle = currentStage.hillColor;
  for (let i = 0; i < 14; i += 1) {
    const x = i * 420 - world.cameraX * 0.45;
    const height = currentStageIndex === 0 ? 130 : 180;
    drawHill(x, 460, 190, height);
  }
}

function drawBrickBackground() {
  ctx.fillStyle = "#3b2c2c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const brickW = 76;
  const brickH = 34;
  ctx.strokeStyle = "rgba(255, 206, 158, 0.22)";
  ctx.lineWidth = 2;

  for (let y = 0; y < canvas.height; y += brickH) {
    const offset = Math.floor(y / brickH) % 2 === 0 ? 0 : brickW / 2;
    for (let x = -brickW; x < canvas.width + brickW; x += brickW) {
      const brickX = x + offset - world.cameraX % brickW;
      ctx.strokeRect(brickX, y, brickW, brickH);
    }
  }

  drawWindows();
}

function drawWindows() {
  for (let i = 0; i < 12; i += 1) {
    const worldX = 420 + i * 620;
    const x = worldX - world.cameraX;
    const y = 82 + (i % 3) * 72;
    if (x < -100 || x > canvas.width + 100) continue;

    ctx.fillStyle = "#1c2535";
    ctx.strokeStyle = "#d1a36f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(x, y, 74, 94, 8);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 220, 150, 0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 37, y + 8);
    ctx.lineTo(x + 37, y + 86);
    ctx.moveTo(x + 8, y + 46);
    ctx.lineTo(x + 66, y + 46);
    ctx.stroke();
  }
}

function drawCloud(x, y) {
  ctx.beginPath();
  ctx.ellipse(x, y, 38, 22, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 34, y - 10, 34, 24, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 72, y, 42, 24, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawHill(x, baseY, width, height) {
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.quadraticCurveTo(x + width / 2, baseY - height, x + width, baseY);
  ctx.closePath();
  ctx.fill();
}

function drawPlatforms() {
  for (const platform of platforms) {
    const x = platform.x - world.cameraX;
    if (x > canvas.width || x + platform.width < 0) continue;

    if (currentStage.theme === "brick") {
      drawBrickPlatform(x, platform.y, platform.width, platform.height);
      continue;
    }

    ctx.fillStyle = currentStage.topColor;
    ctx.fillRect(x, platform.y, platform.width, 18);
    ctx.fillStyle = currentStage.soilColor;
    ctx.fillRect(x, platform.y + 18, platform.width, platform.height - 18);
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(x, platform.y + 18, platform.width, 5);
  }
}

function drawBrickPlatform(x, y, width, height) {
  ctx.fillStyle = "#9b4d39";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#c76f4d";
  ctx.fillRect(x, y, width, 14);
  ctx.strokeStyle = "rgba(58, 28, 24, 0.8)";
  ctx.lineWidth = 2;

  for (let rowY = y; rowY < y + height; rowY += 24) {
    const offset = Math.floor((rowY - y) / 24) % 2 === 0 ? 0 : 32;
    for (let rowX = x - offset; rowX < x + width; rowX += 64) {
      ctx.strokeRect(rowX, rowY, 64, 24);
    }
  }
}

function drawItemBoxes() {
  for (const box of itemBoxes) {
    const x = box.x - world.cameraX;
    if (x > canvas.width || x + box.width < 0) continue;

    const bumpOffset = box.bumpTimer > 0 ? -Math.sin((box.bumpTimer / 18) * Math.PI) * 8 : 0;
    const y = box.y + bumpOffset;

    ctx.fillStyle = box.opened ? "#8f7b63" : "#f4b642";
    ctx.strokeStyle = "#4f3217";
    ctx.lineWidth = 3;
    ctx.fillRect(x, y, box.width, box.height);
    ctx.strokeRect(x, y, box.width, box.height);

    ctx.fillStyle = box.opened ? "#c6b59e" : "#ffffff";
    ctx.font = "700 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(box.opened ? "✓" : box.label, x + box.width / 2, y + box.height / 2 + 1);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }
}

function drawItems() {
  for (const item of items) {
    const x = item.x - world.cameraX;
    const y = item.y;
    if (x > canvas.width || x + item.width < 0) continue;

    if (item.kind === "flame") {
      drawFlameIcon(x + 14, y + 16, 1);
    } else if (item.kind === "food") {
      drawFoodIcon(x, y);
    } else {
      drawChuruIcon(x, y);
    }
  }
}

function drawFireballs() {
  for (const fireball of fireballs) {
    drawFlameIcon(fireball.x - world.cameraX + 9, fireball.y + 9, 0.72);
  }
}

function drawFlameIcon(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ff4d22";
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(16, -5, 10, 17, 0, 18);
  ctx.bezierCurveTo(-13, 9, -14, -6, 0, -18);
  ctx.fill();
  ctx.fillStyle = "#ffd15c";
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.bezierCurveTo(8, -1, 5, 11, 0, 13);
  ctx.bezierCurveTo(-6, 7, -6, -2, 0, -9);
  ctx.fill();
  ctx.restore();
}

function drawFoodIcon(x, y) {
  ctx.fillStyle = "#4aa3df";
  ctx.strokeStyle = "#17344d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 6, 24, 20, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f2d28a";
  ctx.beginPath();
  ctx.arc(x + 10, y + 12, 3, 0, Math.PI * 2);
  ctx.arc(x + 18, y + 14, 3, 0, Math.PI * 2);
  ctx.arc(x + 14, y + 20, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawChuruIcon(x, y) {
  ctx.save();
  ctx.translate(x + 14, y + 14);
  ctx.rotate(-0.25);
  ctx.fillStyle = "#ff89ba";
  ctx.strokeStyle = "#61253d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-7, -17, 14, 34, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff3f7";
  ctx.fillRect(-4, -9, 8, 18);
  ctx.restore();
}

function drawGoal() {
  if (finalCeremonyTimer > 0 || finalVictory) return;

  const x = world.clearX - world.cameraX;
  ctx.fillStyle = "#48372c";
  ctx.fillRect(x, 270, 10, 180);
  ctx.fillStyle = currentStageIndex === 0 ? "#ffdf63" : "#9df7ff";
  ctx.beginPath();
  ctx.moveTo(x + 10, 274);
  ctx.lineTo(x + 100, 302);
  ctx.lineTo(x + 10, 330);
  ctx.closePath();
  ctx.fill();
}

function drawBossLine() {
  if (!currentStage.bossLineX) return;

  const x = currentStage.bossLineX - world.cameraX;
  if (x < -20 || x > canvas.width + 20) return;

  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = 5;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(x, 190);
  ctx.lineTo(x, 460);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawEnemies() {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    const x = Math.round(enemy.x - world.cameraX);
    const y = Math.round(enemy.y);
    if (x > canvas.width || x + enemy.width < 0) continue;

    ctx.save();
    const centerX = x + enemy.width / 2;
    ctx.translate(centerX, y + enemy.height);
    ctx.scale(enemy.vx < 0 ? -1 : 1, 1);
    ctx.translate(-centerX, -(y + enemy.height));
    ctx.strokeStyle = "#2d2319";
    ctx.lineWidth = 3;
    const isBorderCollie = enemy.breed === "borderCollie";
    const bodyColor = isBorderCollie ? "#f7f7f1" : "#d89a3d";
    const patchColor = isBorderCollie ? "#1f2528" : "#b9792c";
    const tailColor = isBorderCollie ? "#1f2528" : "#d89a3d";

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(x + 8, y + 15, 46, 25, 11);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(x + 44, y + 7, 24, 24, 9);
    ctx.fill();
    ctx.stroke();

    if (isBorderCollie) {
      ctx.fillStyle = patchColor;
      ctx.beginPath();
      ctx.ellipse(x + 25, y + 24, 13, 10, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 55, y + 16, 7, 8, 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = patchColor;
    ctx.beginPath();
    ctx.ellipse(x + 45, y + 19, 7, 16, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = tailColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 22);
    ctx.quadraticCurveTo(x - 4, y + 8, x + 9, y + 4);
    ctx.stroke();

    ctx.strokeStyle = "#2d2319";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 19, y + 38);
    ctx.lineTo(x + 17, y + 44);
    ctx.moveTo(x + 45, y + 38);
    ctx.lineTo(x + 47, y + 44);
    ctx.stroke();

    ctx.fillStyle = "#1b1510";
    ctx.beginPath();
    ctx.arc(x + 59, y + 16, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2d2319";
    ctx.beginPath();
    ctx.arc(x + 68, y + 22, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function drawBoss() {
  if (!boss || boss.dead) return;

  const x = boss.x - world.cameraX;
  const y = boss.y;
  if (x > canvas.width + 220 || x < -240) return;

  ctx.save();
  const centerX = x + boss.width / 2;
  ctx.translate(centerX, y + boss.height);
  ctx.scale(boss.facing, 1);
  ctx.translate(-centerX, -(y + boss.height));

  if (boss.exploding) {
    const radius = 50 + (76 - boss.explosionTimer) * 2.2;
    ctx.fillStyle = "rgba(255, 92, 38, 0.78)";
    ctx.beginPath();
    ctx.arc(x + boss.width / 2, y + boss.height / 2, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 224, 102, 0.82)";
    ctx.beginPath();
    ctx.arc(x + boss.width / 2, y + boss.height / 2, radius * 0.58, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "#141414";
  ctx.lineWidth = 5;
  ctx.fillStyle = "#2b3034";
  ctx.beginPath();
  ctx.roundRect(x + 18, y + 52, 92, 78, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f7f7f1";
  ctx.beginPath();
  ctx.roundRect(x + 74, y + 20, 58, 56, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1f2528";
  ctx.beginPath();
  ctx.ellipse(x + 88, y + 38, 14, 17, -0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f7f7f1";
  ctx.beginPath();
  ctx.ellipse(x + 30, y + 74, 22, 22, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#2b3034";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(x + 24, y + 68);
  ctx.quadraticCurveTo(x - 8, y + 36, x + 22, y + 18);
  ctx.stroke();

  ctx.strokeStyle = "#141414";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x + 42, y + 126);
  ctx.lineTo(x + 34, y + 150);
  ctx.moveTo(x + 92, y + 126);
  ctx.lineTo(x + 102, y + 150);
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(x + 105, y + 42, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1f2528";
  ctx.beginPath();
  ctx.arc(x + 132, y + 52, 6, 0, Math.PI * 2);
  ctx.fill();

    const needed = getBossRequiredHits();
  ctx.restore();

  if (boss.active && !boss.descending && !boss.exploding) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(x + 14, y - 26, 130, 12);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x + 14, y - 26, 130 * Math.min(1, boss.hitCount / needed), 12);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 14, y - 26, 130, 12);
  }
}

function drawAxes() {
  for (const axe of axes) {
    const x = axe.x - world.cameraX;
    const y = axe.y;
    if (x < -60 || x > canvas.width + 60) continue;

    ctx.save();
    ctx.translate(x + 13, y + 13);
    ctx.rotate(axe.rotation);
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(-3, -16, 6, 32);
    ctx.fillStyle = "#d1d5db";
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -16);
    ctx.lineTo(18, -8);
    ctx.lineTo(5, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawCat() {
  const x = Math.round(player.x - world.cameraX);
  const y = Math.round(player.y);
  drawCatShape(x, y, player.facing, player.hurtTimer, player.width / BASE_PLAYER_WIDTH);
  if (powers.flame) {
    const flameX = player.facing > 0 ? x + player.width + 4 : x - 8;
    drawFlameIcon(flameX, y + player.height * 0.66, 0.46);
  }
}

function drawCatShape(x, y, facing = 1, hurtTimer = 0, scale = 1) {
  const centerX = x + (BASE_PLAYER_WIDTH * scale) / 2;

  ctx.save();
  if (hurtTimer > 0 && Math.floor(hurtTimer / 6) % 2 === 0) {
    ctx.globalAlpha = 0.55;
  }
  ctx.translate(centerX, y + BASE_PLAYER_HEIGHT * scale);
  ctx.scale(facing * scale, scale);
  ctx.translate(-centerX, -(y + BASE_PLAYER_HEIGHT * scale));

  const isRainbow = powers.churuTimer > 0;
  const catFill = isRainbow ? createRainbowFill(x, y) : "#f8f8f3";

  ctx.fillStyle = catFill;
  ctx.strokeStyle = "#252b2f";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.roundRect(x + 7, y + 22, 28, 36, 10);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 8, y + 21);
  ctx.lineTo(x + 14, y + 7);
  ctx.lineTo(x + 21, y + 20);
  ctx.lineTo(x + 29, y + 7);
  ctx.lineTo(x + 35, y + 21);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(x + 21, y + 24, 17, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1d252b";
  ctx.beginPath();
  ctx.arc(x + 15, y + 22, 2.2, 0, Math.PI * 2);
  ctx.arc(x + 27, y + 22, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ef9fb0";
  ctx.beginPath();
  ctx.arc(x + 21, y + 27, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#1d252b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 30);
  ctx.lineTo(x + 2, y + 27);
  ctx.moveTo(x + 12, y + 34);
  ctx.lineTo(x + 3, y + 36);
  ctx.moveTo(x + 30, y + 30);
  ctx.lineTo(x + 40, y + 27);
  ctx.moveTo(x + 30, y + 34);
  ctx.lineTo(x + 39, y + 36);
  ctx.stroke();

  ctx.strokeStyle = catFill;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(x + 37, y + 40, 13, -1.4, 1.2);
  ctx.stroke();
  ctx.strokeStyle = "#252b2f";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function createRainbowFill(x, y) {
  const gradient = ctx.createLinearGradient(x, y, x + BASE_PLAYER_WIDTH, y + BASE_PLAYER_HEIGHT);
  gradient.addColorStop(0, "#ff4d6d");
  gradient.addColorStop(0.18, "#ffb703");
  gradient.addColorStop(0.36, "#fbff12");
  gradient.addColorStop(0.54, "#4ade80");
  gradient.addColorStop(0.72, "#38bdf8");
  gradient.addColorStop(1, "#c084fc");
  return gradient;
}

function drawHudOverlay() {
  ctx.fillStyle = "rgba(17, 33, 43, 0.72)";
  ctx.fillRect(16, 16, 260, 128);
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText(currentStage.name, 32, 42);
  ctx.fillText(`Deaths: ${player.deaths}`, 32, 64);
  ctx.fillText(`Dog hits: ${player.hits}/${getMaxHits()}`, 32, 86);
  ctx.fillText(`Flame: ${powers.flame ? "ON" : "OFF"}`, 32, 108);
  ctx.fillText(`Food: ${powers.food ? "ON" : "OFF"}`, 140, 108);
  ctx.fillText(`Churu: ${Math.ceil(powers.churuTimer / 60)}s`, 32, 130);
  drawExitButton();
}

function drawExitButton() {
  if (gameMode !== "playing") return;

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.strokeStyle = "#1f5d7a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(exitButton.x, exitButton.y, exitButton.width, exitButton.height, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#143447";
  ctx.font = "700 17px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("나가기", exitButton.x + exitButton.width / 2, exitButton.y + exitButton.height / 2);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function drawBossMessage() {
  if (!boss || boss.messageTimer <= 0) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 44px Arial";
  ctx.fillText("보스를 처치하세요", canvas.width / 2, canvas.height / 2);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function drawEndingOverlay() {
  if (endingTimer <= 0 && !endingFinished) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.92)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (endingTimer > 180) {
    ctx.font = "700 42px Arial";
    ctx.fillText("축하합니다!", canvas.width / 2, canvas.height / 2 - 36);
    ctx.fillText("모든 스테이지를 클리어 하셨습니다!", canvas.width / 2, canvas.height / 2 + 24);
  } else if (endingTimer > 0) {
    ctx.font = "700 48px Arial";
    ctx.fillText("제작자: 오냥", canvas.width / 2, canvas.height / 2);
  } else {
    ctx.font = "700 42px Arial";
    ctx.fillText("플래이해주셔셔 감사합니다!", canvas.width / 2, canvas.height / 2);
  }

  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function drawIntroScreen() {
  menuButtons = [];
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#68c9ff");
  gradient.addColorStop(0.72, "#bcecff");
  gradient.addColorStop(1, "#f7e9a8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  drawCloud(150, 96);
  drawCloud(710, 132);
  drawCloud(430, 78);

  ctx.fillStyle = "#1f2937";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 58px Arial";
  ctx.fillText("Catrio", canvas.width / 2, 160);

  const progress = loadProgress();
  ctx.font = "18px Arial";
  ctx.fillText(`이어하기: Level ${progress.level}, Stage ${progress.stageIndex + 1}`, canvas.width / 2, 216);

  drawMenuButton("play", "플레이", canvas.width / 2 - 120, 280, 240, 58);
  drawMenuButton("howto", "하는법", canvas.width / 2 - 120, 360, 240, 58);
  if (progress.completed) {
    drawMenuButton("stageSelect", "스테이지", canvas.width / 2 - 120, 440, 240, 58);
  }

  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function drawHowToScreen() {
  menuButtons = [];
  ctx.fillStyle = "#74cfff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.fillRect(96, 44, canvas.width - 192, canvas.height - 88);

  ctx.fillStyle = "#16212d";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "700 36px Arial";
  ctx.fillText("하는법", 136, 78);

  ctx.font = "18px Arial";
  const lines = [
    "A: 왼쪽 이동",
    "D: 오른쪽 이동",
    "Space: 점프",
    "마우스 좌클릭: 불꽃 능력 보유 시 불꽃 던지기",
    "강아지 죽이는법: 위에서 밟거나, 불꽃으로 맞추거나, 츄르 무적 상태로 닿기",
    "상자: 아래에서 점프해 치면 불꽃, 사료, 츄르 중 하나가 나옵니다.",
    "사료: 몸이 커지고 더 많이 맞아도 버팁니다.",
    "츄르: 1분 동안 무적이고 고양이가 무지개색이 됩니다.",
    "10스테이지: 보스를 처치한 뒤 깃발로 가세요.",
  ];

  lines.forEach((line, index) => {
    ctx.fillText(line, 136, 132 + index * 28);
  });

  drawMenuButton("back", "뒤로", canvas.width / 2 - 90, canvas.height - 70, 180, 42, 20);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function drawStageSelectScreen() {
  menuButtons = [];
  ctx.fillStyle = "#74cfff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillRect(58, 28, canvas.width - 116, canvas.height - 56);

  ctx.fillStyle = "#16212d";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 30px Arial";
  ctx.fillText("스테이지 선택", canvas.width / 2, 60);

  const buttonW = 118;
  const buttonH = 36;
  const startX = 155;
  const startY = 106;
  const gapX = 18;
  const gapY = 12;
  const levelGap = 150;

  for (let level = 1; level <= 2; level += 1) {
    ctx.fillStyle = "#143447";
    ctx.font = "700 20px Arial";
    ctx.fillText(`레벨 ${level}`, canvas.width / 2, startY + (level - 1) * levelGap - 24);

    for (let stageIndex = 0; stageIndex < stages.length; stageIndex += 1) {
      const col = stageIndex % 5;
      const row = Math.floor(stageIndex / 5);
      const x = startX + col * (buttonW + gapX);
      const y = startY + (level - 1) * levelGap + row * (buttonH + gapY);
      drawMenuButton(`select:${level}:${stageIndex}`, `${stageIndex + 1}스테이지`, x, y, buttonW, buttonH, 16);
    }
  }

  drawMenuButton("back", "뒤로", canvas.width / 2 - 90, canvas.height - 64, 180, 42, 20);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function drawMenuButton(action, label, x, y, width, height, fontSize = 24) {
  menuButtons.push({ action, x, y, width, height });
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#1f5d7a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#143447";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${fontSize}px Arial`;
  ctx.fillText(label, x + width / 2, y + height / 2);
}

function handleMenuClick(event) {
  const { x, y } = getCanvasPoint(event);
  const button = menuButtons.find((entry) => x >= entry.x && x <= entry.x + entry.width && y >= entry.y && y <= entry.y + entry.height);

  if (!button) return false;

  if (button.action === "play") {
    startGameFromProgress();
  } else if (button.action === "howto") {
    gameMode = "howto";
  } else if (button.action === "stageSelect") {
    gameMode = "stageSelect";
  } else if (button.action.startsWith("select:")) {
    const [, level, stageIndex] = button.action.split(":");
    startSelectedStage(Number(level), Number(stageIndex));
  } else if (button.action === "back") {
    gameMode = "intro";
  }

  return true;
}

function startSelectedStage(level, stageIndex) {
  currentLevel = Math.min(2, Math.max(1, level));
  gameMode = "playing";
  player.deaths = 0;
  resetPowers();
  applyStage(Math.min(stages.length - 1, Math.max(0, stageIndex)));
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function isInsideRect(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}

function exitToIntro() {
  saveProgress(currentLevel, currentStageIndex);
  powers.churuTimer = 0;
  gameMode = "intro";
  statusText.textContent = "인트로 화면";
}

function drawClearOverlay() {
  if (clearMessageTimer <= 0) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const isFinalStageClear = finalVictory && player.cleared;
  ctx.font = isFinalStageClear ? "700 42px Arial" : "700 56px Arial";

  if (isFinalStageClear) {
    ctx.fillText("축하합니다!", canvas.width / 2, canvas.height / 2 - 136);
    ctx.fillText("모든스테이지를 클리어 하셨습니다!", canvas.width / 2, canvas.height / 2 - 84);
    ctx.fillText("다음 레벨에 스테이지도 플레이 하시겠습니까?", canvas.width / 2, canvas.height / 2 - 32);
  } else {
    ctx.fillText("스테이지 클리어", canvas.width / 2, canvas.height / 2 - 78);
  }

  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";

  const catY = isFinalStageClear ? canvas.height / 2 + 158 : canvas.height / 2 + 92;
  drawCatShape(canvas.width / 2 - 10, catY, 1, 0, 2);
}

function render() {
  updateMusic();

  if (gameMode === "intro") {
    drawIntroScreen();
    return;
  }

  if (gameMode === "howto") {
    drawHowToScreen();
    return;
  }

  if (gameMode === "stageSelect") {
    drawStageSelectScreen();
    return;
  }

  drawBackground();
  drawGoal();
  drawBossLine();
  drawPlatforms();
  drawItemBoxes();
  drawItems();
  drawEnemies();
  drawFireballs();
  drawAxes();
  drawBoss();
  drawCat();
  drawHudOverlay();
  drawBossMessage();
  drawClearOverlay();
  drawEndingOverlay();
}

function gameLoop() {
  updatePlayer();
  render();
  requestAnimationFrame(gameLoop);
}

function setMobileKey(button, key, isPressed) {
  if (!button) return;

  if (isPressed) {
    keys.add(key);
    button.classList.add("is-pressed");
  } else {
    keys.delete(key);
    button.classList.remove("is-pressed");
  }
}

function bindMobileControl(button, key) {
  if (!button) return;

  button.addEventListener("contextmenu", (event) => event.preventDefault());
  button.addEventListener("selectstart", (event) => event.preventDefault());

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    ensureAudio();
    button.setPointerCapture(event.pointerId);
    setMobileKey(button, key, true);
  });

  const release = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMobileKey(button, key, false);
  };

  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", () => setMobileKey(button, key, false));
}

window.addEventListener("keydown", (event) => {
  ensureAudio();
  const key = event.key.toLowerCase();
  if (key === "a" || key === "d" || event.code === "Space") {
    event.preventDefault();
    keys.add(event.code === "Space" ? " " : key);
  }
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  if (key === "a" || key === "d" || event.code === "Space") {
    keys.delete(event.code === "Space" ? " " : key);
  }
});

canvas.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.preventDefault();
  ensureAudio();

  if (gameMode !== "playing") {
    if (handleMenuClick(event)) {
      playSound("menu");
    }
    return;
  }

  if (isInsideRect(getCanvasPoint(event), exitButton)) {
    exitToIntro();
    return;
  }

  if (boss && boss.active && (boss.descending || boss.messageTimer > 0)) return;

  if (finalVictory && player.cleared && currentLevel === 1) {
    startNextLevel();
    return;
  }

  throwFireball();
});

bindMobileControl(mobileLeftButton, "a");
bindMobileControl(mobileRightButton, "d");
bindMobileControl(mobileJumpButton, " ");

skipStageButton.addEventListener("click", () => {
  if (currentStageIndex === stages.length - 1 && currentLevel === 1) {
    startNextLevel();
    return;
  }

  const nextStageIndex = Math.min(currentStageIndex + 1, stages.length - 1);
  powers.churuTimer = 0;
  applyStage(nextStageIndex);
});

restartButton.addEventListener("click", () => {
  currentLevel = 1;
  gameMode = "playing";
  player.deaths = 0;
  resetPowers();
  applyStage(0);
});

statusText.textContent = "인트로 화면";
gameLoop();
