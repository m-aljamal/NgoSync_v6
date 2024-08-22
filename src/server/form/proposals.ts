import { db } from "@/db"
import { proposals } from "@/db/schemas"
import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: proposals.id,
        name: proposals.name,
      })
      .from(proposals)

    return c.json({ data })
  })
  .get(
    "/:projectId",
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const { projectId } = c.req.valid("param")
      const data = await db
        .select({
          id: proposals.id,
          name: proposals.name,
        })
        .from(proposals)
        .where(eq(proposals.projectId, projectId))

      return c.json({ data })
    }
  )

export default app
