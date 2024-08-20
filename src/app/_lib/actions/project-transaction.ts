"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { expensesCategories, type ExpensesCategory } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"

import { actionClient } from "../safe-action"
import { createExpenseCategorySchema, deleteArraySchema } from "../validations"

function generateExpenseCategory(): Omit<ExpensesCategory, "projectId"> {
  return {
    id: generateId(),
    name: `category ${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function seedExpenseCategories() {
  try {
    const projectsInDb = await db.query.projects.findMany()
    if (projectsInDb.length === 0) {
      throw new Error("No projects found")
    }

    const allExpensesCategories: ExpensesCategory[] = []
    for (let i = 0; i < 100; i++) {
      allExpensesCategories.push({
        ...generateExpenseCategory(),
        projectId:
          projectsInDb[Math.floor(Math.random() * projectsInDb.length)]?.id ||
          "",
      })
    }
    await db.delete(expensesCategories)
    console.log("📝 Inserting expense categories", allExpensesCategories.length)
    await db
      .insert(expensesCategories)
      .values(allExpensesCategories)
      .onConflictDoNothing()
  } catch (error) {
    console.error(error)
  }
}

export const createExpenseCategory = actionClient
  .schema(createExpenseCategorySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: data }) => {
    noStore()
    await db.insert(expensesCategories).values(data)
    revalidatePath("/expenses-categories")
  })

export const deleteExpenseCategory = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db
      .delete(expensesCategories)
      .where(inArray(expensesCategories.id, ids))
    revalidatePath("/expenses-categories")
  })

export const updateExpenseCategory = actionClient
  .schema(createExpenseCategorySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: data }) => {
    noStore()
    if (!data.id) throw new Error("id is required")
    await db
      .update(expensesCategories)
      .set(data)
      .where(eq(expensesCategories.id, data.id))
    revalidatePath("/expenses-categories")
  })
