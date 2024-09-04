import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { donations } from "./donation"
import { proposals } from "./proposal"
import { expensesCategories, projectsTransactions } from "./transactions"
import { users } from "./user"
import { employees } from "./employee"

export const statusEnum = pgEnum("status_enum", [
  "in-progress",
  "done",
  "canceled",
])

export const systemsEnum = pgEnum("systems_enum", [
  "school",
  "cultural_center",
  "relief",
  "office",
  "health",
])

export const projects = pgTable("projects", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  nameTr: varchar("nameTr", { length: 128 }),
  description: varchar("description", { length: 200 }),
  status: statusEnum("status_enum").notNull().default("in-progress"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
  system: systemsEnum("systems_enum").notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
})

export const projectRelations = relations(projects, ({ one, many }) => ({
  projectsTransactions: many(projectsTransactions),
  donations: many(donations),

  users: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  proposals: many(proposals),
  expensesCategories: many(expensesCategories),
  employees: many(employees),
  // courses: many(courses),
  // students: many(students),
}))

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
