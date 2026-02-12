const app = document.getElementById("app");

let currentDeck = [];
let currentIndex = 0;
let currentMode = null;
let currentTopic = null;

/* =========================
   MENNYIRE ISMERSZ STATE
=========================*/
let player1Name = "Enikó";
let player2Name = "Balázs";


/* =========================
   KIHÍVÁS STATE
=========================*/
let currentLevel = 1;
let levelProgress = 0;
let currentLevelDeck = [];
let timerInterval = null;
let timeLeft = 120;

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
  clearInterval(timerInterval);
  currentMode = null;

  app.innerHTML = `
    <div class="phone">
      <h1>❤️ Valentin-app</h1>
<div class="subtitle">${player1Name} & ${player2Name}</div>
      <div class="menu">
        <div class="menu-card" onclick="startTopic('kapcsolodas')">Kapcsolódás</div>
        <div class="menu-card" onclick="startTopic('melyseg')">Mélység</div>
        <div class="menu-card" onclick="startTopic('intimitas')">Intimitás</div>
        <div class="menu-card" onclick="startTopic('szexualitas')">Szexualitás</div>
        <div class="menu-card" onclick="startMennyire()">Mennyire ismersz?</div>
        <div class="menu-card" onclick="startKihivas()">🔥 Kihívás</div>
      </div>
    </div>
  `;
}

/* =========================
   MENNYIRE ISMERSZ
=========================*/
function startMennyire() {
  currentMode = "mennyire";
  currentDeck = shuffle(defaultQuestions.temak.mennyireIsmersz);
  currentIndex = 0;
  player1Score = 0;
  player2Score = 0;
  renderMennyire();
}

function renderMennyire() {
  const question = currentDeck[currentIndex];

  app.innerHTML = `
    <div class="phone">
      <h1>🧠 Mennyire ismersz?</h1>
      
     <div class="scoreboard">
  <div>${player1Name}: ${player1Score}</div>
  <div>${player2Name}: ${player2Score}</div>
</div>


      <div class="card">${question}</div>

      <div class="buttons">
        <button onclick="addPoint(1)">Fél 1 pont</button>
        <button onclick="addPoint(2)">Fél 2 pont</button>
      </div>

      <div class="buttons">
        <button onclick="nextMennyire()">Következő</button>
      </div>

      <button class="secondary small" onclick="renderMenu()">Vissza</button>
    </div>
  `;
}

function addPoint(player) {
  if (player === 1) player1Score++;
  if (player === 2) player2Score++;
  renderMennyire();
}

function nextMennyire() {
  currentIndex++;
  if (currentIndex >= currentDeck.length) {
    currentDeck = shuffle(defaultQuestions.temak.mennyireIsmersz);
    currentIndex = 0;
  }
  renderMennyire();
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

      <div class="buttons">
        <button onclick="nextQuestion()">Következő</button>
      </div>

      <div class="progress">
        <div class="progress-fill" 
          style="width:${((currentIndex+1)/currentDeck.length)*100}%">
        </div>
      </div>

      <button class="secondary small back-btn" onclick="renderMenu()">Vissza</button>
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
   KIHÍVÁS
=========================*/
function startKihivas() {
  currentMode = "kihivas";
  currentLevel = 1;
  levelProgress = 0;
  generateLevelDeck();
  startTimer();
  renderKihivas();
}

function generateLevelDeck() {
  const levelKey = "level" + currentLevel;
  const fullDeck = defaultQuestions.kihivas[levelKey];
  currentLevelDeck = shuffle(fullDeck).slice(0, 10);
  levelProgress = 0;
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 120;

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      flashCard();
    }

    updateTimer();
  }, 1000);
}

function updateTimer() {
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.innerText = formatTime(timeLeft);
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function flashCard() {
  const card = document.querySelector(".card");
  if (!card) return;
  card.style.animation = "flash 0.4s 3";
}

function renderKihivas() {
  const question = currentLevelDeck[levelProgress];

  app.innerHTML = `
    <div class="phone">
      <h1>🔥 Kihívás</h1>
      <div class="timer" id="timer">${formatTime(timeLeft)}</div>
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

  startTimer();
  renderKihivas();
}

function nextLevel() {
  if (currentLevel < 5) {
    currentLevel++;
    generateLevelDeck();
    startTimer();
    renderKihivas();
  }
}

function prevLevel() {
  if (currentLevel > 1) {
    currentLevel--;
    generateLevelDeck();
    startTimer();
    renderKihivas();
  }
}

/* =========================
   START
=========================*/
renderMenu();
