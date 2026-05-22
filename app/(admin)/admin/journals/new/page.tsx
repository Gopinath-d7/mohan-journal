import JournalForm from "@/components/admin/JournalForm"

export default function NewJournalPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Journal</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create a new journal for authors to submit papers
        </p>
      </div>
      <JournalForm />
    </div>
  )
}