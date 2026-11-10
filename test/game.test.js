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

test('loadState отвергает isActive: false без победителя', () => {
  const game = createGame();
  game.loadState({
    board: ['X', '', '', '', '', '', '', '', ''],
    currentPlayer: 'O',
    isActive: false,
    winner: null,
    movesCount: 1,
    history: [{ player: 'X', index: 0 }],
  });
  assert.strictEqual(game.getState().movesCount, 0);
});

test('loadState отвергает movesCount, не совпадающий с доской', () => {
  const game = createGame();
  game.loadState({
    board: ['X', '', '', '', '', '', '', '', ''],
    currentPlayer: 'O',
    isActive: true,
    winner: null,
    movesCount: 500,
    history: [{ player: 'X', index: 0 }],
  });
  assert.strictEqual(game.getState().movesCount, 0);
});

test('loadState отвергает победителя, которого нет на доске', () => {
  const game = createGame();
  game.loadState({
    board: ['X', '', '', '', '', '', '', '', ''],
    currentPlayer: 'O',
    isActive: false,
    winner: 'O',
    movesCount: 1,
    history: [{ player: 'X', index: 0 }],
  });
  assert.strictEqual(game.getState().winner, null);
});

test('loadState отвергает историю, не совпадающую с доской', () => {
  const game = createGame();
  game.loadState({
    board: ['X', 'O', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    isActive: true,
    winner: null,
    movesCount: 2,
    history: [{ player: 'X', index: 0 }],
  });
  assert.strictEqual(game.getState().movesCount, 0);
});

test('loadState принимает корректное состояние', () => {
  const game = createGame();
  game.loadState({
    board: ['X', 'O', 'X', '', '', '', '', '', ''],
    currentPlayer: 'O',
    isActive: true,
    winner: null,
    movesCount: 3,
    history: [
      { player: 'X', index: 0 },
      { player: 'O', index: 1 },
      { player: 'X', index: 2 },
    ],
  });
  assert.strictEqual(game.getState().movesCount, 3);
  assert.strictEqual(game.getState().currentPlayer, 'O');
});