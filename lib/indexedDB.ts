import { MessageInterface } from "@/constant/interface"
import { openDB, DBSchema, IDBPDatabase } from "idb"

// Define the database schema
interface ChatDBSchema extends DBSchema {
  messages: {
    key: string; // ID of the message
    value: MessageInterface;
    indexes: { "room_id": string }; // Index for room_id
  };
}

const DB_NAME = "chatApp"
const STORE_NAME = "messages"
const channel = new BroadcastChannel("message_updates")

// Define the type for BroadcastChannel events
type BroadcastEvent = {
  type: "update";
  message: MessageInterface;
}

// Open the database with proper schema and versioning
export const getDB = async (): Promise<IDBPDatabase<ChatDBSchema>> => {
  return openDB<ChatDBSchema>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
        store.createIndex("room_id", "room_id", { unique: false }) // Add index for room_id
      }
    }
  })
}

// Save a message to IndexedDB and broadcast an update
export const saveMessage = async (message: MessageInterface): Promise<void> => {
  try {
    const db = await getDB()
    await db.put(STORE_NAME, message) // Overwrites if the ID already exists

    // Broadcast the update after saving the message
    const event: BroadcastEvent = { type: "update", message }
    channel.postMessage(event)
  } catch (error) {
    console.error("Failed to save message to IndexedDB:", error)
    throw new Error("Failed to save message")
  }
}

// Retrieve all messages for a specific roomId
export const getMessages = async (roomId: string): Promise<MessageInterface[]> => {
  try {
    const db = await getDB()
    return db.getAllFromIndex(STORE_NAME, "room_id", roomId) // Use the room_id index
  } catch (error) {
    console.error("Failed to retrieve messages from IndexedDB:", error)
    throw new Error("Failed to retrieve messages")
  }
}