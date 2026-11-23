interface GameControlsProps {
  onReset: () => void;
}

export function GameControls({ onReset }: GameControlsProps) {
  return (
    <button type="button" onClick={onReset}>
      Начать заново
    </button>
  );
}