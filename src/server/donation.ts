import { db } from "@/db"
import { currencies, donations, fundTransactions } from "@/db/schemas"
import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono().get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param")
    const [data] = await db
      .select()
      .from(donations)
      .where(eq(donations.id, id))
      .innerJoin(
        fundTransactions,
        eq(fundTransactions.id, donations.fundTransactionId)
      )
      .innerJoin(currencies, eq(currencies.id, fundTransactions.currencyId))

    return c.json({ data })
  }
)

export default app
