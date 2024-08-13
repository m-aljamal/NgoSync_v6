import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"

export async function GET() {
  const res = await db.query.users.findMany({
    
  })
  console.log(res);
  
  return NextResponse.json(res)
}
