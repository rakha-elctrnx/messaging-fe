"use client"

const rooms = [
  { id: "1", name: "General" },
  { id: "2", name: "Random" },
  { id: "3", name: "Tech Talk" },
]

interface RoomListProps {
  onSelectRoom: (roomId: string) => void
  selectedRoom: string | null
}

export default function RoomList({ onSelectRoom, selectedRoom }: RoomListProps) {
  return (
    <div className="space-y-2 p-4">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onSelectRoom(room.id)}
          className={`w-full text-left p-2 rounded-lg transition-colors ${
            selectedRoom === room.id ? "bg-light-orange text-white" : "hover:bg-gray-100"
          }`}
        >
          <h2 className="text-lg font-semibold">{room.name}</h2>
        </button>
      ))}
    </div>
  )
}

