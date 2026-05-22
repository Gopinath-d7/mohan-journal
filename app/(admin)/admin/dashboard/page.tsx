import { db } from "@/lib/db"

export default async function AdminDashboard() {
  const [totalJournals, totalPapers, totalUsers, pendingPapers, totalSubscribers] =
    await Promise.all([
      db.journal.count(),
      db.paper.count(),
      db.user.count(),
      db.paper.count({ where: { status: "PENDING" } }),
      db.newsletter.count(),
    ])

  const stats = [
    { label: "Total Journals", value: totalJournals, color: "bg-blue-50 text-blue-700" },
    { label: "Total Papers",   value: totalPapers,   color: "bg-green-50 text-green-700" },
    { label: "Total Users",    value: totalUsers,    color: "bg-purple-50 text-purple-700" },
    { label: "Pending Review", value: pendingPapers, color: "bg-yellow-50 text-yellow-700" },
    { label: "Subscribers",    value: totalSubscribers, color: "bg-pink-50 text-pink-700" },
  ]

  const recentPapers = await db.paper.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { author: true, journal: true },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
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

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Submissions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentPapers.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No submissions yet</p>
          ) : (
            recentPapers.map((paper: any) => (
              <div key={paper.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{paper.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {paper.author.name} · {paper.journal.title}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  paper.status === "PENDING"   ? "bg-yellow-100 text-yellow-700" :
                  paper.status === "APPROVED"  ? "bg-green-100 text-green-700"  :
                  paper.status === "REJECTED"  ? "bg-red-100 text-red-700"      :
                  "bg-blue-100 text-blue-700"
                }`}>
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