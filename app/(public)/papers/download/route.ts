import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url      = searchParams.get("url")
  const download = searchParams.get("download")

  if (!url) {
    return NextResponse.json({ message: "No URL provided" }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch PDF" },
        { status: 500 }
      )
    }

    const buffer      = await response.arrayBuffer()
    const filename    = url.split("/").pop()?.split("?")[0] || "paper.pdf"
    const disposition = download ? `attachment; filename="${filename}"` : "inline"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": disposition,
        "Cache-Control":       "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("PDF fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch PDF" },
      { status: 500 }
    )
  }
}