export type Player = 'X' | 'O';

export type Cell = Player | '';

export type Winner = Player | 'draw' | null;

export interface Move {
  player: Player;
  index: number;
}

export type Board = [
  Cell, Cell, Cell,
  Cell, Cell, Cell,
  Cell, Cell, Cell
];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  isActive: boolean;
  winner: Winner;
  movesCount: number;
  history: Move[];
}