import { pgTable } from "@/db/utils"
import { pgEnum, varchar } from "drizzle-orm/pg-core"

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
  status: studentStatus("student_status").notNull(),
  projectId: varchar("project_id", { length: 30 })
    .references(() => projects.id)
    .notNull(),
  gender: genders("genders").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  description: varchar("description", { length: 200 }),
  address: varchar("address", { length: 200 }),
 
})
