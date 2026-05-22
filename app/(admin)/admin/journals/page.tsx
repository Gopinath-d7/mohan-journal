import { db } from "@/lib/db"
import Link from "next/link"
import DeleteJournalButton from "@/components/admin/DeleteJournalButton"

export default async function AdminJournalsPage() {
  const journals = await db.journal.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { papers: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journals</h1>
          <p className="text-gray-500 text-sm mt-1">{journals.length} journals total</p>
        </div>
        <Link
          href="/admin/journals/new"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
        >
          + Add Journal
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Title</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Subject</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Papers</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {journals.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">
                  No journals yet
                </td>
              </tr>
            ) : (
              journals.map((journal) => (
                <tr key={journal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{journal.title}</p>
                    <p className="text-xs text-gray-500">{journal.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{journal.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{journal._count.papers}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      journal.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {journal.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/journals/${journal.id}/edit`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteJournalButton id={journal.id} />
                    </div>
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