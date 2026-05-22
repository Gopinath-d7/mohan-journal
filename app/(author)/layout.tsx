import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/shared/Navbar"
import Footer from "@/components/shared/Footer"
import { SessionProvider } from "next-auth/react"
import AuthorShell from "@/components/author/AuthorShell"

export default async function AuthorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) redirect("/login")
  if (session.user.role !== "AUTHOR") redirect("/login")

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <AuthorShell user={session.user}>
            {children}
          </AuthorShell>
        </div>
        <Footer />
      </div>
    </SessionProvider>
  )
}