import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

import {
  createInitialState,
  makeMove,
} from './game/game';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { RoomInput } from './components/RoomInput';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';


import type { GameState } from './types/game';

const SAVE_KEY = 'tictactoe_save';
const SAVE_VERSION = 2;

interface SavedData {
  version: number;
  gameState: GameState;
  roomInput: string;
}

function loadSavedData(): SavedData | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);

    if (!saved) {
      return null;
    }

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed !== 'object' ||
      parsed === null
    ) {
      throw new Error('Некорректное сохранение');
    }

    const data = parsed as Record<string, unknown>;

    if (
      data.version !== SAVE_VERSION ||
      typeof data.roomInput !== 'string'
    ) {
      throw new Error('Неверная версия сохранения');
    }

    const game = createGame();

    if (!game.loadState(data.gameState)) {
      throw new Error('Некорректное состояние игры');
    }

    return {
      version: SAVE_VERSION,
      gameState: game.getState(),
      roomInput: data.roomInput,
    };
  } catch (error) {
    console.warn('Не удалось загрузить сохранение:', error);

    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // Хранилище может быть недоступно.
    }

    return null;
  }
}

export default function App() {
  const [initialData] = useState(() => loadSavedData());

  const [gameState, setGameState] = useState<GameState>(
    () => initialData?.gameState ?? createInitialState()
  );

  const [roomName, setRoomName] = useState(
    () => initialData?.roomInput ?? ''
  );

  useEffect(() => {
    const data: SavedData = {
      version: SAVE_VERSION,
      gameState,
      roomInput: roomName,
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Не удалось сохранить игру:', error);
    }
  }, [gameState, roomName]);

 function handleMove(index: number): void {
  setGameState((previousState) => {
    const newState = makeMove(previousState, index);

    return newState ?? previousState;
  });
}
  function handleReset(): void {
    setGameState(createInitialState());
  }

  return (
    <main className="game-container">
      <h1>Крестики-нолики</h1>

      <RoomInput
        value={roomName}
        onChange={setRoomName}
      />

      <GameStatus state={gameState} />

      <GameBoard
        board={gameState.board}
        isActive={gameState.isActive}
        onCellClick={handleMove}
      />

      <GameControls onReset={handleReset} />

      <MoveHistory history={gameState.history} />
    </main>
  );
}