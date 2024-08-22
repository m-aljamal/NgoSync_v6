import { db } from "@/db"
import { expensesCategories } from "@/db/schemas/transactions"
import { zValidator } from "@hono/zod-validator"
import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: expensesCategories.id,
        name: expensesCategories.name,
      })
      .from(expensesCategories)
      .orderBy(desc(expensesCategories.id))
    return c.json({ data })
  })
  .get(
    "/:projectId",
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const { projectId } = c.req.valid("param")
      const data = await db
        .select({
          id: expensesCategories.id,
          name: expensesCategories.name,
        })
        .from(expensesCategories)
        .where(eq(expensesCategories.projectId, projectId))
      return c.json({ data })
    }
  )

export default app
