"use client"

import { useState } from "react"
import RoomList from "@/components/RoomList"
import ChatContent from "@/components/ChatContent"
import { withAuth } from "@/lib/withAuth"
import { useAuth } from "@/lib/authContext"

function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const { logout } = useAuth()

  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/4 border-r border-gray-200">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-primary-orange">Chat Rooms</h1>
          <button onClick={logout} className="text-sm text-gray-600 hover:text-primary-orange">
            Logout
          </button>
        </div>
        <RoomList onSelectRoom={setSelectedRoom} selectedRoom={selectedRoom} />
      </div>
      <div className="w-3/4">
        <ChatContent roomId={selectedRoom} />
      </div>
    </div>
  )
}

export default withAuth(RoomsPage)

