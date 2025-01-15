import { db } from "@/db"
import { students } from "@/db/schemas/student"
import { zValidator } from "@hono/zod-validator"
import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: students.id,
        name: students.name,
      })
      .from(students)
      .orderBy(desc(students.createdAt))
    return c.json({ data })
  })
  .get(
    "/:projectId",
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const { projectId } = c.req.valid("param")
      const data = await db
        .select({
          id: students.id,
          name: students.name,
        })
        .from(students)
        .where(eq(students.projectId, projectId))
        .orderBy(desc(students.createdAt))

      return c.json({ data })
    }
  )

export default app
