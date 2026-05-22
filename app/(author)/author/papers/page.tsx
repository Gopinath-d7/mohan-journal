import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"

export default async function MyPapersPage() {
  const session = await auth()

  const papers = await db.paper.findMany({
    where: { authorId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { journal: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Papers</h1>
          <p className="text-gray-500 text-sm mt-1">
            {papers.length} submissions
          </p>
        </div>
        <Link
          href="/author/submit"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
        >
          + Submit New
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-100">
          {papers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No papers submitted yet</p>
              <Link
                href="/author/submit"
                className="mt-3 inline-block text-sm text-slate-900 font-medium hover:underline"
              >
                Submit your first paper →
              </Link>
            </div>
          ) : (
            papers.map((paper) => (
              <div key={paper.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {paper.journal.title} ·{" "}
                      {new Date(paper.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {paper.abstract}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {paper.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        paper.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : paper.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : paper.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {paper.status}
                    </span>
                    <div className="flex gap-2 mt-1">
  <a
    href={paper.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition"
  >
    View PDF
  </a>
  <a
  href={`/api/papers/download?url=${encodeURIComponent(paper.fileUrl)}&download=true`}
  className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition"
>
  Download PDF
</a>
</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}