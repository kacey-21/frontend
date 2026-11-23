import type {
  Board,
  GameState,
  Move,
  Player,
  Winner,
} from '../types/game';

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createInitialState(): GameState {
  return {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    isActive: true,
    winner: null,
    movesCount: 0,
    history: [],
  };
}

export function findWinner(board: Board): Winner {
  for (const [a, b, c] of WIN_LINES) {
    const value = board[a];

    if (
      value !== '' &&
      value === board[b] &&
      value === board[c]
    ) {
      return value;
    }
  }

  return null;
}

export function isValidState(value: unknown): value is GameState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const state = value as Record<string, unknown>;

  if (!Array.isArray(state.board) || state.board.length !== 9) {
    return false;
  }

  const board = state.board as unknown[];

  if (
    !board.every(
      (cell) => cell === '' || cell === 'X' || cell === 'O'
    )
  ) {
    return false;
  }

  if (
    state.currentPlayer !== 'X' &&
    state.currentPlayer !== 'O'
  ) {
    return false;
  }

  if (typeof state.isActive !== 'boolean') {
    return false;
  }

  if (
    state.winner !== null &&
    state.winner !== 'X' &&
    state.winner !== 'O' &&
    state.winner !== 'draw'
  ) {
    return false;
  }

  const xCount = board.filter((cell) => cell === 'X').length;
  const oCount = board.filter((cell) => cell === 'O').length;
  const filled = xCount + oCount;

  if (xCount < oCount || xCount > oCount + 1) {
    return false;
  }

  if (state.movesCount !== filled) {
    return false;
  }

  if (state.isActive) {
    const expectedPlayer = xCount === oCount ? 'X' : 'O';

    if (state.currentPlayer !== expectedPlayer) {
      return false;
    }
  }

  if (!Array.isArray(state.history)) {
    return false;
  }

  const history = state.history as unknown[];

  if (history.length !== filled) {
    return false;
  }

  const seen = new Set<number>();

  for (const item of history) {
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const move = item as Record<string, unknown>;

    if (move.player !== 'X' && move.player !== 'O') {
      return false;
    }

    if (
      !Number.isInteger(move.index) ||
      typeof move.index !== 'number' ||
      move.index < 0 ||
      move.index > 8
    ) {
      return false;
    }

    if (board[move.index] !== move.player) {
      return false;
    }

    if (seen.has(move.index)) {
      return false;
    }

    seen.add(move.index);
  }

  for (let i = 0; i < 9; i++) {
    if (board[i] !== '' && !seen.has(i)) {
      return false;
    }
  }

  const actualWinner = findWinner(board as Board);

  if (state.winner === 'X' || state.winner === 'O') {
    if (actualWinner !== state.winner) {
      return false;
    }
  } else if (state.winner === 'draw') {
    if (filled !== 9 || actualWinner !== null) {
      return false;
    }
  } else {
    if (actualWinner !== null || filled === 9) {
      return false;
    }
  }

  if (state.isActive && state.winner !== null) {
    return false;
  }

  if (!state.isActive && state.winner === null) {
    return false;
  }

  return true;
}

export function createGame() {
  let state = createInitialState();

  return {
    getState(): GameState {
      return {
        ...state,
        board: [...state.board] as Board,
        history: state.history.map((move) => ({ ...move })),
      };
    },

    loadState(savedState: unknown): boolean {
      if (!isValidState(savedState)) {
        return false;
      }

      state = {
        ...savedState,
        board: [...savedState.board] as Board,
        history: savedState.history.map((move) => ({ ...move })),
      };

      return true;
    },

    makeMove(index: number): boolean {
      if (!Number.isInteger(index) || index < 0 || index > 8) {
        return false;
      }

      if (!state.isActive || state.board[index] !== '') {
        return false;
      }

      const player: Player = state.currentPlayer;

      state.board[index] = player;
      state.movesCount++;

      const move: Move = { player, index };
      state.history.push(move);

      const winner = findWinner(state.board);

      if (winner) {
        state.isActive = false;
        state.winner = winner;
      } else if (state.movesCount === 9) {
        state.isActive = false;
        state.winner = 'draw';
      } else {
        state.currentPlayer =
          state.currentPlayer === 'X' ? 'O' : 'X';
      }

      return true;
    },

    reset(): void {
      state = createInitialState();
    },
  };
}