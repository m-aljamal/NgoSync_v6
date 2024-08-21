import { db } from "@/db"
import { projects } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"

const app = new Hono().get("/", async (c) => {
  const data = await db
    .select({
      id: projects.id,
      name: projects.name,
    })
    .from(projects)
    .where(eq(projects.status, "in-progress"))
    .orderBy(desc(projects.createdAt))
  return c.json({ data })
})

export default app
