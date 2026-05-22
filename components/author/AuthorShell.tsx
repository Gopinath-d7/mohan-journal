"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState } from "react"

const links = [
  { href: "/author/dashboard", label: "Dashboard",    icon: "📊" },
  { href: "/author/submit",    label: "Submit Paper", icon: "📤" },
  { href: "/author/papers",    label: "My Papers",    icon: "📄" },
]

export default function AuthorShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shrink-0 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs text-gray-500 hover:text-gray-900 shadow-sm z-50"
        >
          {collapsed ? "→" : "←"}
        </button>

        {/* Brand */}
        {!collapsed && (
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-900">Mohan Journal</h1>
            <p className="text-xs text-gray-500 mt-1">Author Portal</p>
          </div>
        )}

        {/* User */}
        <div className={`border-b border-gray-100 ${collapsed ? "p-2" : "p-4"}`}>
          <div className={`bg-gray-50 rounded-lg ${collapsed ? "p-2 flex justify-center" : "p-3"}`}>
            {collapsed ? (
              <span className="text-lg">👤</span>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                collapsed ? "justify-center" : ""
              } ${
                pathname === link.href
                  ? "bg-slate-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="text-base shrink-0">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign Out"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <span className="text-base shrink-0">🚪</span>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        {children}
      </main>
    </div>
  )
}