import test from 'node:test';
import assert from 'node:assert/strict';

import { createGame } from '../src/game/game';

test('Смена игрока после успешного хода', () => {
  const game = createGame();

  game.makeMove(0);

  assert.equal(game.getState().currentPlayer, 'O');
});

test('Запрет хода в занятую клетку', () => {
  const game = createGame();

  game.makeMove(0);

  const result = game.makeMove(0);

  assert.equal(result, false);
  assert.equal(game.getState().currentPlayer, 'O');
});

test('Определение победы по диагонали', () => {
  const game = createGame();

  game.makeMove(0);
  game.makeMove(1);
  game.makeMove(4);
  game.makeMove(2);
  game.makeMove(8);

  const state = game.getState();

  assert.equal(state.winner, 'X');
  assert.equal(state.isActive, false);
});

test('Отклонение некорректного состояния без победителя', () => {
  const game = createGame();

  const loaded = game.loadState({
    board: ['X', '', '', '', '', '', '', '', ''],
    currentPlayer: 'O',
    isActive: false,
    winner: null,
    movesCount: 1,
    history: [{ player: 'X', index: 0 }],
  });

  assert.equal(loaded, false);
  assert.equal(game.getState().movesCount, 0);
});

test('Отклонение неправильного количества ходов', () => {
  const game = createGame();

  const loaded = game.loadState({
    board: ['X', '', '', '', '', '', '', '', ''],
    currentPlayer: 'O',
    isActive: true,
    winner: null,
    movesCount: 500,
    history: [{ player: 'X', index: 0 }],
  });

  assert.equal(loaded, false);
});

test('Отклонение несуществующего победителя', () => {
  const game = createGame();

  const loaded = game.loadState({
    board: ['X', '', '', '', '', '', '', '', ''],
    currentPlayer: 'O',
    isActive: false,
    winner: 'O',
    movesCount: 1,
    history: [{ player: 'X', index: 0 }],
  });

  assert.equal(loaded, false);
});

test('Отклонение неправильной истории', () => {
  const game = createGame();

  const loaded = game.loadState({
    board: ['X', 'O', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    isActive: true,
    winner: null,
    movesCount: 2,
    history: [{ player: 'X', index: 0 }],
  });

  assert.equal(loaded, false);
});

test('Загрузка корректного состояния', () => {
  const game = createGame();

  const loaded = game.loadState({
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

  assert.equal(loaded, true);
  assert.equal(game.getState().movesCount, 3);
  assert.equal(game.getState().currentPlayer, 'O');
});

test('Отклонение истории X0, O3, X1, O4, X2, O8', () => {
  const state = {
    board: ['X', 'X', 'X', 'O', 'O', '', '', '', 'O'],
    currentPlayer: 'X',
    isActive: false,
    winner: 'X',
    movesCount: 6,
    history: [
      { player: 'X', index: 0 },
      { player: 'O', index: 3 },
      { player: 'X', index: 1 },
      { player: 'O', index: 4 },
      { player: 'X', index: 2 },
      { player: 'O', index: 8 },
    ],
  };

  assert.equal(isValidState(state), false);
});

test('Отклонение неправильного currentPlayer после победы', () => {
  const state = {
    board: ['X', 'O', '', '', 'X', 'O', '', '', 'X'],
    currentPlayer: 'O',
    isActive: false,
    winner: 'X',
    movesCount: 5,
    history: [
      { player: 'X', index: 0 },
      { player: 'O', index: 1 },
      { player: 'X', index: 4 },
      { player: 'O', index: 5 },
      { player: 'X', index: 8 },
    ],
  };

  assert.equal(isValidState(state), false);
});

test('Корректная завершённая партия проходит проверку', () => {
  const state = {
    board: ['X', 'O', '', '', 'X', 'O', '', '', 'X'],
    currentPlayer: 'X',
    isActive: false,
    winner: 'X',
    movesCount: 5,
    history: [
      { player: 'X', index: 0 },
      { player: 'O', index: 1 },
      { player: 'X', index: 4 },
      { player: 'O', index: 5 },
      { player: 'X', index: 8 },
    ],
  };

  assert.equal(isValidState(state), true);
});
