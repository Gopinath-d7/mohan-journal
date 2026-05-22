import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import JournalForm from "@/components/admin/JournalForm"

export default async function EditJournalPage(props: any) {
  const id = (await props.params).id

  const journal = await db.journal.findUnique({
    where: { id },
  })

  if (!journal) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Journal</h1>
        <p className="text-gray-500 text-sm mt-1">{journal.title}</p>
      </div>
      <JournalForm journal={journal} />
    </div>
  )
}
