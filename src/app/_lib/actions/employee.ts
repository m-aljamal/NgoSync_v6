"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { expensesCategories } from "@/db/schemas"
import { employees } from "@/db/schemas/employee"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { getExpenseCategory } from "../queries/expenses"
import { getExpensesCategories } from "../queries/project-transactions"
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
      let employeeExpenseCategoryId: string
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
        employeeExpenseCategoryId = createNewCategory.id
      } else {
        employeeExpenseCategoryId = employeeExpenseCategory.id
      }


      {
        date: 2024-12-31T21:00:00.000Z,
        projectId: 'uhYfLIsvwLUc',
        salaries: [
          {
            employeeId: 'hBBsYLzBmDsR',
            salary: 8000,
            currencyId: 'YUbAJN3aSpVF',
            netSalary: 8000,
            description: '',
            paymentCurrencyId: 'YUbAJN3aSpVF'
          },
          {
            employeeId: '1XilphV8YBOS',
            salary: 200,
            currencyId: 'oOlDXQA2iGpn',
            netSalary: 200,
            description: '',
            paymentCurrencyId: 'oOlDXQA2iGpn'
          }
        ]
      }

        
      
      throw new Error("fdf")
    }
  )
