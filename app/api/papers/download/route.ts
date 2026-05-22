import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url      = searchParams.get("url")
  const download = searchParams.get("download")

  if (!url) {
    return NextResponse.json({ message: "No URL" }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const buffer   = await response.arrayBuffer()
    const filename = url.split("/").pop()?.split("?")[0] || "paper.pdf"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": download
          ? `attachment; filename="${filename}"`
          : "inline",
        "Cache-Control":       "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}