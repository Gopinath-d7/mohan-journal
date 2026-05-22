import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function PaperDetailPage(props: any) {
  const { slug } = await props.params

  const paper = await db.paper.findUnique({
    where: { slug },
    include: { author: true, journal: true },
  })

  if (!paper) notFound()

const viewUrl = paper.fileUrl
    ? paper.fileUrl.replace("/raw/upload/", "/image/upload/").replace(".pdf", ".pdf")
    : null

const downloadUrl = paper.fileUrl
    ? paper.fileUrl.replace("/raw/upload/", "/raw/upload/fl_attachment/")
    : null

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
        <Link href="/journals" className="hover:text-gray-900">Journals</Link>
        <span>›</span>
        <Link
          href={`/journals/${paper.journal.slug}`}
          className="hover:text-gray-900"
        >
          {paper.journal.title}
        </Link>
        <span>›</span>
        <span className="text-gray-900 truncate max-w-xs">{paper.title}</span>
      </div>

      {/* Paper header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            paper.status === "PUBLISHED"
              ? "bg-green-100 text-green-700"
              : paper.status === "APPROVED"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {paper.status}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {paper.journal.subject}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
          {paper.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
          <span>By <span className="font-medium text-gray-700">{paper.author.name}</span></span>
          {paper.author.affiliation && (
            <span>· {paper.author.affiliation}</span>
          )}
          <span>· {new Date(paper.createdAt).toLocaleDateString()}</span>
          {paper.doi && <span>· DOI: {paper.doi}</span>}
        </div>
      </div>

      {/* Abstract */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Abstract
        </h2>
        <p className="text-gray-700 leading-relaxed">{paper.abstract}</p>
      </div>

      {/* Keywords */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Keywords
        </h2>
        <div className="flex gap-2 flex-wrap">
          {paper.keywords.map((kw) => (
            <span
              key={kw}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Journal info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Published In
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">{paper.journal.title}</p>
            <p className="text-sm text-gray-500 mt-1">{paper.journal.subject}</p>
            {paper.journal.issn && (
              <p className="text-xs text-gray-400 mt-1">ISSN: {paper.journal.issn}</p>
            )}
          </div>
          <Link
            href={`/journals/${paper.journal.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View Journal →
          </Link>
        </div>
      </div>

      {/* PDF Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Full Paper
        </h2>
        <div className="flex gap-3 flex-wrap">
          {paper.fileUrl ? (
            <>
              <a
                href={paper.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View PDF
              </a><a
              href={`/api/papers/download?url=${encodeURIComponent(paper.fileUrl)}&download=true`}
  className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
  Download PDF
</a>
            </>
          ) : (
            <p className="text-sm text-gray-400">PDF not available</p>
          )}
        </div>
      </div>

    </div>
  )
}