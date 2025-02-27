"use client";

import { useState, useEffect } from "react";
import { connectToWebSocket } from "@/lib/websocket";
import axiosInstance from "@/lib/axiosConfig";
import { MessageInterface } from "@/constant/interface";
import { formatTime, getProfile } from "@/lib/utils";
import { saveMessage, getMessages } from "@/lib/indexedDB";

const channel = new BroadcastChannel("message_updates");

export default function MessageList({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const profile = getProfile();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Get messages from IndexedDB
        const cachedMessages = await getMessages(roomId);
        setMessages(cachedMessages);

        // Fetch messages from the server
        const response = await axiosInstance.get(
          `/user/messages/${roomId}`
        );

        if (!response.data) return;
        const fetchedMessages = response.data.reverse();

        // Save new message to IndexedDB
        fetchedMessages.forEach((message: MessageInterface) =>
          saveMessage(message)
        );

        // Update state
        const uniqueMessages = Array.from(
          new Set(
            [...cachedMessages, ...fetchedMessages].map((message) => message.id)
          )
        ).map((id) =>
          [...cachedMessages, ...fetchedMessages].find(
            (message) => message.id === id
          )
        );

        setMessages(uniqueMessages);
      } catch (err) {
        setError("Failed to fetch messages. Please try again." + err);
      }
    };

    fetchMessages();

    // connect to WebSocket
    const socket = connectToWebSocket(roomId);

    socket.onmessage = async (event) => {
      const message: MessageInterface = JSON.parse(event.data);

      // Cek apakah pesan sudah ada di state sebelumnya
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (prevMessage) => prevMessage.id === message.id
        );
        if (!isDuplicate) {
          // Simpan pesan baru ke IndexedDB
          saveMessage(message);
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    };

    // Dengarkan event dari BroadcastChannel
    const handleMessageUpdate = (
      event: MessageEvent<{ type: "update"; message: MessageInterface }>
    ) => {
      if (event.data.type === "update") {
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            (prevMessage) => prevMessage.id === event.data.message.id
          );
          if (!isDuplicate) {
            return [...prevMessages, event.data.message];
          }
          return prevMessages;
        });
      }
    };

    channel.addEventListener("message", handleMessageUpdate);

    // Cleanup function
    return () => {
      socket.close();
      channel.removeEventListener("message", handleMessageUpdate);
    };
  }, [roomId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => {
        const myMessage = message.sender.id === profile.sub;

        return (
          <div
            key={message.id}
            className={`flex ${myMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex flex-col gap-1 w-full ${
                myMessage ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`flex items-center gap-3 ${
                  myMessage ? "flex-row-reverse" : ""
                }`}
              >
                <p className="font-medium text-sm">
                  {!myMessage ? message.sender.username : "You"}
                </p>
                <p className="text-xs text-gray-400">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              <div
                className={`max-w-[70%] rounded-xl ${
                  myMessage
                    ? "bg-light-orange text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                } transition-all duration-300 transform hover:scale-100 hover:shadow-lg`}
              >
                <p className="px-3 py-2">{message.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
