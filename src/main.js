import confetti from 'canvas-confetti';
import { createGame } from './game.js';

const game = createGame();
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const historyList = document.getElementById('historyList');
const roomInput = document.getElementById('roomName');

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
        const saved = localStorage.getItem('tictactoe_save');
        if (saved) {
            const parsed = JSON.parse(saved);
            game.loadState(parsed.gameState);
            roomInput.value = parsed.roomInput || '';
        }
    } catch (error) {
        localStorage.removeItem('tictactoe_save');
        game.reset();
    }
}
function render() {
    const state = game.getState();
    cells.forEach((cell, index) => {
        cell.innerText = state.board[index];
    });

    if (state.winner === 'draw') {
        statusElement.innerText = "Ничья!";
    } else if (state.winner) {
        statusElement.innerText = `Победил: ${state.winner}!`;
    } else {
        statusElement.innerText = `Ходит: ${state.currentPlayer}`;
    }
}

function addHistoryRecord(player, index) {
    const li = document.createElement('li');
    li.innerText = `Игрок ${player} занял клетку ${index + 1}`;
    historyList.appendChild(li);
}
cells.forEach(cell => {
  cell.addEventListener('click', (e) => {
    const index = Number(e.currentTarget.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index > 8) return;

    const playerBeforeMove = game.getState().currentPlayer;

    if (game.makeMove(index)) {
      addHistoryRecord(playerBeforeMove, index);
      render();
      saveGame();

      const state = game.getState();
      if (state.winner && state.winner !== 'draw') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }
  });
});

resetButton.addEventListener('click', () => {
    game.reset();
    historyList.innerHTML = '';
    render();
    saveGame();
});

roomInput.addEventListener('input', saveGame);

loadGame();
render();