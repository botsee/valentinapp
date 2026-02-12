const app = document.getElementById("app");

let currentDeck = [];
let currentIndex = 0;
let currentMode = null;
let currentTopic = null;

/* =========================
   KIHÍVÁS STATE
=========================*/
let currentLevel = 1;
let levelProgress = 0;
let currentLevelDeck = [];

/* =========================
   UTIL
=========================*/
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

/* =========================
   FŐMENÜ
=========================*/
function renderMenu() {
  currentMode = null;
  app.innerHTML = `
    <div class="phone">
      <h1>Valentin-app ❤️</h1>
      <div class="menu">
        <div class="menu-card" onclick="startTopic('kapcsolodas')">Kapcsolódás</div>
        <div class="menu-card" onclick="startTopic('melyseg')">Mélység</div>
        <div class="menu-card" onclick="startTopic('intimitas')">Intimitás</div>
        <div class="menu-card" onclick="startTopic('szexualitas')">Szexualitás</div>
        <div class="menu-card" onclick="startTopic('mennyireIsmersz')">Mennyire ismersz?</div>
        <div class="menu-card" onclick="startKihivas()">🔥 Kihívás</div>
      </div>
    </div>
  `;
}

/* =========================
   BESZÉLGETŐS TÉMÁK
=========================*/
function startTopic(topic) {
  currentMode = "topic";
  currentTopic = topic;
  currentDeck = shuffle(defaultQuestions.temak[topic]);
  currentIndex = 0;
  renderCard();
}

function renderCard() {
  const question = currentDeck[currentIndex];

  app.innerHTML = `
    <div class="phone">
      <h1>Valentin-app ❤️</h1>
      <div class="card">${question}</div>
      <div class="progress">
        <div class="progress-fill" style="width:${((currentIndex+1)/currentDeck.length)*100}%"></div>
      </div>
      <div class="buttons">
        <button onclick="nextQuestion()">Következő</button>
        <button class="secondary" onclick="renderMenu()">Vissza</button>
      </div>
    </div>
  `;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= currentDeck.length) {
    currentDeck = shuffle(defaultQuestions.temak[currentTopic]);
    currentIndex = 0;
  }
  renderCard();
}

/* =========================
   KIHÍVÁS MÓD
=========================*/
function startKihivas() {
  currentMode = "kihivas";
  currentLevel = 1;
  levelProgress = 0;
  generateLevelDeck();
  renderKihivas();
}

function generateLevelDeck() {
  const levelKey = "level" + currentLevel;
  const fullDeck = defaultQuestions.kihivas[levelKey];
  currentLevelDeck = shuffle(fullDeck).slice(0, 10);
  levelProgress = 0;
}

function renderKihivas() {
  const question = currentLevelDeck[levelProgress];

  app.innerHTML = `
    <div class="phone">
      <h1>🔥 Kihívás</h1>
      <div class="level-indicator">Szint ${currentLevel} / 5</div>
      <div class="card">${question}</div>
      <div class="progress">
        <div class="progress-fill" style="width:${(levelProgress/10)*100}%"></div>
      </div>
      <div class="buttons">
        <button onclick="nextKihivas()">Teljesítve</button>
      </div>
      <div class="buttons">
        <button class="secondary small" onclick="prevLevel()">⬇ Szint -</button>
        <button class="secondary small" onclick="nextLevel()">⬆ Szint +</button>
      </div>
      <button class="secondary small" onclick="renderMenu()">Vissza</button>
    </div>
  `;
}

function nextKihivas() {
  levelProgress++;

  if (levelProgress >= 10) {
    if (currentLevel < 5) {
      currentLevel++;
      generateLevelDeck();
    } else {
      alert("🔥 Minden szint teljesítve!");
      renderMenu();
      return;
    }
  }

  renderKihivas();
}

function nextLevel() {
  if (currentLevel < 5) {
    currentLevel++;
    generateLevelDeck();
    renderKihivas();
  }
}

function prevLevel() {
  if (currentLevel > 1) {
    currentLevel--;
    generateLevelDeck();
    renderKihivas();
  }
}

/* =========================
   START
=========================*/
renderMenu();
