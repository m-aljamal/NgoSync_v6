import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { employees } from "@/db/schemas"
import {
  courses,
  lessons,
  studentsCourseNotes,
  studentsToCourses,
  teachersToCourses,
  type Course,
} from "@/db/schemas/course"
import { students } from "@/db/schemas/student"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, eq, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getCourses(input: GetSearchSchema, projectId?: string) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Course | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      projectId ? eq(courses.projectId, projectId) : undefined,
      name
        ? filterColumn({
            column: courses.name,
            value: name,
          })
        : undefined,

      // Filter by createdAt
      fromDay && toDay
        ? and(gte(courses.createdAt, fromDay), lte(courses.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<Course> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(courses)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in courses
            ? order === "asc"
              ? asc(courses[column])
              : desc(courses[column])
            : desc(courses.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(courses)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = calculatePageCount(total, per_page)

    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export const getCourse = cache(async ({ courseId }: { courseId: string }) => {
  try {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))

    return course
  } catch (error) {
    return null
  }
})

export type TeachersList = {
  name: string | null
  id: string | null
}

export async function getTeachers(input: GetSearchSchema, courseId: string) {
  noStore()
  const { page, per_page, operator } = input

  try {
    const offset = calculateOffset(page, per_page)

    const expressions: (SQL<unknown> | undefined)[] = [
      eq(teachersToCourses.courseId, courseId),
    ]

    const where: DrizzleWhere<Course> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          name: employees.name,
          id: employees.id,
        })
        .from(teachersToCourses)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .leftJoin(employees, eq(teachersToCourses.teacherId, employees.id))
        console.log({data});
        
      const total = await tx
        .select({
          count: count(),
        })
        .from(courses)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = calculatePageCount(total, per_page)

    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export type StudentsList = {
  name: string | null
  id: string | null
}

export const getCourseStudents = cache(
  async ({ courseId }: { courseId: string }) => {
    try {
      const studentsList = await db
        .select({
          name: students.name,
          id: students.id,
        })
        .from(studentsToCourses)
        .where(eq(studentsToCourses.courseId, courseId))
        .leftJoin(students, eq(studentsToCourses.studentId, students.id))

      return studentsList
    } catch (error) {
      return []
    }
  }
)

export const getLessons = cache(async ({ courseId }: { courseId: string }) => {
  try {
    const lessonsList = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))

    return lessonsList
  } catch (error) {
    return []
  }
})

export const getLesson = cache(async ({ id }: { id?: string }) => {
  if (!id) {
    return undefined
  }
  try {
    const [data] = await db.select().from(lessons).where(eq(lessons.id, id))

    return data
  } catch (error) {
    return null
  }
})

export async function getLessonStudentsNote(
  input: GetSearchSchema,
  lessonId: string
) {
  noStore()
  const { page, per_page, operator } = input

  try {
    const offset = calculateOffset(page, per_page)

    const expressions: (SQL<unknown> | undefined)[] = [
      eq(studentsCourseNotes.lessonId, lessonId),
    ]

    const where: DrizzleWhere<Course> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          student: students.name,
          note: studentsCourseNotes.note,
          attendance: studentsCourseNotes.attendance,
          pageNumber: studentsCourseNotes.pageNumber,
          mark: studentsCourseNotes.mark,
        })
        .from(studentsCourseNotes)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .rightJoin(students, eq(studentsCourseNotes.studentId, students.id))

      const total = await tx
        .select({
          count: count(),
        })
        .from(studentsCourseNotes)
        .where(where)
        .rightJoin(students, eq(studentsCourseNotes.studentId, students.id))
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = calculatePageCount(total, per_page)

    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}
