import confetti from 'canvas-confetti';
import { createGame } from './game.js';

const game = createGame();
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const historyList = document.getElementById('historyList');
const roomInput = document.getElementById('roomName');
const SAVE_KEY = 'tictactoe_save';
const SAVE_VERSION = 2;

function saveGame() {
  const dataToSave = {
    version: SAVE_VERSION,
    gameState: game.getState(),
    roomInput: roomInput.value,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved);

    if (parsed.version !== SAVE_VERSION) {
      localStorage.removeItem(SAVE_KEY);
      game.reset();
      return;
    }

    const loaded = game.loadState(parsed.gameState);

    if (!loaded) {
      localStorage.removeItem(SAVE_KEY);
      game.reset();
      roomInput.value = '';
      return;
    }

    roomInput.value = parsed.roomInput || '';
  } catch (error) {
    console.warn('Не удалось загрузить сохранение, сбрасываем:', error);
    localStorage.removeItem(SAVE_KEY);
    game.reset();
    roomInput.value = '';
  }
}

function render(state) {
  cells.forEach((cell, index) => {
    cell.innerText = state.board[index];
  });

  if (state.winner === 'draw') {
    statusElement.innerText = 'Ничья!';
  } else if (state.winner) {
    statusElement.innerText = `Победил: ${state.winner}!`;
  } else {
    statusElement.innerText = `Ходит: ${state.currentPlayer}`;
  }

  historyList.innerHTML = '';
  state.history.forEach(({ player, index }) => {
    const li = document.createElement('li');
    li.textContent = `Игрок ${player} занял клетку ${index + 1}`;
    historyList.appendChild(li);
  });
}

let rafId = null;
function scheduleRender(state) {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    render(state);
  });
}

cells.forEach(cell => {
  cell.addEventListener('click', (e) => {
    const index = Number(e.currentTarget.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index > 8) return;

    if (!game.makeMove(index)) return;

    const state = game.getState();
    saveGame();
    
    scheduleRender(state);

    if (state.winner && state.winner !== 'draw') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  });
});

resetButton.addEventListener('click', () => {
  game.reset();
  const state = game.getState();
  saveGame();
  scheduleRender(state);
});

roomInput.addEventListener('input', saveGame);

loadGame();
scheduleRender(game.getState());