"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { students } from "@/db/schemas/student"
import { inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { actionClient } from "../safe-action"
import { createStudentSchema, deleteArraySchema } from "../validations"

export const deleteStudents = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(students).where(inArray(students.id, ids))
    revalidatePath("/students")
  })

export const createStudent = actionClient
  .schema(createStudentSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        name,
        projectId,
        status,
        gender,
        phone,
        description,
        address,
        dateOfBirth,
        fatherName,
        motherName,
        registrationDate,
      },
    }) => {
      noStore()
      await db.insert(students).values({
        name:"name",
        gender:"female",
        projectId:"projectId",
        dateOfBirth,
        status:"active",
        fatherName,
        phone:"phone",
        description:"description",
        address,
        motherName,
        registrationDate,
      })
      revalidatePath("/students")
    }
  )

export const updateStudent = actionClient
  .schema(createStudentSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: data }) => {
    noStore()
    if (!data.id) throw new Error()
  })
