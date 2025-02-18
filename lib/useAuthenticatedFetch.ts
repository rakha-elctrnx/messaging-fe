import { useAuth } from "./authContext"
import { useRouter } from "next/navigation"

export function useAuthenticatedFetch() {
  const { token, logout } = useAuth()
  const router = useRouter()

  return async (url: string, options: RequestInit = {}) => {
    if (!token) {
      router.push("/login")
      return null
    }

    const headers = new Headers(options.headers)
    headers.set("Authorization", `Bearer ${token}`)

    const response = await fetch(url, { ...options, headers })

    if (response.status === 401) {
      // Token has expired or is invalid
      logout()
      router.push("/login")
      return null
    }

    return response
  }
}

