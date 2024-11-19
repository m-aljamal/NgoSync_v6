"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { employees } from "@/db/schemas/employee"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { actionClient } from "../safe-action"
import { toDecimalFixed } from "../utils"
import {
  createEmployeeSchema,
  createJobTitleSchema,
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
