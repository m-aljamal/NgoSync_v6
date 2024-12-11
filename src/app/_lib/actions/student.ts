"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { students } from "@/db/schemas/student"
import { format } from "date-fns"
import { eq, inArray } from "drizzle-orm"
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
        name,
        projectId,
        gender,
        dateOfBirth: format(dateOfBirth, "yyyy-MM-dd"),
        status,
        fatherName,
        phone,
        description,
        address,
        motherName,
        registrationDate: format(registrationDate, "yyyy-MM-dd"),
      })
      revalidatePath("/students")
    }
  )

export const updateStudent = actionClient
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
        id,
      },
    }) => {
      noStore()
      if (!id) throw new Error("id is required")
      await db
        .update(students)
        .set({
          name,
          projectId,
          gender,
          dateOfBirth: format(dateOfBirth, "yyyy-MM-dd"),
          status,
          fatherName,
          phone,
          description,
          address,
          motherName,
          registrationDate: format(registrationDate, "yyyy-MM-dd"),
        })
        .where(eq(students.id, id))
      revalidatePath("/students")
    }
  )
