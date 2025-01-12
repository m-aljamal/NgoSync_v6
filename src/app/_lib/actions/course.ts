"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { courses, teachersToCourses } from "@/db/schemas/course"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { actionClient } from "../safe-action"
import {
  createCourseSchema,
  createEmployeesToCourses,
  deleteArraySchema,
} from "../validations"

export const deleteCourses = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(courses).where(inArray(courses.id, ids))
    revalidatePath("/courses")
  })

export const createCourse = actionClient
  .schema(createCourseSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { name, projectId, status, description } }) => {
    noStore()

    await db.insert(courses).values({
      name,
      projectId,
      status,
      description,
    })
    revalidatePath("/courses")
  })

export const updateCourse = actionClient
  .schema(createCourseSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { name, projectId, status, description, id } }) => {
      noStore()
      if (!id) throw new Error("id is required")
      await db
        .update(courses)
        .set({
          name,
          projectId,
          status,
          description,
        })
        .where(eq(courses.id, id))
      revalidatePath("/courses")
    }
  )

export const addEmployeesToCourses = actionClient
  .schema(createEmployeesToCourses, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { courseId, teachers } }) => {
    noStore()

    const valuesToInsert = teachers.map((teacherId) => ({
      teacherId,
      courseId,
    }))

    await db.insert(teachersToCourses).values(valuesToInsert)

    revalidatePath("/courses")
  })



  export const deleteEmployeeToCourse = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(teachersToCourses).where(inArray(teachersToCourses.teacherId, ids))
    revalidatePath("/courses")
  })