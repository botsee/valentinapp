const state = {
  screen: "menu",
  pack: null,
  currentQuestion: "",
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
  return `
    <h1>${state.pack.toUpperCase()}</h1>
    <div class="card">${state.currentQuestion}</div>
    <div class="buttons">
      <button onclick="nextQuestion()">Következő</button>
    </div>
    <button class="secondary small" onclick="goMenu()">Vissza</button>
  `;
}

function renderGame() {
  const currentPlayer = state.names[state.turn % 2];

  return `
    <h1>Mennyire ismersz?</h1>
    
    <div class="scoreboard">
      <div>${state.names[0]}: ${state.scores[0]}</div>
      <div>${state.names[1]}: ${state.scores[1]}</div>
    </div>

    <div class="card">${state.currentQuestion}</div>

    <div class="buttons">
      <button onclick="correct()">✔️ Helyes</button>
      <button onclick="nextTurn()">Passz</button>
    </div>

    <button class="secondary small" onclick="goMenu()">Vissza</button>
  `;
}

function startPack(pack) {
  state.pack = pack;
  state.screen = "pack";
  state.currentQuestion = randomFrom(questions[pack]);
  render();
}

function nextQuestion() {
  state.currentQuestion = randomFrom(questions[state.pack]);
  render();
}

function startGame() {
  state.screen = "game";
  state.scores = [0, 0];
  state.turn = 0;
  state.currentQuestion = randomFrom(questions.game);
  render();
}

function correct() {
  const playerIndex = state.turn % 2;
  state.scores[playerIndex]++;
  state.turn++;
  state.currentQuestion = randomFrom(questions.game);
  render();
}

function nextTurn() {
  state.turn++;
  state.currentQuestion = randomFrom(questions.game);
  render();
}

function goMenu() {
  state.screen = "menu";
  render();
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

render();
