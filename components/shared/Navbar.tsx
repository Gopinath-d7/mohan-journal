"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  const links = [
    { href: "/",         label: "Home" },
    { href: "/journals", label: "Journals" },
    { href: "/papers",   label: "Papers" },
    { href: "/about",    label: "About" },
  ]

  function handleSubmitClick() {
    if (status === "loading") return
    if (session) {
      router.push("/author/submit")
    } else {
      router.push("/register")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/" className="text-xl font-bold text-gray-900">
          Mohan<span className="text-blue-600">Journal</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                pathname === link.href
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-32 h-8 bg-gray-100 rounded-lg animate-pulse" />
          ) : session ? (
            <>
              <Link
                href={
                  session.user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/author/dashboard"
                }
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSubmitClick}
                className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
              >
                Submit Paper
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <button
                onClick={handleSubmitClick}
                className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
              >
                Submit Paper
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  )
}