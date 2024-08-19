import { db } from "@/db"
import { users } from "@/db/schema"
import { Hono } from "hono"

const app = new Hono().get("/", async (c) => {
  const data = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
  return c.json({ data })
})

export default app
