const PIN = "2025";

const state = {
  screen: "pin",
  mood: "soft",
  score: 0,
  turn: 0,
  names: []
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
    <h2>🔐 PIN</h2>
    <input id="pinInput" type="password" maxlength="4" placeholder="4 számjegy" />
    <button onclick="checkPin()">Belépés</button>
  `;
}

function renderNames() {
  return `
    <h2>👤 Nevek</h2>
    <input id="name1" placeholder="Első név" />
    <input id="name2" placeholder="Második név" />
    <button onclick="saveNames()">Tovább</button>
  `;
}

function renderMenu() {
  return `
    <h2>💖 Menü</h2>
    <button onclick="goCommon()">💕 Közös kérdések</button>
    <button onclick="goGame()">🧠 Mennyire ismersz?</button>
  `;
}

function renderCommon() {
  const list = getQuestions();
  const q = randomFrom(list);

  return `
    <h2>Közös mód</h2>
    <div class="toggle">
      <button class="secondary" onclick="setMood('soft')">Romantikus</button>
      <button class="secondary" onclick="setMood('wild')">Vadabb</button>
    </div>
    <div class="card">${q}</div>
    <button onclick="render()">Következő</button>
    <button onclick="addCustom()">➕ Saját kérdés</button>
    <button class="secondary" onclick="goMenu()">Vissza</button>
  `;
}

function renderGame() {
  const q = randomFrom(questions.game);
  const currentName = state.names[state.turn % 2];

  return `
    <h2>${currentName} kérdez</h2>
    <div class="card">${q}</div>
    <button onclick="correct()">✔️ Helyes</button>
    <button onclick="nextTurn()">Passzolom</button>
    <div class="score">Pont: ${state.score}</div>
    <button class="secondary" onclick="goMenu()">Vissza</button>
  `;
}

function checkPin() {
  const input = document.getElementById("pinInput").value;
  if (input === PIN) {
    state.screen = "names";
    render();
  } else {
    document.querySelector(".phone").classList.add("shake");
    setTimeout(() => {
      document.querySelector(".phone").classList.remove("shake");
    }, 400);
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
function goCommon() { state.screen = "common"; render(); }
function goGame() { state.screen = "game"; render(); }

function setMood(m) { state.mood = m; render(); }

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
  alert("Mentve ❤️");
}

function correct() {
  state.score++;
  state.turn++;
  render();
}

function nextTurn() {
  state.turn++;
  render();
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createHearts() {
  const container = document.getElementById("hearts");
  if (!container) return;
  for (let i = 0; i < 15; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.innerText = "💖";
    h.style.left = Math.random() * 100 + "%";
    h.style.animationDuration = 4 + Math.random() * 4 + "s";
    container.appendChild(h);
  }
}

render();
