import { db } from "@/db"
import { currencies } from "@/db/schema"
import { Hono } from "hono"

const app = new Hono().get("/", async (c) => {
  const data = await db
    .select({
      id: currencies.id,
      name: currencies.name,
      locale: currencies.locale,
      code: currencies.code,
    })
    .from(currencies)
  return c.json({ data })
})

export default app
