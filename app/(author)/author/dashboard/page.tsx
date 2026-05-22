import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"

export default async function AuthorDashboard() {
  const session = await auth()

  const papers = await db.paper.findMany({
    where: { authorId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { journal: true },
  })

  const stats = [
    {
      label: "Total Submitted",
      value: papers.length,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending Review",
      value: papers.filter((p) => p.status === "PENDING").length,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Approved",
      value: papers.filter((p) => p.status === "APPROVED").length,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Published",
      value: papers.filter((p) => p.status === "PUBLISHED").length,
      color: "bg-purple-50 text-purple-700",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {session?.user.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your paper submissions
          </p>
        </div>
        <Link
          href="/author/submit"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
        >
          + Submit Paper
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl p-6 ${stat.color}`}>
            <p className="text-sm font-medium opacity-70">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Papers */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">My Submissions</h2>
          <Link
            href="/author/papers"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {papers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No submissions yet</p>
              <Link
                href="/author/submit"
                className="mt-3 inline-block text-sm text-slate-900 font-medium hover:underline"
              >
                Submit your first paper →
              </Link>
            </div>
          ) : (
            papers.slice(0, 5).map((paper) => (
              <div
                key={paper.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {paper.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {paper.journal.title} ·{" "}
                    {new Date(paper.createdAt).toLocaleDateString()}
                  </p>
                </div>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}