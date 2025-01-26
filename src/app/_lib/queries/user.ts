import { cache } from "react"
import { db } from "@/db"
import { employees } from "@/db/schemas"
import { users } from "@/db/schemas/user"
import { eq } from "drizzle-orm"

import { currentUser } from "../auth"

type User = {
  email?: string
  id?: string
}

export const getUser = async ({ email, id }: User) => {
  if (!email && !id) return undefined
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(email ? eq(users.email, email) : id ? eq(users.id, id) : undefined)
    return user
  } catch (error) {
    throw new Error("Error getting user from database")
  }
}

export const getUsers = cache(async () => {
  try {
    return await db.select().from(users)
  } catch (error) {
    throw new Error("Error getting users from database")
  }
})

export const currentEmployee = async () => {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return undefined
    }
    const [employee] = await db
      .select({
        id: employees.id,
      })
      .from(employees)
      .where(eq(employees.userId, user.id))

    return employee
  } catch (error) {
    throw new Error("Error getting current employee from database")
  }
}
