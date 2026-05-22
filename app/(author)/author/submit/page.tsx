import SubmitPaperForm from "@/components/author/SubmitPaperForm"
import { db } from "@/lib/db"

export default async function SubmitPaperPage() {
  const journals = await db.journal.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
    select: {
      id:          true,
      title:       true,
      subject:     true,
      description: true,
    }
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submit Paper</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select a journal and fill in your paper details
        </p>
      </div>
      <SubmitPaperForm journals={journals} />
    </div>
  )
}