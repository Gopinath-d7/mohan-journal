import { db } from "@/lib/db"
import PaperActions from "@/components/admin/PaperActions"

export default async function AdminPapersPage() {
  const papers = await db.paper.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, journal: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Papers</h1>
        <p className="text-gray-500 text-sm mt-1">{papers.length} submissions total</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Paper</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Author</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Journal</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {papers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">
                  No papers yet
                </td>
              </tr>
            ) : (
              papers.map((paper: any) => (
                <tr key={paper.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {paper.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(paper.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{paper.author.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{paper.journal.title}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      paper.status === "PENDING"   ? "bg-yellow-100 text-yellow-700" :
                      paper.status === "APPROVED"  ? "bg-green-100 text-green-700"  :
                      paper.status === "REJECTED"  ? "bg-red-100 text-red-700"      :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {paper.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <PaperActions paperId={paper.id} status={paper.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}