import Navbar from "@/components/shared/Navbar"
import Footer from "@/components/shared/Footer"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </SessionProvider>
  )
}