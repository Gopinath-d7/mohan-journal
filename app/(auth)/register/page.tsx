import RegisterForm from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mohan Journal</h1>
          <p className="text-gray-500 mt-2">Create your author account</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}