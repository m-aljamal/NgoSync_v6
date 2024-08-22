import { db } from "@/db"
import { doners } from "@/db/schemas/donation"
import { desc } from "drizzle-orm"
import { Hono } from "hono"

const app = new Hono().get("/", async (c) => {
  const data = await db
    .select({
      id: doners.id,
      name: doners.name,
    })
    .from(doners)
    .orderBy(desc(doners.createdAt))
  return c.json({ data })
})

export default app
