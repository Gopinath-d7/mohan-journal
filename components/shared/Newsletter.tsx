"use client"

import { useState } from "react"

export default function Newsletter() {
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const res  = await fetch("/api/newsletter", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess(true)
      setMessage("🎉 You're subscribed! Thank you.")
      setEmail("")
    } else {
      setSuccess(false)
      setMessage(data.message || "Something went wrong")
    }

    setLoading(false)
  }

  return (
    <section className="bg-blue-600 text-white py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-3">
          Stay Updated with Latest Research
        </h2>
        <p className="text-blue-200 mb-8">
          Subscribe to our newsletter and get notified when new papers are published.
        </p>

        {success ? (
          <div className="bg-blue-500 rounded-xl p-6">
            <p className="text-lg font-medium">{message}</p>
            <p className="text-blue-200 text-sm mt-2">
              We will notify you when new research is published.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {message && !success && (
          <p className="text-blue-200 text-sm mt-3">{message}</p>
        )}

        <p className="text-blue-300 text-xs mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}