import { db } from "@/db"
import { funds } from "@/db/schemas/fund"
import { desc } from "drizzle-orm"
import { Hono } from "hono"

const app = new Hono().get("/", async (c) => {
  const data = await db
    .select({
      id: funds.id,
      name: funds.name,
    })
    .from(funds)
    .orderBy(desc(funds.createdAt))
  return c.json({ data })
})

export default app
