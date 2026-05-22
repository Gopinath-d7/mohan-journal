"use client"

import { useState, useEffect, createContext, useContext } from "react"

export const SidebarContext = createContext(false)

export default function AuthorMain({ children }: { children: React.ReactNode }) {
  const collapsed = useContext(SidebarContext)

  return (
    <main
      className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${
        collapsed ? "ml-16" : "ml-64"
      }`}
    >
      {children}
    </main>
  )
}