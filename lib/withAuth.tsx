"use client"

import type React from "react"

import { useAuth } from "./authContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login")
      }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
      return null // or a loading spinner
    }

    return <WrappedComponent {...props} />
  }
}

