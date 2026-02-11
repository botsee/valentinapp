const state = {
  screen: "menu",
  pack: null,
  deck: []
};

const app = document.getElementById("app");

function render() {
  app.innerHTML = `
    <div class="phone">
      ${state.screen === "menu" ? renderMenu() : renderDeck()}
    </div>
  `;

  if (state.screen === "deck") buildDeck();
}

function renderMenu() {
  return `
    <h2>🔥 After Dark</h2>
    <div class="menu">
      <button onclick="start('romantic')">💕 Romantika</button>
      <button onclick="start('passion')">🔥 Szenvedély</button>
      <button onclick="start('sexuality')">🌙 Szexualitás</button>
      <button onclick="start('deep')">🧠 Mély</button>
      <button onclick="start('fantasy')">🎭 Fantázia</button>
      <button onclick="start('intimacy')">💌 Intimitás</button>
    </div>
  `;
}

function renderDeck() {
  return `
    <h2>${state.pack.toUpperCase()}</h2>
    <div class="deck-container" id="deck"></div>
    <div class="buttons">
      <button class="secondary" onclick="swipeLeft()">⟵</button>
      <button onclick="swipeRight()">⟶</button>
    </div>
    <button class="secondary" onclick="goMenu()">Vissza</button>
  `;
}

function start(pack) {
  state.pack = pack;
  state.deck = shuffle([...questions[pack]]);
  state.screen = "deck";
  render();
}

function goMenu() {
  state.screen = "menu";
  render();
}

function buildDeck() {
  const deckEl = document.getElementById("deck");
  deckEl.innerHTML = "";

  state.deck.slice(0,3).forEach((text, index) => {
    const card = document.createElement("div");
    card.className = "card";

    if (index === 1) card.classList.add("back");
    if (index === 2) card.classList.add("third");

    const span = document.createElement("span");
    span.innerText = text;
    card.appendChild(span);

    deckEl.appendChild(card);
  });

  attachSwipe();
}

function attachSwipe() {
  const card = document.querySelector(".card");
  if (!card) return;

  let startX = 0;

  card.addEventListener("pointerdown", e => {
    startX = e.clientX;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (!startX) return;
    const diff = e.clientX - startX;
    card.style.transform = `translateX(${diff}px) rotate(${diff/10}deg)`;
  });

  card.addEventListener("pointerup", e => {
    const diff = e.clientX - startX;
    handleRelease(diff, card);
    startX = 0;
  });
}

function handleRelease(diff, card) {
  if (Math.abs(diff) > 100) {
    card.style.transform = `translateX(${diff > 0 ? 500 : -500}px) rotate(${diff/5}deg)`;
    setTimeout(() => {
      state.deck.shift();
      if (state.deck.length === 0) {
        state.deck = shuffle([...questions[state.pack]]);
      }
      buildDeck();
    }, 250);
  } else {
    card.style.transform = "";
  }
}

function swipeRight() {
  const card = document.querySelector(".card");
  if (!card) return;
  handleRelease(200, card);
}

function swipeLeft() {
  const card = document.querySelector(".card");
  if (!card) return;
  handleRelease(-200, card);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

render();
