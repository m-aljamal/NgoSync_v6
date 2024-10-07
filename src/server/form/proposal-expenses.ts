import { db } from "@/db"
import { expensesCategories, proposalsExpenses } from "@/db/schemas"
import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: proposalsExpenses.id,
        name: expensesCategories.name,
      })
      .from(proposalsExpenses)
      .innerJoin(
        expensesCategories,
        eq(expensesCategories.id, proposalsExpenses.expensesCategoryId)
      )

    return c.json({ data })
  })
  .get(
    "/:proposalId",
    zValidator("param", z.object({ proposalId: z.string() })),
    async (c) => {
      const { proposalId } = c.req.valid("param")
      const data = await db
        .select({
          id: proposalsExpenses.id,
          expensesCategoryId: proposalsExpenses.expensesCategoryId,
          amount: proposalsExpenses.amount,
        })
        .from(proposalsExpenses)
        .where(eq(proposalsExpenses.proposalId, proposalId))

      return c.json({ data })
    }
  )

export default app
