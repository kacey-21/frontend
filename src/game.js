const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function findWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isValidState(s) {
  if (!Array.isArray(s?.board) || s.board.length !== 9) return false;
  if (!s.board.every(c => c === "" || c === "X" || c === "O")) return false;

  const filled = s.board.filter(Boolean).length;

  if (s.movesCount !== undefined && s.movesCount !== filled) return false;

  if (s.currentPlayer !== "X" && s.currentPlayer !== "O") return false;
  const expectedPlayer = filled % 2 === 0 ? "X" : "O";
  if (s.currentPlayer !== expectedPlayer) return false;

  if (!Array.isArray(s.history) || s.history.length !== filled) return false;
  if (!s.history.every(h =>
    (h?.player === "X" || h?.player === "O") &&
    Number.isInteger(h?.index) && h.index >= 0 && h.index <= 8
  )) return false;

  const seen = new Set();
  for (const h of s.history) {
    if (s.board[h.index] !== h.player) return false;
    if (seen.has(h.index)) return false;
    seen.add(h.index);
  }
  for (let i = 0; i < 9; i++) {
    if (s.board[i] !== "" && !seen.has(i)) return false;
  }

  const actualWinner = findWinner(s.board);
  if (s.winner === null || s.winner === undefined) {
    if (actualWinner !== null) return false;
    if (filled === 9) return false;
  } else if (s.winner === "draw") {
    if (filled !== 9) return false;
    if (actualWinner !== null) return false;
  } else if (s.winner === "X" || s.winner === "O") {
    if (actualWinner !== s.winner) return false;
  } else {
    return false;
  }

  if (typeof s.isActive !== "boolean") return false;
  if (s.winner !== null && s.isActive !== false) return false;
  if (s.winner === null && s.isActive !== true) return false;

  return true;
}

export function createGame() {
  const emptyState = () => ({
    board: ["", "", "", "", "", "", "", "", ""],
    currentPlayer: "X",
    isActive: true,
    winner: null,
    movesCount: 0,
    history: [],
  });

  let state = emptyState();

  return {
    getState: () => ({
      ...state,
      board: [...state.board],
      history: state.history.map(h => ({ ...h })),
    }),

    loadState: (savedState) => {
      if (!isValidState(savedState)) return;

      state = {
        board: [...savedState.board],
        currentPlayer: savedState.currentPlayer,
        isActive: savedState.isActive,
        winner: savedState.winner,
        movesCount: savedState.board.filter(Boolean).length,
        history: savedState.history.map(h => ({ ...h })),
      };
    },

    makeMove: (index) => {
      if (!Number.isInteger(index) || index < 0 || index > 8) return false;
      if (!state.isActive || state.board[index] !== "") return false;

      const player = state.currentPlayer;
      state.board[index] = player;
      state.movesCount++;
      state.history.push({ player, index });

      const won = findWinner(state.board);

      if (won) {
        state.isActive = false;
        state.winner = won;
      } else if (state.movesCount === 9) {
        state.isActive = false;
        state.winner = "draw";
      } else {
        state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
      }

      return true;
    },

    reset: () => {
      state = emptyState();
    },
  };
}