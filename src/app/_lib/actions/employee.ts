"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { expensesCategories, projectsTransactions } from "@/db/schemas"
import { employees } from "@/db/schemas/employee"
import Decimal from "decimal.js"
import { eq, inArray, sql } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { getExpenseCategory } from "../queries/expenses"
import { getExpensesCategories } from "../queries/project-transactions"
import { calculateAmounts } from "../queries/utils"
import { actionClient } from "../safe-action"
import { toDecimalFixed } from "../utils"
import {
  createEmployeeSchema,
  createJobTitleSchema,
  createSalariesSchema,
  deleteArraySchema,
} from "../validations"
import { employeesJobTitles } from "./../../../db/schemas/employee"

export const createEmployee = actionClient
  .schema(createEmployeeSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        name,
        projectId,
        salary,
        currencyId,
        birthDate,
        position,
        jobTitleId,
        status,
        gender,
        email,
        phone,
        description,
        address,
        userId,
      },
    }) => {
      noStore()

      await db.insert(employees).values({
        name,
        projectId,
        salary: toDecimalFixed(salary),
        currencyId,
        birthDate,
        position,
        jobTitleId,
        status,
        gender,
        email,
        phone,
        description,
        address,
        userId,
      })
      revalidatePath("/employees")
    }
  )

export const deleteEmployee = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(employees).where(inArray(employees.id, ids))
    revalidatePath("/employees")
  })

export const updateEmployee = actionClient
  .schema(createEmployeeSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: data }) => {
    noStore()
    if (!data.id) throw new Error("id is required")
    await db
      .update(employees)
      .set({
        ...data,
        salary: toDecimalFixed(data.salary),
      })
      .where(eq(employees.id, data.id))
    revalidatePath("/employees")
  })

export const createEmployeeJobTitle = actionClient
  .schema(createJobTitleSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { name } }) => {
    noStore()
    await db.insert(employeesJobTitles).values({
      name,
    })
    revalidatePath("/employees")
  })

export const createSalaries = actionClient
  .schema(createSalariesSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: { projectId, proposalId, salaries, date, isOfficial },
    }) => {
      noStore()
      let expensesCategoryId: string
      const employeeExpenseCategory = await getExpenseCategory({
        name: "رواتب الموظفين",
        projectId,
      })

      if (!employeeExpenseCategory) {
        const [createNewCategory] = await db
          .insert(expensesCategories)
          .values({
            name: "رواتب الموظفين",
            projectId,
          })
          .returning()

        if (!createNewCategory) {
          throw new Error("Error in create expense category")
        }
        expensesCategoryId = createNewCategory.id
      } else {
        expensesCategoryId = employeeExpenseCategory.id
      }
      console.log(salaries)

      for (const paymentData of salaries) {
        const salary = paymentData.salary
        const discount = paymentData.discount ?? 0
        const extra = paymentData.extra ?? 0
        const net = +salary + +extra - +discount

        const { amountInUSD, proposalAmount, officialAmount } =
          await calculateAmounts({
            amount: new Decimal(net),
            currencyId: paymentData.paymentCurrencyId,
            date,
            isOfficial,
            proposalId,
          })

        await db.transaction(async (ex) => {
          const projectTransaction = await ex
            .insert(projectsTransactions)
            .values({
              amount: sql`${net}`,
              amountInUSD:sql`${amountInUSD}`,
              projectId,
              currencyId: paymentData.paymentCurrencyId,
              officialAmount:sql`${officialAmount}`,
              proposalAmount:sql`${proposalAmount}`,
              type: "outcome",
              category: "expense",
              transactionStatus: "approved",
              description: `راتب الموظف ${paymentData.employeeName}`,
              isOfficial,
              expensesCategoryId,
              date,
              proposalId,
            })
        })
      }

      throw new Error("fdf")
    }
  )
