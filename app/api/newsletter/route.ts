import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    const existing = await db.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { message: "Already subscribed!" },
        { status: 400 }
      )
    }

    await db.newsletter.create({
      data: { email },
    })

    return NextResponse.json(
      { message: "Subscribed successfully!" },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}