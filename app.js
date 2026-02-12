const STORAGE_KEY = "valentinQuestions";
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

/* ------------------- INIT ------------------- */

function initQuestions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuestions));
  }
}

function getQuestions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveQuestions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ------------------- RENDER ------------------- */

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
  if (state.screen === "manage") return renderManage();
  if (state.screen === "end") return renderEnd();
}

/* ------------------- MENU ------------------- */

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
      <div class="menu-card" onclick="goManage()">⚙️ Kérdések kezelése</div>
    </div>
  `;
}

/* ------------------- PACK ------------------- */

function renderPack() {
  const progress = ((state.currentIndex + 1) / state.packQuestions.length) * 100;

  return `
    <h1>${state.pack.toUpperCase()}</h1>

    <div class="progress">
      <div class="progress-fill" style="width:${progress}%"></div>
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

function startPack(pack) {
  const data = getQuestions();
  state.pack = pack;
  state.packQuestions = shuffle([...data[pack]]).slice(0, MAX_QUESTIONS);
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

/* ------------------- GAME ------------------- */

function renderGame() {
  const progress = ((state.currentIndex + 1) / MAX_QUESTIONS) * 100;
  const currentPlayer = state.names[state.turn % 2];

  return `
    <h1>Mennyire ismersz?</h1>

    <div class="scoreboard">
      <div>${state.names[0]}: ${state.scores[0]}</div>
      <div>${state.names[1]}: ${state.scores[1]}</div>
    </div>

    <div class="progress">
      <div class="progress-fill" style="width:${progress}%"></div>
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

function startGame() {
  const data = getQuestions();
  state.packQuestions = shuffle([...data.game]).slice(0, MAX_QUESTIONS);
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

/* ------------------- MANAGE ------------------- */

function renderManage() {
  const data = getQuestions();
  const categories = Object.keys(data);

  return `
    <h1>Kérdések kezelése</h1>

    <select id="categorySelect">
      ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
    </select>

    <input id="newQuestion" placeholder="Új kérdés..." />

    <div class="buttons">
      <button onclick="addQuestion()">Hozzáadás</button>
      <button class="secondary" onclick="resetQuestions()">Alap visszaállítás</button>
    </div>

    <div id="questionList"></div>

    <button class="secondary small" onclick="goMenu()">Vissza</button>
  `;
}

function goManage() {
  state.screen = "manage";
  render();
  renderQuestionList();
}

function renderQuestionList() {
  const data = getQuestions();
  const cat = document.getElementById("categorySelect").value;
  const list = data[cat];

  const container = document.getElementById("questionList");
  container.innerHTML = list.map((q, i) =>
    `<div style="margin:6px 0; font-size:13px;">
      ${q}
      <button style="margin-left:8px; font-size:11px;" onclick="deleteQuestion('${cat}', ${i})">🗑</button>
    </div>`
  ).join("");

  document.getElementById("categorySelect").onchange = renderQuestionList;
}

function addQuestion() {
  const cat = document.getElementById("categorySelect").value;
  const text = document.getElementById("newQuestion").value.trim();
  if (!text) return;

  const data = getQuestions();
  data[cat].push(text);
  saveQuestions(data);

  document.getElementById("newQuestion").value = "";
  renderQuestionList();
}

function deleteQuestion(cat, index) {
  const data = getQuestions();
  data[cat].splice(index, 1);
  saveQuestions(data);
  renderQuestionList();
}

function resetQuestions() {
  if (!confirm("Biztosan visszaállítod az alap kérdéseket?")) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuestions));
  renderQuestionList();
}

/* ------------------- END ------------------- */

function renderEnd() {
  return `
    <h1>Kör vége ❤️</h1>
    <div class="card">
      Válasszatok új témát a folytatáshoz.
    </div>
    <button onclick="goMenu()">Vissza a menübe</button>
  `;
}

/* ------------------- UTIL ------------------- */

function goMenu() {
  state.screen = "menu";
  render();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ------------------- START ------------------- */

initQuestions();
render();
