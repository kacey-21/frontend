interface RoomInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoomInput({
  value,
  onChange,
}: RoomInputProps) {
  return (
    <input
      id="roomName"
      type="text"
      placeholder="Имя комнаты"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}