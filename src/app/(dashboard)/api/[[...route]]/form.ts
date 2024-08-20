import { db } from "@/db"
import { currencies, expensesCategories, projects, users } from "@/db/schema"
import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono().get(
  "/:form",
  zValidator("param", z.object({ form: z.string() })),
  async (c) => {
    const { form } = c.req.valid("param")
    switch (form) {
      case "expense-categories":
        const categories = await db
          .select({
            id: expensesCategories.id,
            name: expensesCategories.name,
          })
          .from(expensesCategories)

        return c.json({ data: categories })
      case "users":
        const usersData = await db
          .select({
            id: users.id,
            name: users.name,
          })
          .from(users)
        return c.json({ data: usersData })
      case "currencies":
        const currenciesData = await db
          .select({
            id: currencies.id,
            name: currencies.name,
            locale: currencies.locale,
            code: currencies.code,
          })
          .from(currencies)
        return c.json({ data: currenciesData })
      case "projects":
        const projectsData = await db
          .select({
            id: projects.id,
            name: projects.name,
          })
          .from(projects)
          .where(eq(projects.status, "in-progress"))
        return c.json({ data: projectsData })
      default:
        return c.json({
          data: [
            {
              id: "",
              name: "No data",
            },
          ],
        })
    }
  }
)

export default app
