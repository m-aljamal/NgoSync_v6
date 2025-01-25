import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { date, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { genders } from "./enums"
import { projects } from "./project"

export const studentStatus = pgEnum("student_status", [
  "active",
  "inactive",
  "graduated",
])

export const students = pgTable("students", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  fatherName: varchar("father_name", { length: 120 }).notNull(),
  motherName: varchar("mother_name", { length: 120 }).notNull(),
  projectId: varchar("project_id", { length: 30 })
    .references(() => projects.id)
    .notNull(),
  nID: varchar("nID", { length: 120 }),
  status: studentStatus("student_status").notNull(),

  gender: genders("genders").notNull(),

  phone: varchar("phone", { length: 20 }).notNull(),

  address: varchar("address", { length: 200 }),

  dateOfBirth: date("date")
    .notNull()
    .default(sql`CURRENT_DATE`),

  description: varchar("description", { length: 200 }),

  registrationDate: date("registration_date")
    .default(sql`CURRENT_DATE`)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export const studentsRelations = relations(students, ({ one }) => ({
  project: one(projects, {
    fields: [students.projectId],
    references: [projects.id],
  }),
}))

export type Student = typeof students.$inferSelect
