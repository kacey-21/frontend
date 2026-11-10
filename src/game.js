const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
export function createGame() {
    let state = {
        board: ["", "", "", "", "", "", "", "", ""],
        currentPlayer: "X",
        isActive: true,
        winner: null,
        movesCount: 0
    };
    return {
        getState: () => ({ ...state, board: [...state.board] }),
        loadState: (savedState) => {
            if (savedState && Array.isArray(savedState.board) && savedState.board.length === 9) {
                state = savedState;
            }
        },
        makeMove: (index) => {
            if (!state.isActive || state.board[index] !== "") return false;

            state.board[index] = state.currentPlayer;
            state.movesCount++;

            let won = false;
            for (const line of WIN_LINES) {
                const [a, b, c] = line;
                if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
                    won = true;
                    break;
                }
            }
            if (won) {
                state.isActive = false;
                state.winner = state.currentPlayer;
            } else if (state.movesCount === 9) {
                state.isActive = false;
                state.winner = "draw";
            } else {
                state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
            }
            return true;
        },
        reset: () => {
            state = {
                board: ["", "", "", "", "", "", "", "", ""],
                currentPlayer: "X",
                isActive: true,
                winner: null,
                movesCount: 0
            };
        }
    };
}