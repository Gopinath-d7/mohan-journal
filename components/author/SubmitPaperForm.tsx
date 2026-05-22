"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Journal = {
  id: string
  title: string
  subject: string
  description: string
}

export default function SubmitPaperForm({
  journals,
}: {
  journals: Journal[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title:     "",
    abstract:  "",
    keywords:  "",
    journalId: "",
  })
  const [file, setFile] = useState<File | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm({ ...form, journalId: e.target.value })
  }

  const selectedJournal = journals.find((j) => j.id === form.journalId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!file) {
      setError("Please upload your paper PDF")
      setLoading(false)
      return
    }

    if (!form.journalId) {
      setError("Please select a journal")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("title",     form.title)
    formData.append("abstract",  form.abstract)
    formData.append("keywords",  form.keywords)
    formData.append("journalId", form.journalId)
    formData.append("file",      file)

    const res  = await fetch("/api/papers", {
      method: "POST",
      body:   formData,
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message || "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/author/papers?submitted=true")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
    >
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Journal Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Select Journal <span className="text-red-500">*</span>
        </label>

        {journals.length === 0 ? (
          <div className="bg-yellow-50 text-yellow-700 text-sm px-4 py-3 rounded-lg">
            No active journals available. Please check back later.
          </div>
        ) : (
          <>
            <select
              value={form.journalId}
              onChange={handleSelectChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white"
            >
              <option value="">-- Select a journal --</option>
              {journals.map((journal) => (
                <option key={journal.id} value={journal.id}>
                  {journal.title} — {journal.subject}
                </option>
              ))}
            </select>

            {/* Show selected journal info */}
            {selectedJournal && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-blue-900">
                    {selectedJournal.title}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {selectedJournal.subject}
                  </span>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {selectedJournal.description}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Paper Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Enter your paper title"
        />
      </div>

      {/* Abstract */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Abstract <span className="text-red-500">*</span>
        </label>
        <textarea
          name="abstract"
          value={form.abstract}
          onChange={handleTextAreaChange}
          required
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Write your abstract here (minimum 50 words)"
        />
        <p className="text-xs text-gray-400">
          {form.abstract.split(" ").filter(Boolean).length} words
        </p>
      </div>

      {/* Keywords */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Keywords <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="keywords"
          value={form.keywords}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="machine learning, neural networks, AI"
        />
        <p className="text-xs text-gray-400">Separate keywords with commas</p>
        {form.keywords && (
          <div className="flex gap-2 flex-wrap mt-2">
            {form.keywords.split(",").map((kw, i) => (
              kw.trim() && (
                <span
                  key={i}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                >
                  {kw.trim()}
                </span>
              )
            ))}
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Upload Paper <span className="text-red-500">*</span>
        </label>
        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
          file ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-gray-400"
        }`}>
          {file ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700">✅ {file.name}</p>
              <p className="text-xs text-green-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs text-red-500 hover:underline mt-1"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-500">
                Drag and drop your PDF here or{" "}
                <label className="text-blue-600 hover:underline cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-400">PDF files only, max 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !form.journalId || !file}
        className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Paper for Review"}
      </button>

      {(!form.journalId || !file) && (
        <p className="text-xs text-center text-gray-400">
          {!form.journalId && !file
            ? "Please select a journal and upload a PDF to continue"
            : !form.journalId
            ? "Please select a journal to continue"
            : "Please upload a PDF to continue"}
        </p>
      )}
    </form>
  )
}