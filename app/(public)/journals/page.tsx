import { db } from "@/lib/db"
import Link from "next/link"

export default async function JournalsPage() {
  const journals = await db.journal.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { papers: true } },
    },
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Journals</h1>
        <p className="text-gray-500 mt-2">
          Browse our collection of peer-reviewed journals
        </p>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-400">No journals available yet</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {journals.map((journal) => (
            <Link
              key={journal.id}
              href={`/journals/${journal.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {journal.subject}
              </span>
              <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-2">
                {journal.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {journal.description}
              </p>
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {journal._count.papers}
                  </p>
                  <p className="text-xs text-gray-400">Papers</p>
                </div>
                {journal.issn && (
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {journal.issn}
                    </p>
                    <p className="text-xs text-gray-400">ISSN</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}