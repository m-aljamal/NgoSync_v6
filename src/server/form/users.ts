import { db } from "@/db"
import { users } from "@/db/schemas/user"
import { Hono } from "hono"

const app = new Hono().get("/", async (c) => {
  const data = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
    })
    .from(users)
  return c.json({ data })
})

export default app
