import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

import { getDoner } from "@/app/_lib/queries/doners"

const app = new Hono().get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const { id } = c.req.valid("param")

    const data = await getDoner({ id })

    return c.json({ data })
  }
)

export default app
