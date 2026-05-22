import Link from "next/link"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import Newsletter from "@/components/shared/Newsletter"

export default async function HomePage() {
  const session = await auth()

  const journals = await db.journal.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { papers: true } } },
  })

  const recentPapers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { author: true, journal: true },
  })

  const totalPapers      = await db.paper.count({ where: { status: "PUBLISHED" } })
  const totalJournals    = await db.journal.count({ where: { isActive: true } })
  const totalAuthors     = await db.user.count({ where: { role: "AUTHOR" } })
  const submitHref       = session ? "/author/submit" : "/register"
  const colors           = [
    "bg-blue-600", "bg-purple-600", "bg-green-600",
    "bg-orange-600", "bg-red-600", "bg-teal-600",
  ]

  return (
    <div>

      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Publish and Discover
            <span className="text-blue-400"> Academic Research</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            An open access journal platform connecting researchers worldwide.
            Submit your paper, get peer reviewed, and share your findings.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href={submitHref}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Submit Your Paper
            </Link>
            <Link
              href="/journals"
              className="bg-slate-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-600 transition"
            >
              Browse Journals
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold">{totalJournals}</p>
            <p className="text-blue-200 text-sm mt-1">Active Journals</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{totalPapers}</p>
            <p className="text-blue-200 text-sm mt-1">Published Papers</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{totalAuthors}</p>
            <p className="text-blue-200 text-sm mt-1">Registered Authors</p>
          </div>
        </div>
      </section>

      {/* Journals */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Journals</h2>
              <p className="text-gray-500 text-sm mt-1">
                Browse our collection of peer-reviewed journals
              </p>
            </div>
            <Link href="/journals" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>

          {journals.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-400">No journals yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {journals.map((journal, i) => (
                <Link
                  key={journal.id}
                  href={`/journals/${journal.slug}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group"
                >
                  <div className={`${colors[i % colors.length]} h-24 flex items-center justify-center`}>
                    <span className="text-white text-3xl font-bold">
                      {journal.title.charAt(0)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                      {journal.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {journal.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {journal.subject}
                      </span>
                      <span className="text-xs text-gray-400">
                        {journal._count.papers} papers
                      </span>
                    </div>
                    {journal.issn && (
                      <p className="text-xs text-gray-400 mt-2">
                        ISSN: {journal.issn}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Papers */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Recent Publications
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Latest peer-reviewed research from our journals
              </p>
            </div>
            <Link href="/papers" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>

          {recentPapers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-400">No published papers yet</p>
              <Link
                href={submitHref}
                className="mt-3 inline-block text-sm text-blue-600 hover:underline"
              >
                Be the first to publish →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPapers.map((paper) => (
                <Link
                  key={paper.id}
                  href={`/papers/${paper.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 text-lg">
                        {paper.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <p className="text-xs text-gray-500">
                          By <span className="font-medium">{paper.author.name}</span>
                        </p>
                        <span className="text-gray-300">·</span>
<span className="text-xs text-blue-600">
  {paper.journal.title}
</span>
                        <span className="text-gray-300">·</span>
                        <p className="text-xs text-gray-500">
                          {new Date(paper.createdAt).toLocaleDateString("en-US", {
                            year:  "numeric",
                            month: "long",
                            day:   "numeric",
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {paper.abstract}
                      </p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {paper.keywords.slice(0, 4).map((kw) => (
                          <span
                            key={kw}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        Published
                      </span>
                      <span className="text-xs text-blue-600 hover:underline">
                        Read more →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* CTA */}
      <section className="py-16 px-6 bg-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to publish your research?
          </h2>
          <p className="text-slate-400 mb-8">
            Join hundreds of researchers publishing with us.
            Fast review process, open access publishing.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={submitHref}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/journals"
              className="bg-slate-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-600 transition"
            >
              Browse Journals
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}