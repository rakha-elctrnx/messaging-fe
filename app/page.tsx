import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-primary-orange mb-8">Welcome to Multi-Room Messaging</h1>
      <div className="space-y-4">
        <Link href="/login" className="btn-primary block text-center">
          Login to Start Messaging
        </Link>
        <Link href="/register" className="btn-primary block text-center">
          Register New Account
        </Link>
      </div>
    </div>
  )
}

