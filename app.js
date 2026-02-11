const MAX_QUESTIONS = 8;

const state = {
  screen: "menu",
  pack: null,
  packQuestions: [],
  currentIndex: 0,
  scores: [0, 0],
  turn: 0,
  names: ["Te", "Ő"]
};

const app = document.getElementById("app");

function render() {
  app.innerHTML = `
    <div class="phone">
      ${renderScreen()}
    </div>
  `;
}

function renderScreen() {
  if (state.screen === "menu") return renderMenu();
  if (state.screen === "pack") return renderPack();
  if (state.screen === "game") return renderGame();
  if (state.screen === "end") return renderEnd();
}

function renderMenu() {
  return `
    <h1>❤️ Valentin-app</h1>
    <div class="menu">
      <div class="menu-card" onclick="startPack('romantic')">💕 Romantika</div>
      <div class="menu-card" onclick="startPack('passion')">🔥 Szenvedély</div>
      <div class="menu-card" onclick="startPack('sexuality')">🌙 Szexualitás</div>
      <div class="menu-card" onclick="startPack('deep')">🧠 Mély</div>
      <div class="menu-card" onclick="startPack('fantasy')">🎭 Fantázia</div>
      <div class="menu-card" onclick="startPack('intimacy')">💌 Intimitás</div>
      <div class="menu-card" onclick="startGame()">🧠 Mennyire ismersz?</div>
    </div>
  `;
}

function renderPack() {
  const progressPercent = ((state.currentIndex + 1) / state.packQuestions.length) * 100;

  return `
    <h1>${state.pack.toUpperCase()}</h1>

    <div class="progress">
      <div class="progress-fill" style="width:${progressPercent}%"></div>
    </div>

    <div class="card">
      ${state.packQuestions[state.currentIndex]}
    </div>

    <div class="buttons">
      <button onclick="nextPackQuestion()">Következő</button>
    </div>

    <button class="secondary small" onclick="goMenu()">Vissza</button>
  `;
}

function renderGame() {
  const progressPercent = ((state.currentIndex + 1) / MAX_QUESTIONS) * 100;
  const currentPlayer = state.names[state.turn % 2];

  return `
    <h1>Mennyire ismersz?</h1>

    <div class="scoreboard">
      <div>${state.names[0]}: ${state.scores[0]}</div>
      <div>${state.names[1]}: ${state.scores[1]}</div>
    </div>

    <div class="progress">
      <div class="progress-fill" style="width:${progressPercent}%"></div>
    </div>

    <div class="card">
      ${state.packQuestions[state.currentIndex]}
    </div>

    <div class="buttons">
      <button onclick="correct()">✔️ Helyes</button>
      <button onclick="nextTurn()">Passz</button>
    </div>

    <button class="secondary small" onclick="goMenu()">Vissza</button>
  `;
}

function renderEnd() {
  return `
    <h1>Téma vége ❤️</h1>
    <div class="card">
      Szép munka! Térjetek vissza a menübe egy új körhöz.
    </div>
    <button onclick="goMenu()">Vissza a menübe</button>
  `;
}

function startPack(pack) {
  state.pack = pack;
  state.packQuestions = shuffle([...questions[pack]]).slice(0, MAX_QUESTIONS);
  state.currentIndex = 0;
  state.screen = "pack";
  render();
}

function nextPackQuestion() {
  if (state.currentIndex >= state.packQuestions.length - 1) {
    state.screen = "end";
  } else {
    state.currentIndex++;
  }
  render();
}

function startGame() {
  state.packQuestions = shuffle([...questions.game]).slice(0, MAX_QUESTIONS);
  state.currentIndex = 0;
  state.scores = [0, 0];
  state.turn = 0;
  state.screen = "game";
  render();
}

function correct() {
  const playerIndex = state.turn % 2;
  state.scores[playerIndex]++;
  nextTurn();
}

function nextTurn() {
  state.turn++;
  if (state.currentIndex >= MAX_QUESTIONS - 1) {
    state.screen = "end";
  } else {
    state.currentIndex++;
  }
  render();
}

function goMenu() {
  state.screen = "menu";
  render();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

render();
