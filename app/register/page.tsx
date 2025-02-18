import RegisterForm from "@/components/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-primary-orange mb-8">Register</h1>
      <RegisterForm />
    </div>
  )
}

