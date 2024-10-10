import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

import { getExpense } from "@/app/_lib/queries/expenses"

const app = new Hono().get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param")

    const data = await getExpense(id)

    return c.json({ data })
  }
)

export default app
