import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, subject, issn, isActive } = await req.json()

    if (!title || !description || !subject) {
      return NextResponse.json(
        { message: "Title, description and subject are required" },
        { status: 400 }
      )
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 60) + "-" + Date.now()

    const journal = await db.journal.create({
      data: { title, description, subject, issn, isActive, slug },
    })

    return NextResponse.json(journal, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const journals = await db.journal.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
  })
  return NextResponse.json(journals)
}