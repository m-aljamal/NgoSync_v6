import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { employees } from "@/db/schemas"
import {
  courses,
  Lesson,
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

import { currentUser } from "../auth"
import { type GetSearchSchema } from "../validations"
import { currentEmployee } from "./user"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getTeacherCourses(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const employee = await currentEmployee()
    if (!employee) {
      return { data: [], pageCount: 0 }
    }
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Course | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      eq(teachersToCourses.teacherId, employee.id),
      // projectId ? eq(courses.projectId, projectId) : undefined,
      // Filter by createdAt
      // fromDay && toDay
      //   ? and(gte(courses.createdAt, fromDay), lte(courses.createdAt, toDay))
      //   : undefined,
    ]

    const where: DrizzleWhere<Course> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          name: courses.name,
          status: courses.status,
          id: courses.id,
          createdAt: courses.createdAt,
          updatedAt: courses.updatedAt,
          description: courses.description,
          projectId: courses.projectId,
          userId: teachersToCourses.teacherId,
        })
        .from(teachersToCourses)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .leftJoin(courses, eq(teachersToCourses.courseId, courses.id))

      const total = await tx
        .select({
          count: count(),
        })
        .from(teachersToCourses)
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

      const total = await tx
        .select({
          count: count(),
        })
        .from(teachersToCourses)
        .where(where)
        .leftJoin(employees, eq(teachersToCourses.teacherId, employees.id))
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

export async function getCourseStudents(
  input: GetSearchSchema,
  courseId: string
) {
  noStore()
  const { page, per_page, operator } = input

  try {
    const offset = calculateOffset(page, per_page)

    const expressions: (SQL<unknown> | undefined)[] = [
      eq(studentsToCourses.courseId, courseId),
    ]

    const where: DrizzleWhere<Course> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          name: students.name,
          id: students.id,
        })
        .from(studentsToCourses)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .leftJoin(students, eq(studentsToCourses.studentId, students.id))

      const total = await tx
        .select({
          count: count(),
        })
        .from(studentsToCourses)
        .where(where)
        .leftJoin(students, eq(studentsToCourses.studentId, students.id))
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

export async function getLessons(input: GetSearchSchema, courseId: string) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Lesson | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      eq(lessons.courseId, courseId),
      fromDay && toDay
        ? and(gte(lessons.createdAt, fromDay), lte(lessons.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<Lesson> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(lessons)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in lessons
            ? order === "asc"
              ? asc(lessons[column])
              : desc(lessons[column])
            : desc(lessons.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(lessons)
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
