const ROWS = [
  {
    id: "a",
    name: "あ row",
    chars: [
      ["あ", "a", "A bright apple shape opens the row."],
      ["い", "i", "Two slim lines stand like the two i's in ski."],
      ["う", "u", "A soft hook dips under an umbrella."],
      ["え", "e", "It has the energy of an elegant person bowing."],
      ["お", "o", "A round loop helps you remember the o sound."]
    ]
  },
  {
    id: "ka",
    name: "か row",
    chars: [
      ["か", "ka", "The side stroke cuts like a little karate chop."],
      ["き", "ki", "It looks like a key with crossing teeth."],
      ["く", "ku", "A beak-like bend says koo."],
      ["け", "ke", "A gate with a long post keeps the ke sound."],
      ["こ", "ko", "Two calm strokes form a cozy corner."]
    ]
  },
  {
    id: "sa",
    name: "さ row",
    chars: [
      ["さ", "sa", "The crossed top feels like a signpost saying sa."],
      ["し", "shi", "A fishing hook curves like she pulled the line."],
      ["す", "su", "A small swirl slides into the su sound."],
      ["せ", "se", "Several strokes settle into se."],
      ["そ", "so", "A zig and sweep make a soaring shape."]
    ]
  },
  {
    id: "ta",
    name: "た row",
    chars: [
      ["た", "ta", "The left side taps down like ta."],
      ["ち", "chi", "It starts tall, then curls like a cheerful chi."],
      ["つ", "tsu", "A wave rolls forward: tsu."],
      ["て", "te", "A hand-like curve reaches out for te."],
      ["と", "to", "A toe-shaped hook steps into to."]
    ]
  },
  {
    id: "na",
    name: "な row",
    chars: [
      ["な", "na", "Several strokes knot together like na."],
      ["に", "ni", "Two vertical marks help you hear ni."],
      ["ぬ", "nu", "A loop and tail wind into nu."],
      ["ね", "ne", "A curled stem nests the ne sound."],
      ["の", "no", "A single loop is easy: no."]
    ]
  },
  {
    id: "ha",
    name: "は row",
    chars: [
      ["は", "ha", "A tall post and loop hold ha."],
      ["ひ", "hi", "A wide smile says hi."],
      ["ふ", "fu", "Light floating strokes breathe fu."],
      ["へ", "he", "A little hill points to he."],
      ["ほ", "ho", "A post and crossbars hold ho."]
    ]
  },
  {
    id: "ma",
    name: "ま row",
    chars: [
      ["ま", "ma", "The rounded bottom makes ma feel warm."],
      ["み", "mi", "A musical curve starts mi."],
      ["む", "mu", "The loop tucks under like mu."],
      ["め", "me", "A soft loop closes like me."],
      ["も", "mo", "A fishing line with two marks says mo."]
    ]
  },
  {
    id: "ya",
    name: "や row",
    chars: [
      ["や", "ya", "A hooked shape yanks the ya sound."],
      ["ゆ", "yu", "A sweeping curve loops like yu."],
      ["よ", "yo", "A small hook and curl call yo."]
    ]
  },
  {
    id: "ra",
    name: "ら row",
    chars: [
      ["ら", "ra", "A small top mark leads into a ra curve."],
      ["り", "ri", "Two reeds stand together for ri."],
      ["る", "ru", "A curl rolls into ru."],
      ["れ", "re", "A stem bends and reaches for re."],
      ["ろ", "ro", "A square-ish loop rolls into ro."]
    ]
  },
  {
    id: "wa",
    name: "わ row",
    chars: [
      ["わ", "wa", "A waving curve starts with wa."],
      ["を", "wo", "A complex loop marks the object particle wo."]
    ]
  },
  {
    id: "n",
    name: "ん",
    chars: [["ん", "n", "A final sweeping curve hums n."]]
  }
];

const STORAGE_KEY = "hiragana-garden-progress-v1";
const CARD_IDS = ROWS.flatMap((row) => row.chars.map(([kana]) => kana));
const DATA = new Map(
  ROWS.flatMap((row, rowIndex) =>
    row.chars.map(([kana, romaji, mnemonic]) => [
      kana,
      { kana, romaji, mnemonic, rowId: row.id, rowIndex, rowName: row.name }
    ])
  )
);

const state = {
  view: "today",
  activeRowId: "a",
  quizMode: "kanaToRomaji",
  sessionMode: "new",
  sessionCard: null,
  learnCard: null,
  quizCard: null,
  drawCard: null,
  progress: loadProgress()
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  rowList: document.querySelector("#rowList"),
  masteredCount: document.querySelector("#masteredCount"),
  dueCount: document.querySelector("#dueCount"),
  activeRowName: document.querySelector("#activeRowName"),
  resetProgress: document.querySelector("#resetProgress"),
  dailyGoalText: document.querySelector("#dailyGoalText"),
  sessionModeLabel: document.querySelector("#sessionModeLabel"),
  sessionStepLabel: document.querySelector("#sessionStepLabel"),
  sessionCharacter: document.querySelector("#sessionCharacter"),
  sessionRomaji: document.querySelector("#sessionRomaji"),
  sessionMnemonic: document.querySelector("#sessionMnemonic"),
  sessionStrokeGuide: document.querySelector("#sessionStrokeGuide"),
  sessionFeedback: document.querySelector("#sessionFeedback"),
  sessionPracticeTyping: document.querySelector("#sessionPracticeTyping"),
  sessionPracticeDrawing: document.querySelector("#sessionPracticeDrawing"),
  sessionComplete: document.querySelector("#sessionComplete"),
  sessionChoices: document.querySelectorAll(".choice-button"),
  flashcard: document.querySelector("#flashcard"),
  learnKana: document.querySelector("#learnKana"),
  learnAnswer: document.querySelector("#learnAnswer"),
  learnMnemonic: document.querySelector("#learnMnemonic"),
  learnRow: document.querySelector("#learnRow"),
  learnStatus: document.querySelector("#learnStatus"),
  againCard: document.querySelector("#againCard"),
  goodCard: document.querySelector("#goodCard"),
  quizModeLabel: document.querySelector("#quizModeLabel"),
  swapQuizMode: document.querySelector("#swapQuizMode"),
  quizPrompt: document.querySelector("#quizPrompt"),
  quizForm: document.querySelector("#quizForm"),
  quizInput: document.querySelector("#quizInput"),
  quizInputLabel: document.querySelector("#quizInputLabel"),
  quizFeedback: document.querySelector("#quizFeedback"),
  quizMnemonic: document.querySelector("#quizMnemonic"),
  guideCanvas: document.querySelector("#guideCanvas"),
  drawCanvas: document.querySelector("#drawCanvas"),
  drawPromptLabel: document.querySelector("#drawPromptLabel"),
  drawTargetRomaji: document.querySelector("#drawTargetRomaji"),
  drawMeter: document.querySelector("#drawMeter"),
  drawScore: document.querySelector("#drawScore"),
  drawFeedback: document.querySelector("#drawFeedback"),
  drawMnemonic: document.querySelector("#drawMnemonic"),
  drawKanaPreview: document.querySelector("#drawKanaPreview"),
  clearDrawing: document.querySelector("#clearDrawing"),
  nextDrawing: document.querySelector("#nextDrawing"),
  troubleGrid: document.querySelector("#troubleGrid"),
  progressGrid: document.querySelector("#progressGrid")
};

const draw = {
  drawing: false,
  lastPoint: null,
  guidePixels: null,
  completed: false,
  ctx: els.drawCanvas.getContext("2d"),
  guideCtx: els.guideCanvas.getContext("2d")
};

function loadProgress() {
  const base = {
    unlockedRows: ["a"],
    cards: Object.fromEntries(
    CARD_IDS.map((kana) => [
      kana,
        {
          attempts: 0,
          correct: 0,
          streak: 0,
          ease: 2.3,
          interval: 0,
          due: Date.now(),
          state: "new",
          misses: 0,
          completedOn: "",
          bestDraw: 0
        }
      ])
    )
  };
  base.unlockedRows = ROWS.map((row) => row.id);

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !saved.cards) return base;
    return {
      unlockedRows: ROWS.map((row) => row.id),
      cards: Object.fromEntries(
        CARD_IDS.map((kana) => {
          const card = { ...base.cards[kana], ...saved.cards[kana] };
          if (card.correct > 0) card.state = "mastered";
          return [kana, card];
        })
      )
    };
  } catch {
    return base;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function rowById(rowId) {
  return ROWS.find((row) => row.id === rowId) || ROWS[0];
}

function activeCards() {
  return rowById(state.activeRowId).chars.map(([kana]) => DATA.get(kana));
}

function dueCards(cards = activeCards()) {
  const now = Date.now();
  return cards.filter((card) => state.progress.cards[card.kana].due <= now);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function pickCard(cards = activeCards()) {
  const pool = dueCards(cards);
  const source = pool.length ? pool : cards;
  return source
    .slice()
    .sort((a, b) => {
      const ap = state.progress.cards[a.kana];
      const bp = state.progress.cards[b.kana];
      return ap.due - bp.due || ap.correct - bp.correct;
    })[0];
}

function troubleCards(cards = activeCards()) {
  return cards.filter((card) => {
    const progress = state.progress.cards[card.kana];
    return progress.misses > 0 || (progress.bestDraw > 0 && progress.bestDraw < 95);
  });
}

function sessionCards(mode = state.sessionMode) {
  const cards = activeCards();
  if (mode === "new") {
    const unfinished = cards.filter((card) => state.progress.cards[card.kana].state !== "mastered");
    return unfinished.length ? unfinished : cards;
  }
  if (mode === "review") {
    const completed = cards.filter((card) => state.progress.cards[card.kana].state === "mastered");
    return completed.length ? completed : cards;
  }
  if (mode === "trouble") {
    const trouble = troubleCards(cards);
    return trouble.length ? trouble : cards;
  }
  return cards;
}

function pickSessionCard(mode = state.sessionMode) {
  return pickCard(sessionCards(mode));
}

function statusFor(kana) {
  const card = state.progress.cards[kana];
  if (card.state === "mastered") return "completed";
  if (card.state === "review") return "review";
  if (card.attempts > 0) return "learning";
  return "new";
}

function recordAnswer(kana, quality, options = {}) {
  const { rerender = true } = options;
  const card = state.progress.cards[kana];
  const now = Date.now();
  const correct = quality >= 3;
  const wasCompleted = card.state === "mastered";
  card.attempts += 1;
  card.correct += correct ? 1 : 0;
  card.streak = correct ? card.streak + 1 : 0;

  if (correct) {
    card.ease = Math.max(1.4, card.ease + 0.04);
    card.interval = Math.max(1, card.interval);
    card.due = now + card.interval * 24 * 60 * 60 * 1000;
    card.state = "mastered";
    card.misses = 0;
    card.completedOn ||= todayKey();
    if (!wasCompleted) celebrate();
  } else {
    card.ease = Math.max(1.3, card.ease - 0.18);
    card.interval = 0;
    card.due = now + 8 * 60 * 1000;
    card.state = wasCompleted ? "mastered" : "learning";
    card.misses += 1;
  }

  unlockRows();
  saveProgress();
  if (rerender) renderAll();
}

function celebrate() {
  const blossom = document.createElement("div");
  blossom.className = "blossom-pop";
  blossom.textContent = "✿";
  document.body.append(blossom);
  window.setTimeout(() => blossom.remove(), 900);
}

function unlockRows() {
  ROWS.forEach((row, index) => {
    if (!state.progress.unlockedRows.includes(row.id)) {
      state.progress.unlockedRows.push(row.id);
    }
  });
}

function renderAll() {
  renderToday();
  renderRows();
  renderStats();
  renderLearn();
  renderQuiz();
  renderProgress();
  if (state.view === "draw") renderDrawCard();
}

function renderStats() {
  const cards = Object.values(state.progress.cards);
  els.masteredCount.textContent = cards.filter((card) => card.state === "mastered").length;
  els.dueCount.textContent = troubleCards(ROWS.flatMap((row) => row.chars.map(([kana]) => DATA.get(kana)))).length;
  els.activeRowName.textContent = rowById(state.activeRowId).name;
}

function renderToday() {
  state.sessionCard ||= pickSessionCard();
  const card = state.sessionCard;
  const completedToday = Object.values(state.progress.cards).filter((progress) => progress.completedOn === todayKey()).length;
  els.dailyGoalText.textContent = `${Math.min(completedToday, 5)}/5 completed`;
  els.sessionModeLabel.textContent = modeLabel(state.sessionMode);
  els.sessionStepLabel.textContent = `${card.rowName} · ${statusFor(card.kana)}`;
  els.sessionCharacter.textContent = card.kana;
  els.sessionRomaji.textContent = card.romaji;
  els.sessionMnemonic.textContent = card.mnemonic;
  els.sessionStrokeGuide.textContent = strokeGuideFor(card.kana);
  els.sessionChoices.forEach((button) => button.classList.toggle("active", button.dataset.session === state.sessionMode));
  if (!els.sessionFeedback.textContent) {
    els.sessionFeedback.textContent = "Start with the character, then type or draw it when ready.";
  }
}

function modeLabel(mode) {
  return {
    new: "Learn new",
    quiz: "Typing practice",
    draw: "Drawing practice",
    review: "Review",
    trouble: "Trouble characters"
  }[mode] || "Guided practice";
}

function strokeGuideFor(kana) {
  const guide = {
    あ: "Three strokes: horizontal first, vertical curve second, loop last.",
    い: "Two strokes: left curved line, then the shorter right line.",
    う: "Two strokes: small top stroke, then the main curved stroke.",
    え: "Two strokes: small top stroke, then the long angled body.",
    お: "Three strokes: horizontal, vertical curve, then the small side mark.",
    か: "Three strokes: main angled body, right sweep, then small mark.",
    き: "Four strokes: two top lines, vertical curve, then lower curve.",
    く: "One stroke: angled bend from upper left to lower right.",
    け: "Three strokes: left vertical, top cross stroke, right vertical curve.",
    こ: "Two strokes: top line, then lower line.",
    さ: "Three strokes: top line, vertical curve, then lower curve.",
    し: "One stroke: curve down and up in one smooth motion.",
    す: "Two strokes: top line, then the loop and tail.",
    せ: "Three strokes: long horizontal, left vertical, right curve.",
    そ: "One stroke: zig forward, then sweep down.",
    た: "Four strokes: left cross shape first, then the two right strokes.",
    ち: "Two strokes: top line, then long curve.",
    つ: "One stroke: broad left-to-right curve.",
    て: "One stroke: top sweep into the lower curve.",
    と: "Two strokes: small diagonal, then the main curved stroke.",
    な: "Four strokes: left cross shape, small right mark, then loop.",
    に: "Three strokes: left vertical, then two right lines.",
    ぬ: "Two strokes: sweeping loop, then crossing tail.",
    ね: "Two strokes: left vertical, then looping right stroke.",
    の: "One stroke: single circular sweep.",
    は: "Three strokes: left vertical, right vertical, then loop.",
    ひ: "One stroke: wide curve from left to right.",
    ふ: "Four strokes: small top, center curve, then two lower marks.",
    へ: "One stroke: peak shape from left to right.",
    ほ: "Four strokes: left vertical, two cross lines, then loop.",
    ま: "Three strokes: two horizontal lines, then vertical loop.",
    み: "Two strokes: main curve, then short finishing stroke.",
    む: "Three strokes: top line, loop body, then small mark.",
    め: "Two strokes: long curve, then crossing loop.",
    も: "Three strokes: main vertical curve, then two short lines.",
    や: "Three strokes: short left stroke, long hook, then small top mark.",
    ゆ: "Two strokes: left curve, then long looping stroke.",
    よ: "Two strokes: horizontal line, then hook and loop.",
    ら: "Two strokes: small top mark, then main curve.",
    り: "Two strokes: left stroke, then longer right stroke.",
    る: "One stroke: angled curve into the lower loop.",
    れ: "Two strokes: left vertical, then the bending right stroke.",
    ろ: "One stroke: angled line into the lower curve.",
    わ: "Two strokes: left vertical, then the looping right stroke.",
    を: "Three strokes: top line, vertical curve, then sweeping lower stroke.",
    ん: "One stroke: long wave-like curve."
  };
  return guide[kana] || "Write from top to bottom and left to right.";
}

function renderRows() {
  els.rowList.innerHTML = "";
  ROWS.forEach((row) => {
    const mastered = row.chars.filter(([kana]) => state.progress.cards[kana].state === "mastered").length;
    const done = mastered === row.chars.length;
    const button = document.createElement("button");
    button.className = `row-button ${row.id === state.activeRowId ? "active" : ""} ${done ? "done" : ""}`;
    button.disabled = false;
    button.innerHTML = `
      <span>
        <strong>${row.name}</strong>
        <small>${row.chars.map(([kana]) => kana).join(" ")}</small>
      </span>
      <span class="row-pill">${done ? "✓" : `${mastered}/${row.chars.length}`}</span>
    `;
    button.addEventListener("click", () => {
      state.activeRowId = row.id;
      state.learnCard = pickCard();
      state.quizCard = pickCard();
      state.drawCard = pickCard();
      state.sessionCard = pickSessionCard();
      clearDrawing();
      renderAll();
    });
    els.rowList.append(button);
  });
}

function renderLearn() {
  state.learnCard ||= pickCard();
  const card = state.learnCard;
  els.learnKana.textContent = card.kana;
  els.learnAnswer.textContent = card.romaji;
  els.learnAnswer.classList.add("hidden");
  els.learnMnemonic.textContent = card.mnemonic;
  els.learnRow.textContent = card.rowName;
  els.learnStatus.textContent = statusFor(card.kana);
}

function renderQuiz() {
  state.quizCard ||= pickCard();
  const card = state.quizCard;
  const reverse = state.quizMode === "romajiToKana";
  els.quizModeLabel.textContent = reverse ? "Romaji to kana" : "Kana to romaji";
  els.quizPrompt.textContent = reverse ? card.romaji : card.kana;
  els.quizPrompt.classList.toggle("romaji", reverse);
  els.quizInputLabel.textContent = reverse ? "Type or paste the hiragana" : "Type the romaji";
  els.quizInput.value = "";
  els.quizMnemonic.textContent = card.mnemonic;
}

function renderProgress() {
  renderTrouble();
  els.progressGrid.innerHTML = "";
  ROWS.forEach((row) => {
    row.chars.forEach(([kana, romaji]) => {
      const progress = state.progress.cards[kana];
      const tile = document.createElement("article");
      tile.className = `kana-tile ${progress.state}`;
      tile.innerHTML = `
        <strong>${kana}</strong>
        <span>${romaji}</span>
        <small>${statusFor(kana)} · misses ${progress.misses}</small>
        <small>draw best ${Math.round(progress.bestDraw)}%</small>
      `;
      els.progressGrid.append(tile);
    });
  });
}

function renderTrouble() {
  const trouble = troubleCards(ROWS.flatMap((row) => row.chars.map(([kana]) => DATA.get(kana))));
  els.troubleGrid.innerHTML = "";
  if (!trouble.length) {
    els.troubleGrid.innerHTML = "<p>No trouble characters yet.</p>";
    return;
  }
  trouble.slice(0, 10).forEach((card) => {
    const button = document.createElement("button");
    button.className = "trouble-chip";
    button.textContent = `${card.kana} ${card.romaji}`;
    button.addEventListener("click", () => {
      state.activeRowId = card.rowId;
      state.sessionMode = "trouble";
      state.sessionCard = card;
      setView("today");
      els.sessionFeedback.textContent = "Trouble character loaded.";
      renderAll();
    });
    els.troubleGrid.append(button);
  });
}

function renderDrawCard() {
  state.drawCard ||= pickCard();
  const card = state.drawCard;
  els.drawTargetRomaji.textContent = card.romaji;
  els.drawKanaPreview.textContent = card.kana;
  els.drawMnemonic.textContent = card.mnemonic;
  drawGuide(card.kana);
  clearDrawing(false);
}

function drawGuide(kana) {
  const ctx = draw.guideCtx;
  const canvas = els.guideCanvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(233, 129, 162, 0.22)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '310px "Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif';
  ctx.fillText(kana, canvas.width / 2, canvas.height / 2 + 10);
  draw.guidePixels = binaryPixels(ctx.getImageData(0, 0, canvas.width, canvas.height), 20);
}

function clearDrawing(resetFeedback = true) {
  draw.ctx.clearRect(0, 0, els.drawCanvas.width, els.drawCanvas.height);
  draw.completed = false;
  els.drawMeter.value = 0;
  els.drawScore.textContent = "0%";
  els.nextDrawing.disabled = true;
  if (resetFeedback) {
    els.drawFeedback.className = "feedback";
    els.drawFeedback.textContent = "Trace the blossom-pink guide until your match reaches 95%.";
  }
}

function canvasPoint(event) {
  const rect = els.drawCanvas.getBoundingClientRect();
  const client = event.touches?.[0] || event;
  return {
    x: ((client.clientX - rect.left) / rect.width) * els.drawCanvas.width,
    y: ((client.clientY - rect.top) / rect.height) * els.drawCanvas.height
  };
}

function startDraw(event) {
  event.preventDefault();
  draw.drawing = true;
  draw.lastPoint = canvasPoint(event);
}

function moveDraw(event) {
  if (!draw.drawing) return;
  event.preventDefault();
  const point = canvasPoint(event);
  const ctx = draw.ctx;
  ctx.strokeStyle = "#312832";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(draw.lastPoint.x, draw.lastPoint.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  draw.lastPoint = point;
  checkDrawing();
}

function endDraw() {
  if (!draw.drawing) return;
  draw.drawing = false;
  draw.lastPoint = null;
  checkDrawing();
}

function binaryPixels(imageData, threshold) {
  const data = imageData.data;
  const pixels = new Uint8Array(imageData.width * imageData.height);
  for (let i = 3, p = 0; i < data.length; i += 4, p += 1) {
    pixels[p] = data[i] > threshold ? 1 : 0;
  }
  return pixels;
}

function dilatePixels(source, width, height, radius) {
  const out = new Uint8Array(source.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!source[index]) continue;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) out[ny * width + nx] = 1;
        }
      }
    }
  }
  return out;
}

function checkDrawing() {
  const width = els.drawCanvas.width;
  const height = els.drawCanvas.height;
  const user = binaryPixels(draw.ctx.getImageData(0, 0, width, height), 20);
  const userWide = dilatePixels(user, width, height, 12);
  const guideWide = dilatePixels(draw.guidePixels, width, height, 10);
  let guideCount = 0;
  let userCount = 0;
  let covered = 0;
  let precise = 0;
  const userBox = boundsFor(user, width, height);
  const guideBox = boundsFor(draw.guidePixels, width, height);

  for (let i = 0; i < user.length; i += 1) {
    if (draw.guidePixels[i]) {
      guideCount += 1;
      if (userWide[i]) covered += 1;
    }
    if (user[i]) {
      userCount += 1;
      if (guideWide[i]) precise += 1;
    }
  }

  const coverage = guideCount ? covered / guideCount : 0;
  const precision = userCount ? precise / userCount : 0;
  const score = Math.round(Math.min(100, (coverage * 0.78 + precision * 0.22) * 100));
  const progress = state.progress.cards[state.drawCard.kana];
  progress.bestDraw = Math.max(progress.bestDraw, score);
  els.drawMeter.value = score;
  els.drawScore.textContent = `${score}%`;

  if (score >= 95) {
    els.drawFeedback.className = "feedback good";
    els.drawFeedback.textContent = "95% reached. Completed.";
    els.nextDrawing.disabled = false;
    if (!draw.completed) {
      draw.completed = true;
      recordAnswer(state.drawCard.kana, 5, { rerender: false });
      if (state.sessionCard?.kana === state.drawCard.kana) {
        els.sessionFeedback.className = "feedback good";
        els.sessionFeedback.textContent = `${state.drawCard.kana} completed from drawing practice.`;
      }
    }
  } else if (score >= 75) {
    els.drawFeedback.className = "feedback";
    els.drawFeedback.textContent = drawingHint({ coverage, precision, userBox, guideBox, width, height });
  } else {
    els.drawFeedback.className = "feedback miss";
    els.drawFeedback.textContent = drawingHint({ coverage, precision, userBox, guideBox, width, height });
  }
  saveProgress();
  renderStats();
  renderRows();
  renderToday();
  renderProgress();
}

function boundsFor(pixels, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!pixels[y * width + x]) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < 0) return null;
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function drawingHint({ coverage, precision, userBox, guideBox, width, height }) {
  if (!userBox || !guideBox) return "Start tracing the pale guide.";
  if (userBox.width < guideBox.width * 0.7 || userBox.height < guideBox.height * 0.7) return "Too small. Use more of the guide shape.";
  if (userBox.width > guideBox.width * 1.35 || userBox.height > guideBox.height * 1.35) return "Too large. Stay closer to the pale guide.";
  const userCenterX = userBox.minX + userBox.width / 2;
  const guideCenterX = guideBox.minX + guideBox.width / 2;
  const userCenterY = userBox.minY + userBox.height / 2;
  const guideCenterY = guideBox.minY + guideBox.height / 2;
  if (Math.abs(userCenterX - guideCenterX) > width * 0.08) return userCenterX < guideCenterX ? "Shift right. The shape is too far left." : "Shift left. The shape is too far right.";
  if (Math.abs(userCenterY - guideCenterY) > height * 0.08) return userCenterY < guideCenterY ? "Shift down. The shape is too high." : "Shift up. The shape is too low.";
  if (precision < 0.72) return "Too much ink outside the guide. Stay closer to the pale shape.";
  if (coverage < 0.9) return "Close. Cover more of the missing pale areas.";
  return "Almost there. Add the small missing details.";
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function setView(viewName) {
  state.view = viewName;
  els.tabs.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  els.views.forEach((view) => view.classList.toggle("active", view.id === `${viewName}View`));
  if (viewName === "draw") {
    state.drawCard = state.sessionCard || pickCard();
    renderDrawCard();
  }
}

els.tabs.forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));

els.sessionChoices.forEach((button) => {
  button.addEventListener("click", () => {
    state.sessionMode = button.dataset.session;
    state.sessionCard = pickSessionCard();
    els.sessionFeedback.className = "feedback";
    els.sessionFeedback.textContent = state.sessionMode === "trouble" && !troubleCards(activeCards()).length
      ? "No trouble characters in this row yet, so here is a regular practice character."
      : "Start with the character, then type or draw it when ready.";
    if (state.sessionMode === "quiz") {
      state.quizCard = state.sessionCard;
      state.quizMode = "kanaToRomaji";
    }
    if (state.sessionMode === "draw") state.drawCard = state.sessionCard;
    renderAll();
  });
});

els.sessionPracticeTyping.addEventListener("click", () => {
  state.quizCard = state.sessionCard;
  state.quizMode = "kanaToRomaji";
  setView("quiz");
  renderQuiz();
  els.quizInput.focus();
});

els.sessionPracticeDrawing.addEventListener("click", () => {
  state.drawCard = state.sessionCard;
  setView("draw");
});

els.sessionComplete.addEventListener("click", () => {
  recordAnswer(state.sessionCard.kana, 5, { rerender: false });
  els.sessionFeedback.className = "feedback good";
  els.sessionFeedback.textContent = `${state.sessionCard.kana} completed.`;
  state.sessionCard = pickSessionCard();
  renderAll();
});

els.flashcard.addEventListener("click", () => {
  els.learnAnswer.classList.toggle("hidden");
});

els.againCard.addEventListener("click", () => {
  recordAnswer(state.learnCard.kana, 1, { rerender: false });
  state.learnCard = pickCard();
  renderAll();
});

els.goodCard.addEventListener("click", () => {
  recordAnswer(state.learnCard.kana, 4, { rerender: false });
  state.learnCard = pickCard();
  renderAll();
});

els.swapQuizMode.addEventListener("click", () => {
  state.quizMode = state.quizMode === "kanaToRomaji" ? "romajiToKana" : "kanaToRomaji";
  state.quizCard = pickCard();
  els.quizFeedback.textContent = "";
  renderQuiz();
  els.quizInput.focus();
});

els.quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const card = state.quizCard;
  const expected = state.quizMode === "kanaToRomaji" ? card.romaji : card.kana;
  const correct = normalizeAnswer(els.quizInput.value) === normalizeAnswer(expected);
  els.quizFeedback.className = `feedback ${correct ? "good" : "miss"}`;
  els.quizFeedback.textContent = correct ? "Correct. Completed." : `Not quite. Answer: ${expected}`;
  recordAnswer(card.kana, correct ? 5 : 1, { rerender: false });
  if (state.sessionCard?.kana === card.kana) {
    els.sessionFeedback.className = `feedback ${correct ? "good" : "miss"}`;
    els.sessionFeedback.textContent = correct ? `${card.kana} completed from typing practice.` : `${card.kana} needs another try.`;
  }
  state.quizCard = pickCard();
  renderStats();
  renderRows();
  renderToday();
  renderProgress();
  window.setTimeout(() => {
    els.quizFeedback.textContent = "";
    renderQuiz();
    els.quizInput.focus();
  }, correct ? 650 : 1400);
});

els.clearDrawing.addEventListener("click", () => clearDrawing());
els.nextDrawing.addEventListener("click", () => {
  state.drawCard = pickCard();
  renderDrawCard();
});

["mousedown", "touchstart"].forEach((type) => els.drawCanvas.addEventListener(type, startDraw, { passive: false }));
["mousemove", "touchmove"].forEach((type) => els.drawCanvas.addEventListener(type, moveDraw, { passive: false }));
["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((type) => els.drawCanvas.addEventListener(type, endDraw));

els.resetProgress.addEventListener("click", () => {
  const confirmed = window.confirm("Reset all hiragana progress?");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  state.progress = loadProgress();
  state.activeRowId = "a";
  state.sessionMode = "new";
  state.sessionCard = pickSessionCard();
  state.learnCard = pickCard();
  state.quizCard = pickCard();
  state.drawCard = pickCard();
  renderAll();
});

renderAll();
