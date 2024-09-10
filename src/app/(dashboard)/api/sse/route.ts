import { NextResponse, type NextRequest } from "next/server"

const clients: Set<ReadableStreamDefaultController> = new Set()

export async function GET(request: NextRequest) {
  const response = new NextResponse(
    new ReadableStream({
      start(controller) {
        clients.add(controller)
        request.signal.addEventListener("abort", () => {
          clients.delete(controller)
        })
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  )

  return response
}

export async function POST() {
  clients.forEach((client) => {
    client.enqueue("data: update\n\n")
  })
  return NextResponse.json({ success: true })
}
