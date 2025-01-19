"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import {
  courses,
  lessons,
  studentsCourseNotes,
  studentsToCourses,
  teachersToCourses,
} from "@/db/schemas/course"
import { format } from "date-fns"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { actionClient } from "../safe-action"
import {
  createCourseSchema,
  createEmployeesToCourses,
  createLessonSchema,
  createStudentsToCourses,
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
    await db
      .delete(teachersToCourses)
      .where(inArray(teachersToCourses.teacherId, ids))
    revalidatePath("/courses")
  })

export const addStudentsToCourses = actionClient
  .schema(createStudentsToCourses, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { courseId, students } }) => {
    noStore()

    const valuesToInsert = students.map((studentId) => ({
      studentId,
      courseId,
    }))

    await db.insert(studentsToCourses).values(valuesToInsert)

    revalidatePath("/courses")
  })

export const deleteStudentsToCourse = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db
      .delete(studentsToCourses)
      .where(inArray(studentsToCourses.studentId, ids))
    revalidatePath("/courses")
  })

export const createLesson = actionClient
  .schema(createLessonSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: { title, courseId, date: lessonDate, description, students },
    }) => {
      noStore()

      const date = format(lessonDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        const [lesson] = await tx
          .insert(lessons)
          .values({
            title,
            courseId,
            date,
            description,
          })
          .returning()
        if (!lesson?.id) return
        const studentsNotes = students.map(
          ({ studentId, note, attendance, pageNumber, mark }) => ({
            studentId,
            note,
            courseId,
            attendance,
            pageNumber: Number(pageNumber),
            mark,
            lessonId: lesson?.id,
          })
        )
        await tx.insert(studentsCourseNotes).values(studentsNotes)
      })
      revalidatePath("/courses")
    }
  )

export const deleteLessons = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(lessons).where(inArray(lessons.id, ids))
    revalidatePath("/courses")
  })
