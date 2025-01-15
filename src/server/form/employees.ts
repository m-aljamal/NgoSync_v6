import { db } from "@/db"
import { employees } from "@/db/schemas"
import { zValidator } from "@hono/zod-validator"
import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: employees.id,
        name: employees.name,
      })
      .from(employees)
      .orderBy(desc(employees.createdAt))
    return c.json({ data })
  })
  .get(
    "/:projectId",
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const { projectId } = c.req.valid("param")
      const data = await db
        .select({
          id: employees.id,
          name: employees.name,
          currencyId: employees.currencyId,
          salary: employees.salary,
        })
        .from(employees)
        .where(eq(employees.projectId, projectId))
        .orderBy(desc(employees.createdAt))

      return c.json({ data })
    }
  )

export default app
