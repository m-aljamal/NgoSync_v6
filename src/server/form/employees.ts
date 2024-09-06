import { db } from "@/db"
import { employees } from "@/db/schemas"
import { desc } from "drizzle-orm"
import { Hono } from "hono"

const app = new Hono().get("/", async (c) => {
  const data = await db
    .select({
      id: employees.id,
      name: employees.name,
    })
    .from(employees)
    .orderBy(desc(employees.createdAt))
  return c.json({ data })
})

export default app
