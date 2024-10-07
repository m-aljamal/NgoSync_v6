"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import {
  expensesCategories,
  projectsTransactions,
  type ExpensesCategory,
} from "@/db/schemas"
import { format } from "date-fns"
import { eq, inArray, sql } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"

import { calculateAmounts } from "../queries/utils"
import { actionClient } from "../safe-action"
import { toDecimalFixed } from "../utils"
import {
  createExpenseCategorySchema,
  createExpenseSchema,
  deleteArraySchema,
} from "../validations"

function generateExpenseCategory(): Omit<ExpensesCategory, "projectId"> {
  return {
    id: generateId(),
    name: `category ${Math.floor(Math.random() * 10)}`,
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
    for (let i = 0; i < 10; i++) {
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

export const createExpense = actionClient
  .schema(createExpenseSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        projectId,
        currencyId,
        amount: expenseAmount,
        description,
        isOfficial,
        expensesCategoryId,
        date: expenseDate,
        proposalId,
      },
    }) => {
      noStore()

      const amount = toDecimalFixed(expenseAmount)
      const date = format(expenseDate, "yyyy-MM-dd")
      const { amountInUSD, proposalAmount, officialAmount } =
        await calculateAmounts({
          amount: expenseAmount,
          currencyId,
          date: expenseDate,
          isOfficial,
          proposalId,
        })

      await db.insert(projectsTransactions).values({
        amount: sql`${-amount}`,
        proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
        amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
        officialAmount: officialAmount ? sql`${-officialAmount}` : "0",
        date,
        type: "outcome",
        category: "expense",
        transactionStatus: "pending",
        proposalId,
        projectId,
        currencyId,
        description,
        isOfficial,
        expensesCategoryId,
      })

      revalidatePath("/expenses")
    }
  )

export const updateExpense = actionClient
  .schema(createExpenseSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        projectId,
        currencyId,
        amount: expenseAmount,
        description,
        isOfficial,
        expensesCategoryId,
        date: expenseDate,
        proposalId,
        id,
      },
    }) => {
      noStore()
      if (!id) throw new Error("id is required")
      const amount = toDecimalFixed(expenseAmount)
      const date = format(expenseDate, "yyyy-MM-dd")

      const { amountInUSD, proposalAmount, officialAmount } =
        await calculateAmounts({
          amount: expenseAmount,
          currencyId,
          date: expenseDate,
          isOfficial,
          proposalId,
        })

      await db
        .update(projectsTransactions)
        .set({
          amount: sql`${-amount}`,
          proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
          amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
          officialAmount: officialAmount ? sql`${-officialAmount}` : "0",
          date,
          projectId,
          currencyId,
          description,
          isOfficial,
          expensesCategoryId,
          proposalId,
        })
        .where(eq(projectsTransactions.id, id))

      revalidatePath("/expenses")
    }
  )

export const deleteExpenses = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db
      .delete(projectsTransactions)
      .where(inArray(projectsTransactions.id, ids))
    revalidatePath("/expenses")
  })
