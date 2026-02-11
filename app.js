const PIN = "0214";

const state = {
  screen: "pin",
  mood: "soft",
  score: 0,
  turn: 0,
  names: [],
  currentQuestion: "",
  currentGameQuestion: ""
};

const app = document.getElementById("app");

function render() {
  app.innerHTML = `
    <div class="phone">
      <div class="hearts" id="hearts"></div>
      ${renderScreen()}
    </div>
  `;
  createHearts();
}

function renderScreen() {
  if (state.screen === "pin") return renderPin();
  if (state.screen === "names") return renderNames();
  if (state.screen === "menu") return renderMenu();
  if (state.screen === "common") return renderCommon();
  if (state.screen === "game") return renderGame();
}

function renderPin() {
  return `
    <h2>🔐 Private Access</h2>
    <input id="pinInput" type="password" maxlength="4" placeholder="4 számjegy" />
    <button onclick="checkPin()">Belépés</button>
  `;
}

function renderNames() {
  return `
    <h2>👤 Kik vagytok ma este?</h2>
    <input id="name1" placeholder="Első név" />
    <input id="name2" placeholder="Második név" />
    <button onclick="saveNames()">Tovább</button>
  `;
}

function renderMenu() {
  return `
    <h2>🔥 After Dark</h2>
    <button onclick="goCommon()">💕 Közös kérdések</button>
    <button onclick="goGame()">🧠 Mennyire ismersz?</button>
  `;
}

function renderCommon() {
  if (!state.currentQuestion)
    state.currentQuestion = randomFrom(getQuestions());

  return `
    <h2>Közös mód</h2>

    <div class="toggle">
      <button class="${state.mood === "soft" ? "activeToggle" : "secondary"}"
        onclick="changeMood('soft')">Romantikus</button>
      <button class="${state.mood === "wild" ? "activeToggle" : "secondary"}"
        onclick="changeMood('wild')">Vadabb</button>
    </div>

    <div class="card">${state.currentQuestion}</div>

    <button onclick="nextCommon()">Következő</button>
    <button onclick="addCustom()">➕ Saját kérdés</button>
    <button class="secondary" onclick="goMenu()">Vissza</button>
  `;
}

function renderGame() {
  if (!state.currentGameQuestion)
    state.currentGameQuestion = randomFrom(questions.game);

  const currentName = state.names[state.turn % 2];
  const progress = Math.min((state.score / 10) * 100, 100);

  return `
    <h2>${currentName} kérdez</h2>

    <div class="card">${state.currentGameQuestion}</div>

    <button onclick="correct()">✔️ Helyes</button>
    <button onclick="nextTurn()">Passzolom</button>

    <div class="score">Pont: ${state.score}</div>

    <div class="progressBar">
      <div class="progressFill" style="width:${progress}%"></div>
    </div>

    <button class="secondary" onclick="goMenu()">Vissza</button>
  `;
}

function checkPin() {
  const input = document.getElementById("pinInput").value;
  if (input === PIN) {
    state.screen = "names";
    render();
  }
}

function saveNames() {
  const n1 = document.getElementById("name1").value;
  const n2 = document.getElementById("name2").value;
  if (!n1 || !n2) return;
  state.names = [n1, n2];
  state.screen = "menu";
  render();
}

function goMenu() { state.screen = "menu"; render(); }
function goCommon() { state.screen = "common"; state.currentQuestion=""; render(); }
function goGame() { state.screen = "game"; state.currentGameQuestion=""; render(); }

function changeMood(m) {
  state.mood = m;
  state.currentQuestion = randomFrom(getQuestions());
  render();
}

function nextCommon() {
  state.currentQuestion = randomFrom(getQuestions());
  render();
}

function correct() {
  state.score++;
  state.turn++;
  state.currentGameQuestion = randomFrom(questions.game);
  render();
}

function nextTurn() {
  state.turn++;
  state.currentGameQuestion = randomFrom(questions.game);
  render();
}

function getQuestions() {
  const custom = JSON.parse(localStorage.getItem("custom_" + state.mood)) || [];
  return [...questions[state.mood], ...custom];
}

function addCustom() {
  const q = prompt("Írd be az új kérdést:");
  if (!q) return;
  const key = "custom_" + state.mood;
  const arr = JSON.parse(localStorage.getItem(key)) || [];
  arr.push(q);
  localStorage.setItem(key, JSON.stringify(arr));
  alert("Mentve 🔥");
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createHearts() {
  const container = document.getElementById("hearts");
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.innerText = "🖤";
    h.style.left = Math.random() * 100 + "%";
    h.style.animationDuration = 5 + Math.random() * 5 + "s";
    container.appendChild(h);
  }
}

render();
