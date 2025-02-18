import MessageList from "@/components/MessageList"
import MessageInput from "@/components/MessageInput"

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
      <h1 className="text-3xl font-bold text-primary-orange mb-8">Room {params.roomId}</h1>
      <div className="flex-grow overflow-y-auto mb-4">
        <MessageList roomId={params.roomId} />
      </div>
      <MessageInput roomId={params.roomId} />
    </div>
  )
}

