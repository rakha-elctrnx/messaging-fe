let socket: WebSocket | null = null;

export function connectToWebSocket(roomId: string): WebSocket {
  // Close the previous socket connection if it exists
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }

  // Create a new WebSocket connection
  const wsUrl = `ws://localhost:9090/ws?room_id=${roomId}`;
  socket = new WebSocket(wsUrl);

  // WebSocket event handlers
  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log("WebSocket connection closed", event);
    // You could handle reconnection logic here if needed
  };

  return socket;
}

export function sendMessage(roomId: string, message: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ roomId, message }));
  } else {
    console.error("WebSocket is not connected");
  }
}

export function closeWebSocket() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
  socket = null;
}
