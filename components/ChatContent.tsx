import MessageList from "./MessageList"
import MessageInput from "./MessageInput"

export default function ChatContent({ roomId }: { roomId: string | null }) {
  if (!roomId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Select a room to start chatting</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-primary-orange p-4">Room {roomId}</h2>
      <div className="flex-grow overflow-y-auto p-4">
        <MessageList roomId={roomId} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <MessageInput roomId={roomId} />
      </div>
    </div>
  )
}

