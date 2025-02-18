"use client"

import { useState, useEffect } from "react"
import { connectToWebSocket } from "@/lib/websocket"
import axiosInstance from "@/lib/axiosConfig"

type Message = {
  id: string
  text: string
  username: string
  timestamp: string
}

export default function MessageList({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/rooms/${roomId}/messages`)
        setMessages(response.data)
      } catch (err) {
        setError("Failed to fetch messages. Please try again.")
      }
    }

    fetchMessages()

    const socket = connectToWebSocket(roomId)

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages((prevMessages) => [...prevMessages, message])
    }

    return () => {
      socket.close()
    }
  }, [roomId])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-gray-100 p-3 rounded-lg">
          <p className="font-bold">{message.username}</p>
          <p>{message.text}</p>
          <p className="text-sm text-gray-500">{message.timestamp}</p>
        </div>
      ))}
    </div>
  )
}

