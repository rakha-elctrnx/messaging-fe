"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/authContext"
import axiosInstance from "@/lib/axiosConfig"
import axios from "axios"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await axiosInstance.post("/user/login", { username, password })
      login(response.data.token)
      router.push("/rooms")
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Invalid username or password")
      } else {
        setError("An error occurred. Please try again.")
      }
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
      <div className="mb-6">
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
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button type="submit" className="btn-primary w-full">
        Login
      </button>
    </form>
  )
}

