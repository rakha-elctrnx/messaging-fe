import Link from "next/link"
import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-primary-orange mb-8">Login</h1>
      <LoginForm />
      <p className="mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary-orange hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}

