"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "./axiosConfig"

interface AuthContextType {
  isAuthenticated: boolean
  login: (token: string, refreshToken: string) => void
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const login = (newToken: string, refreshToken: string) => {
    setToken(newToken)
    localStorage.setItem("token", newToken)
    localStorage.setItem("refreshToken", refreshToken)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    delete axiosInstance.defaults.headers.common["Authorization"]
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout, token }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

