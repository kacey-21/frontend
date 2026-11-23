import type { GameState } from '../types/game';

interface GameStatusProps {
  state: GameState;
}

export function GameStatus({ state }: GameStatusProps) {
  let message: string;

  if (state.winner === 'draw') {
    message = 'Ничья!';
  } else if (state.winner) {
    message = `Победил: ${state.winner}!`;
  } else {
    message = `Ходит: ${state.currentPlayer}`;
  }

  return <h2 id="status">{message}</h2>;
}