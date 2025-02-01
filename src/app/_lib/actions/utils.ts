"use server"

import { db } from "@/db"
import { expensesCategories } from "@/db/schemas"

import { getExpenseCategory } from "../queries/expenses"

export async function findOrCreateExpenseCategory(
  name: string,
  projectId: string
) {
  const existing = await getExpenseCategory({
    name,
    projectId,
  })

  if (existing) {
    return existing
  } else {
    const newCategory = await db
      .insert(expensesCategories)
      .values({ projectId, name })
      .returning()

    return newCategory[0]
  }
}
