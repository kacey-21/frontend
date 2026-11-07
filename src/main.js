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
        gameState: game.getState(),
        history: historyList.innerHTML,
        roomInput: roomInput.value
    };
    localStorage.setItem('tictactoe_save', JSON.stringify(dataToSave));
}

function loadGame() {
    try {
        const saved = localStorage.getItem('tictactoe_save');
        if (saved) {
            const parsed = JSON.parse(saved);
            game.loadState(parsed.gameState);
            historyList.innerHTML = parsed.history || '';
            roomInput.value = parsed.roomInput || '';
        }
    } catch (error) {
        localStorage.removeItem('tictactoe_save');
        game.reset();
    }
}