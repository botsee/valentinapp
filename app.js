const state = {
  screen: "menu",
  pack: null,
  currentQuestion: "",
  score: 0,
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
    <h2>🔥 After Dark</h2>
    <div class="menu">
      <button onclick="startPack('romantic')">💕 Romantika</button>
      <button onclick="startPack('passion')">🔥 Szenvedély</button>
      <button onclick="startPack('sexuality')">🌙 Szexualitás</button>
      <button onclick="startPack('deep')">🧠 Mély</button>
      <button onclick="startPack('fantasy')">🎭 Fantázia</button>
      <button onclick="startPack('intimacy')">💌 Intimitás</button>
      <button onclick="startGame()">🧠 Mennyire ismersz?</button>
    </div>
  `;
}

function renderPack() {
  return `
    <h2>${state.pack.toUpperCase()}</h2>
    <div class="card">${state.currentQuestion}</div>
    <div class="buttons">
      <button onclick="nextQuestion()">Következő</button>
      <button class="secondary" onclick="goMenu()">Vissza</button>
    </div>
  `;
}

function renderGame() {
  const currentPlayer = state.names[state.turn % 2];

  return `
    <h2>${currentPlayer} válaszol</h2>
    <div class="card">${state.currentQuestion}</div>
    <div class="buttons">
      <button onclick="correct()">✔️ Helyes</button>
      <button onclick="nextTurn()">Passz</button>
    </div>
    <p>Pontszám: ${state.score}</p>
    <button class="secondary" onclick="goMenu()">Vissza</button>
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
  state.score = 0;
  state.turn = 0;
  state.currentQuestion = randomFrom(questions.game);
  render();
}

function correct() {
  state.score++;
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
