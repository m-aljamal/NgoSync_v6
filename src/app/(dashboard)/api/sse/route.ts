import { NextResponse, type NextRequest } from "next/server"

export const dynamic = "force-dynamic";
export const runtime = 'edge'
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




// import { NextResponse, type NextRequest } from "next/server"

// export const runtime = 'edge'

// const encoder = new TextEncoder()
// const clients: Set<ReadableStreamDefaultController> = new Set()

// export async function GET(request: NextRequest) {
//   const stream = new ReadableStream({
//     start(controller) {
//       clients.add(controller)
//       request.signal.addEventListener("abort", () => {
//         clients.delete(controller)
//       })

//       // Send an initial message to establish the connection
//       controller.enqueue(encoder.encode("data: connected\n\n"))
//     },
//   })

//   return new Response(stream, {
//     headers: {
//       'Content-Type': 'text/event-stream',
//       'Cache-Control': 'no-cache',
//       'Connection': 'keep-alive',
//     },
//   })
// }

// export async function POST() {
//   clients.forEach((client) => {
//     client.enqueue(encoder.encode("data: update\n\n"))
//   })
//   return NextResponse.json({ success: true })
// }



// import { NextResponse, type NextRequest } from "next/server"
// export const dynamic = "force-dynamic";
// // export const runtime = 'edge'

// const encoder = new TextEncoder()
// const clients: Set<ReadableStreamDefaultController> = new Set()

// export async function GET(request: NextRequest) {
//   const stream = new ReadableStream({
//     start(controller) {
//       clients.add(controller)
//       request.signal.addEventListener("abort", () => {
//         clients.delete(controller)
//       })

//       // Send an initial message to establish the connection
//       controller.enqueue(encoder.encode("data: connected\n\n"))

//       // Implement keep-alive mechanism
//       const keepAlive = setInterval(() => {
//         controller.enqueue(encoder.encode(": keep-alive\n\n"))
//       }, 15000) // Send keep-alive every 15 seconds

//       request.signal.addEventListener("abort", () => {
//         clearInterval(keepAlive)
//       })
//     },
//   })

//   return new Response(stream, {
//     headers: {
//       'Content-Type': 'text/event-stream',
//       'Cache-Control': 'no-cache, no-transform',
//       'Connection': 'keep-alive',
//     },
//   })
// }

// export async function POST() {
//   clients.forEach((client) => {
//     client.enqueue(encoder.encode("data: update\n\n"))
//   })
//   return NextResponse.json({ success: true })
// }