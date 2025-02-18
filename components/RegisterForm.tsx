"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/websocket"

export default function RegisterForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      await registerUser(username, password)
      router.push("/login")
    } catch (err) {
      setError("Registration failed. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs">
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-bold mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-primary w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-primary w-full"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-primary w-full"
          required
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button type="submit" className="btn-primary w-full">
        Register
      </button>
    </form>
  )
}

