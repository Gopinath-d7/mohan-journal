"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PaperActions({
  paperId,
  status,
}: {
  paperId: string
  status: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus: string) {
    setLoading(true)
    const res = await fetch(`/api/papers/${paperId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    if (!res.ok) {
      alert("Failed to update status")
    }

    setLoading(false)
    router.refresh()
  }

  if (status !== "PENDING") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => updateStatus("PENDING")}
          disabled={loading}
          className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 transition disabled:opacity-50"
        >
          Reset
        </button>
        {status === "APPROVED" && (
          <button
            onClick={() => updateStatus("PUBLISHED")}
            disabled={loading}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition disabled:opacity-50"
          >
            Publish
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus("APPROVED")}
        disabled={loading}
        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => updateStatus("REJECTED")}
        disabled={loading}
        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}