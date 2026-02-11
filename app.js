const state = {
  screen: "menu",
  deck: [],
  currentPack: "romantic"
};

const app = document.getElementById("app");

function render() {
  app.innerHTML = `
    <div class="phone">
      ${renderScreen()}
    </div>
  `;
  if (state.screen === "deck") initDeck();
}

function renderScreen() {
  if (state.screen === "menu") return renderMenu();
  if (state.screen === "deck") return renderDeck();
}

function renderMenu() {
  return `
    <h2>🔥 After Dark</h2>
    <button onclick="startDeck('romantic')">💕 Romantika</button>
    <button onclick="startDeck('passion')">🔥 Szenvedély</button>
    <button onclick="startDeck('sexuality')">🌙 Szexualitás</button>
    <button onclick="startDeck('deep')">🧠 Mély</button>
    <button onclick="startDeck('fantasy')">🎭 Fantázia</button>
    <button onclick="startDeck('intimacy')">💌 Intimitás</button>
  `;
}

function renderDeck() {
  return `
    <h2>${state.currentPack.toUpperCase()}</h2>
    <div class="deck" id="deck"></div>
    <button class="secondary" onclick="goMenu()">Vissza</button>
  `;
}

function startDeck(pack) {
  state.currentPack = pack;
  state.deck = shuffle([...questions[pack]]);
  state.screen = "deck";
  render();
}

function goMenu() {
  state.screen = "menu";
  render();
}

function initDeck() {
  const deck = document.getElementById("deck");
  deck.innerHTML = "";

  state.deck.slice(0,3).forEach(text => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = text;
    deck.appendChild(card);
  });

  attachSwipe();
}

function attachSwipe() {
  const cards = document.querySelectorAll(".card");
  const topCard = cards[0];
  if (!topCard) return;

  let startX = 0;

  topCard.addEventListener("pointerdown", e => {
    startX = e.clientX;
    topCard.setPointerCapture(e.pointerId);
  });

  topCard.addEventListener("pointermove", e => {
    if (!startX) return;
    const diff = e.clientX - startX;
    topCard.style.transform = `translateX(${diff}px) rotate(${diff/10}deg)`;
  });

  topCard.addEventListener("pointerup", e => {
    const diff = e.clientX - startX;

    if (Math.abs(diff) > 100) {
      topCard.style.transform = `translateX(${diff > 0 ? 500 : -500}px) rotate(${diff/5}deg)`;
      setTimeout(() => {
        state.deck.shift();
        initDeck();
      }, 300);
    } else {
      topCard.style.transform = "";
    }

    startX = 0;
  });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

render();
