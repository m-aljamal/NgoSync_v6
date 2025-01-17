import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import {
  date,
  integer,
  pgEnum,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { employees } from "./employee"
import { projects } from "./project"
import { students } from "./student"

export const courseStatus = pgEnum("course_status", ["active", "inactive"])

export const courses = pgTable("courses", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  description: varchar("description", { length: 200 }),
  projectId: varchar("project_id", { length: 30 })
    .references(() => projects.id)
    .notNull(),
  status: courseStatus("course_status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export type Course = typeof courses.$inferSelect

export const courseRelations = relations(courses, ({ one }) => ({
  project: one(projects, {
    fields: [courses.projectId],
    references: [projects.id],
  }),
}))

export const studentsToCourses = pgTable(
  "students_to_courses",
  {
    studentId: varchar("student_id").notNull(),
    courseId: varchar("course_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.studentId, t.courseId] }),
  })
)

export const studentsToCoursesRelations = relations(
  studentsToCourses,
  ({ one }) => ({
    student: one(students, {
      fields: [studentsToCourses.studentId],
      references: [students.id],
    }),
    course: one(courses, {
      fields: [studentsToCourses.courseId],
      references: [courses.id],
    }),
  })
)

export const teachersToCourses = pgTable(
  "teachers_to_courses",
  {
    teacherId: varchar("teacher_id").notNull(),
    courseId: varchar("course_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.teacherId, t.courseId] }),
  })
)

export const teachersToCoursesRelations = relations(
  teachersToCourses,
  ({ one }) => ({
    teacher: one(employees, {
      fields: [teachersToCourses.teacherId],
      references: [employees.id],
    }),
    course: one(courses, {
      fields: [teachersToCourses.courseId],
      references: [courses.id],
    }),
  })
)

export const lessons = pgTable("lessons", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  title: varchar("title").notNull(),
  courseId: varchar("course_id", { length: 30 })
    .references(() => courses.id)
    .notNull(),

  date: date("date")
    .notNull()
    .default(sql`CURRENT_DATE`),
  description: varchar("description", { length: 300 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  studentsCourseNotes: many(studentsCourseNotes),
}))

export type Lesson = typeof lessons.$inferSelect

export const attendance = pgEnum("attendance_enum", ["present", "absent"])

export const studentsCourseNotes = pgTable("students_notes", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  studentId: varchar("student_id", { length: 30 })
    .references(() => students.id)
    .notNull(),
  note: varchar("note", { length: 250 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),

  courseId: varchar("course_id", { length: 30 })
    .references(() => courses.id)
    .notNull(),
  attendance: attendance("attendance_enum").notNull(),
  pageNumber: integer("page_number"),
  mark: varchar("mark"),
  lessonId: varchar("lesson_id", { length: 30 })
    .references(() => lessons.id)
    .notNull(),
})

export const studentsCourseNotesRelations = relations(
  studentsCourseNotes,
  ({ one }) => ({
    student: one(students, {
      fields: [studentsCourseNotes.studentId],
      references: [students.id],
    }),
    course: one(courses, {
      fields: [studentsCourseNotes.courseId],
      references: [courses.id],
    }),
    lesson: one(lessons, {
      fields: [studentsCourseNotes.lessonId],
      references: [lessons.id],
    }),
  })
)
