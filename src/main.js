import confetti from 'canvas-confetti';
import { createGame } from './game.js';

const game = createGame();
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const historyList = document.getElementById('historyList');
const roomInput = document.getElementById('roomName');