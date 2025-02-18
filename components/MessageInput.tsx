"use client"

import type React from "react"

import { useState } from "react"
import axiosInstance from "@/lib/axiosConfig"

export default function MessageInput({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      try {
        await axiosInstance.post(`/rooms/${roomId}/messages`, { text: message })
        setMessage("")
        setError(null)
      } catch (err) {
        setError("Failed to send message. Please try again.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-primary flex-grow mr-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="btn-primary">
          Send
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  )
}

