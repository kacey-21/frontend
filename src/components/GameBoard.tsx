import type { Board } from '../types/game';

interface GameBoardProps {
  board: Board;
  isActive: boolean;
  onCellClick: (index: number) => void;
}

export function GameBoard({
  board,
  isActive,
  onCellClick,
}: GameBoardProps) {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <button
          className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''}`}
          key={index}
          onClick={() => onCellClick(index)}
          disabled={!isActive || cell !== ''}
          aria-label={`Клетка ${index + 1}: ${cell || 'пустая'}`}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}