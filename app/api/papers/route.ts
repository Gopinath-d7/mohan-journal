import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData  = await req.formData()
    const title     = formData.get("title")     as string
    const abstract  = formData.get("abstract")  as string
    const keywords  = formData.get("keywords")  as string
    const journalId = formData.get("journalId") as string
    const file      = formData.get("file")      as File

    if (!title || !abstract || !keywords || !journalId || !file) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
  resource_type: "raw",
  folder: "mohan-journal/papers",
  type: "upload",
  access_mode: "public",
  use_filename: true,
  unique_filename: true,
  overwrite: false,
},
            (error, result) => {
              if (error) reject(error)
              else resolve(result as { secure_url: string; public_id: string })
            }
          )
          .end(buffer)
      }
    )

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) +
      "-" +
      Date.now()

    const paper = await db.paper.create({
      data: {
        title,
        slug,
        abstract,
        keywords:  keywords.split(",").map((k) => k.trim()),
        journalId,
        authorId:  session.user.id,
        fileUrl:   uploadResult.secure_url,
        status:    "PENDING",
      },
    })

    return NextResponse.json(paper, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}