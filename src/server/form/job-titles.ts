import { db } from "@/db"
import { employeesJobTitles } from "@/db/schemas"
import { Hono } from "hono"

const app = new Hono().get("/", async (c) => {
  const data = await db
    .select({
      id: employeesJobTitles.id,
      name: employeesJobTitles.name,
    })
    .from(employeesJobTitles)
  return c.json({ data })
})

export default app
