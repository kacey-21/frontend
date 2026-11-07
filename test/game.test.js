import test from 'node:test';
import assert from 'node:assert';
import { createGame } from '../src/game.js';

test('Правило 1: Смена игрока после успешного хода', () => {
    const game = createGame();
    game.makeMove(0);
    assert.strictEqual(game.getState().currentPlayer, 'O');
});
test('Правило 2: Запрет хода в занятую клетку', () => {
    const game = createGame();
    game.makeMove(0);
    const isValid = game.makeMove(0);
    assert.strictEqual(isValid, false); 
    assert.strictEqual(game.getState().currentPlayer, 'O'); 
});

test('Правило 3: Определение победы по диагонали', () => {
    const game = createGame();
    game.makeMove(0); 
    game.makeMove(1); 
    game.makeMove(4); 
    game.makeMove(2); 
    game.makeMove(8); 
    
    const state = game.getState();
    assert.strictEqual(state.winner, 'X');
    assert.strictEqual(state.isActive, false);
});