import { unstable_noStore as noStore } from "next/cache"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"

export async function GET() {
  noStore()
  const res = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
    },
  })
  console.log(res)

  return NextResponse.json(res)
}
