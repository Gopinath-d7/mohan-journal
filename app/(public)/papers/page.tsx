import { db } from "@/lib/db"
import Link from "next/link"

export default async function PapersPage() {
  const papers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { author: true, journal: true },
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Published Papers</h1>
        <p className="text-gray-500 text-sm mt-1">
          {papers.length} papers published
        </p>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-400">No published papers yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
            <Link
              key={paper.id}
              href={`/papers/${paper.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 text-lg">
                {paper.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {paper.author.name} · {paper.journal.title} ·{" "}
                {new Date(paper.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                {paper.abstract}
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {paper.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}