let socket: WebSocket | null = null

export function connectToWebSocket(roomId: string): WebSocket {
  if (socket) {
    socket.close()
  }

  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/${roomId}`
  socket = new WebSocket(wsUrl)

  socket.onopen = () => {
    console.log("WebSocket connection established")
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
  }

  socket.onclose = () => {
    console.log("WebSocket connection closed")
  }

  return socket
}

export function sendMessage(roomId: string, message: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ roomId, message }))
  } else {
    console.error("WebSocket is not connected")
  }
}

export async function registerUser(username: string, password: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error("Registration failed")
  }
}

