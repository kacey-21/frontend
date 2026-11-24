import type {
  Board,
  Cell,
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
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPlayer(value: unknown): value is Player {
  return value === 'X' || value === 'O';
}

function isCell(value: unknown): value is Cell {
  return value === '' || isPlayer(value);
}

function isBoard(value: unknown): value is Board {
  return Array.isArray(value) && value.length === 9 && value.every(isCell);
}

function copyBoard(board: Board): Board {
  return [
    board[0], board[1], board[2],
    board[3], board[4], board[5],
    board[6], board[7], board[8],
  ];
}

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
export function makeMove(
  state: GameState,
  index: number
): GameState | null {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index > 8 ||
    !state.isActive ||
    state.board[index] !== ''
  ) {
    return null;
  }

  const player = state.currentPlayer;
  const board = copyBoard(state.board);

  board[index] = player;

  const winner = findWinner(board);
  const movesCount = state.movesCount + 1;
  const isDraw = winner === null && movesCount === 9;

  return {
    board,
    currentPlayer:
      winner || isDraw
        ? player
        : player === 'X'
          ? 'O'
          : 'X',
    isActive: winner === null && !isDraw,
    winner: winner ?? (isDraw ? 'draw' : null),
    movesCount,
    history: [
      ...state.history,
      { player, index },
    ],
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
function getWinner(board: Board): Player | null {
  const winner = findWinner(board);

  return winner === 'draw' ? null : winner;
}

export function isValidState(value: unknown): value is GameState {
  if (!isRecord(value) || !isBoard(value.board)) {
    return false;
  }

  if (
    !isPlayer(value.currentPlayer) ||
    typeof value.isActive !== 'boolean' ||
    (value.winner !== null &&
      value.winner !== 'draw' &&
      !isPlayer(value.winner)) ||
    typeof value.movesCount !== 'number' ||
    !Number.isInteger(value.movesCount) ||
    !Array.isArray(value.history)
  ) {
    return false;
  }

  const board = value.board;
  const history = value.history;
  const filled = board.filter((cell) => cell !== '').length;

  if (value.movesCount !== filled || history.length !== filled) {
    return false;
  }

  const replay: Board = ['', '', '', '', '', '', '', '', ''];
  let playerToMove: Player = 'X';
  let replayWinner: Player | null = null;
  let replayDraw = false;

  for (const item of history) {
    if (!isRecord(item) || !isPlayer(item.player)) {
      return false;
    }

    const index = item.index;

    if (
      typeof index !== 'number' ||
      !Number.isInteger(index) ||
      index < 0 ||
      index > 8 ||
      item.player !== playerToMove ||
      replay[index] !== '' ||
      replayWinner !== null ||
      replayDraw
    ) {
      return false;
    }

    replay[index] = item.player;
    replayWinner = getWinner(replay);
    replayDraw =
      replayWinner === null &&
      replay.every((cell) => cell !== '');

    if (replayWinner === null && !replayDraw) {
      playerToMove = playerToMove === 'X' ? 'O' : 'X';
    }
  }

  if (!board.every((cell, index) => cell === replay[index])) {
    return false;
  }

  const expectedWinner: Winner =
    replayWinner ?? (replayDraw ? 'draw' : null);

  return (
    value.currentPlayer === playerToMove &&
    value.winner === expectedWinner &&
    value.isActive === (expectedWinner === null)
  );
}


export function createGame() {
  let state = createInitialState();

  return {
    getState(): GameState {
      return {
        ...state,
        board: copyBoard(state.board),
        history: state.history.map((move) => ({ ...move })),
      };
    },

    loadState(savedState: unknown): boolean {
      if (!isValidState(savedState)) {
        return false;
      }

      state = {
        ...savedState,
        board: copyBoard(savedState.board),
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