import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function JournalDetailPage(props: any) {
  const { slug } = await props.params
  const session = await auth()

  console.log("SESSION:", session?.user?.email, session?.user?.role)

  const journal = await db.journal.findUnique({
    where: { slug },
    include: {
      papers: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
      _count: { select: { papers: true } },
    },
  })

  if (!journal) notFound()

  const submitHref = session ? "/author/submit" : "/register"

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-10 mb-10">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
              {journal.subject}
            </span>
            <h1 className="text-3xl font-bold mt-4 mb-3">{journal.title}</h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              {journal.description}
            </p>
            <div className="flex gap-6 mt-6">
              <div>
                <p className="text-2xl font-bold">{journal._count.papers}</p>
                <p className="text-slate-400 text-xs mt-1">Total Papers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{journal.papers.length}</p>
                <p className="text-slate-400 text-xs mt-1">Published</p>
              </div>
              {journal.issn && (
                <div>
                  <p className="text-2xl font-bold">{journal.issn}</p>
                  <p className="text-slate-400 text-xs mt-1">ISSN</p>
                </div>
              )}
            </div>
          </div>
          <Link
            href={submitHref}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition whitespace-nowrap"
          >
            Submit Paper
          </Link>
        </div>
      </div>

      {/* Papers */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Published Papers
        </h2>

        {journal.papers.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-400">No published papers yet</p>
            <Link
              href={submitHref}
              className="mt-3 inline-block text-sm text-blue-600 hover:underline"
            >
              Be the first to submit →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {journal.papers.map((paper) => (
              <Link
                key={paper.id}
                href={`/papers/${paper.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                  {paper.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {paper.author.name} ·{" "}
                  {new Date(paper.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
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

    </div>
  )
}