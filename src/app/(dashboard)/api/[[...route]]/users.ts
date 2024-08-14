import { db } from "@/db"
import { users } from "@/db/schema"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
    return c.json({ data })
  })
  .get("/:name", zValidator("param", z.object({ name: z.string() })), (c) => {
    const { name } = c.req.valid("param")
    return c.json({ message: `Hello, ${name}!` })
  })

export default app
