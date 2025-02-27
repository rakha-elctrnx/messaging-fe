import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProfile() {
  const token = localStorage.getItem("token")
  if (!token) return null
  const payload = token.split(".")[1]
  const decoded = atob(payload)
  return JSON.parse(decoded)
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}