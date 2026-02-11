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

function vibrate(ms = 40) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function render() {
  app.innerHTML = `
    <div class="phone">
      ${renderScreen()}
    </div>
  `;
  attachSwipe();
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
    <h2>👤 Kik vagytok?</h2>
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
    <div class="card" id="card">${state.currentQuestion}</div>
    <button onclick="nextCommon()">Következő</button>
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
    <div class="card" id="card">${state.currentGameQuestion}</div>
    <div class="progressBar">
      <div class="progressFill" style="width:${progress}%"></div>
    </div>
    <button onclick="correct()">✔️ Helyes</button>
    <button onclick="nextTurn()">Passzolom</button>
    <button class="secondary" onclick="goMenu()">Vissza</button>
  `;
}

function attachSwipe() {
  const card = document.getElementById("card");
  if (!card) return;

  let startX = 0;

  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 80) swipeRight();
    if (diff < -80) swipeLeft();
  });
}

function swipeRight() {
  const card = document.getElementById("card");
  card.classList.add("swipe-right");
  vibrate();
  setTimeout(() => {
    if (state.screen === "common") nextCommon();
    if (state.screen === "game") correct();
  }, 250);
}

function swipeLeft() {
  const card = document.getElementById("card");
  card.classList.add("swipe-left");
  vibrate();
  setTimeout(() => {
    if (state.screen === "common") nextCommon();
    if (state.screen === "game") nextTurn();
  }, 250);
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

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

render();
