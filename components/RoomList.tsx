"use client"

import axiosInstance from "@/lib/axiosConfig"
import { closeWebSocket, connectToWebSocket } from "@/lib/websocket"
import { useEffect, useState } from "react"

type Room = {
  id: string
  name: string
}

interface RoomListProps {
  onSelectRoom: (roomId: string) => void
  selectedRoom: string | null
}

export default function RoomList({ onSelectRoom, selectedRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get(`/user/rooms`)
        setRooms(response.data)
      } catch (err) {
        setError("Failed to fetch rooms. Please try again.")
      }
    }

    fetchRooms()

    return () => {
      // Cleanup WebSocket connection when the component unmounts
      closeWebSocket()
    }
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      const socket = connectToWebSocket(selectedRoom)
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log("Received message:", data)
      }
    }

    return () => {
      // Cleanup WebSocket when the selectedRoom changes
      closeWebSocket()
    }
  }, [selectedRoom])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-2 p-4">
      {rooms?.map((room) => (
        <button
          key={room.id}
          onClick={() => onSelectRoom(room.id)}
          className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
            selectedRoom === room.id ? "bg-light-orange text-white" : "hover:bg-gray-100"
          }`}
        >
          <h2 className="text-lg font-semibold">{room.name}</h2>
        </button>
      ))}
    </div>
  )
}
