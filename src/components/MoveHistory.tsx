import type { Move } from '../types/game';

interface MoveHistoryProps {
  history: Move[];
}

export function MoveHistory({ history }: MoveHistoryProps) {
  return (
    <section className="history">
      <h3>История ходов:</h3>

      <ul>
        {history.map((move, index) => (
          <li key={`${move.index}-${index}`}>
            Игрок {move.player} занял клетку {move.index + 1}
          </li>
        ))}
      </ul>
    </section>
  );
}