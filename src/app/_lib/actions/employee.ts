"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { expensesCategories, projectsTransactions } from "@/db/schemas"
import { employees, salaryPayments } from "@/db/schemas/employee"
import { format } from "date-fns"
import Decimal from "decimal.js"
import { eq, inArray, sql } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { getExpenseCategory } from "../queries/expenses"
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
        userId: userId || undefined,
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

      for (const paymentData of salaries) {
        const salary = Number(paymentData.salary)
        const discount = Number(paymentData.discount ?? 0)
        const extra = Number(paymentData.extra ?? 0)
        const netSalary = salary + extra - discount

        const { amountInUSD, proposalAmount, officialAmount } =
          await calculateAmounts({
            amount: new Decimal(netSalary),
            currencyId: paymentData.paymentCurrencyId,
            date,
            isOfficial,
            proposalId,
          })
        const expenseDate = format(date, "yyyy-MM-dd")

        await db.transaction(async (ex) => {
          const [projectTransaction] = await ex
            .insert(projectsTransactions)
            .values({
              amount: sql`${netSalary}`,
              amountInUSD: sql`${amountInUSD}`,
              projectId,
              currencyId: paymentData.paymentCurrencyId,
              officialAmount: sql`${officialAmount}`,
              proposalAmount: sql`${proposalAmount}`,
              type: "outcome",
              category: "expense",
              transactionStatus: "approved",
              description: `راتب الموظف ${paymentData.employeeName}`,
              isOfficial,
              expensesCategoryId,
              date: expenseDate,
              proposalId,
            })
            .returning()

          if (!projectTransaction) {
            throw new Error("error in create project transaction")
          }

          await ex.insert(salaryPayments).values({
            employeeId: paymentData.employeeId,
            projectTransactionId: projectTransaction?.id,
            discount: sql`${discount}`,
            extra: sql`${extra}`,
            description: `راتب الموظف ${paymentData.employeeName} - ${paymentData.description}`,
            netSalary: sql`${netSalary}`,
          })
        })
      }
      revalidatePath("/salaries")
    }
  )
