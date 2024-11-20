import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { decimal, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { currencies } from "./currency"
import { genders } from "./enums"
import { loans } from "./loan"
import { projects } from "./project"

export const employeeStatus = pgEnum("doner_status", ["active", "inactive"])
export const positions = pgEnum("positions", [
  "manager",
  "teacher",
  "volunteer",
])
export const employees = pgTable("employees", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  status: employeeStatus("employee_status").notNull(),
  projectId: varchar("project_id", { length: 30 })
    .references(() => projects.id)
    .notNull(),
  gender: genders("genders").notNull(),
  email: varchar("email", { length: 120 }).unique(),
  phone: varchar("phone", { length: 20 }),
  description: varchar("description", { length: 200 }),
  salary: decimal("salary", { precision: 19, scale: 4 }).notNull(),
  currencyId: varchar("currency_id").references(() => currencies.id),
  address: varchar("address", { length: 200 }),
  birthDate: timestamp("birth_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
  position: positions("positions").notNull(),
  jobTitleId: varchar("job_title_id", { length: 30 })
    .references(() => employeesJobTitles.id)
    .notNull(),
})

export const employeesRelations = relations(employees, ({ one, many }) => ({
  project: one(projects, {
    fields: [employees.projectId],
    references: [projects.id],
  }),
  currency: one(currencies, {
    fields: [employees.currencyId],
    references: [currencies.id],
  }),

  jobTitle: one(employeesJobTitles, {
    fields: [employees.jobTitleId],
    references: [employeesJobTitles.id],
  }),
  //   salaryPayments: many(salaryPayments),
  loans: many(loans),
  //   teachersToCourses: many(teachersToCourses),
}))

export type Employee = typeof employees.$inferSelect
export type NewEmployee = typeof employees.$inferInsert
export type EmployeeWithRelations = Employee & {
  projectName: string
  currencyCode: string
}
export const employeesJobTitles = pgTable("employees_job_titles", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 120 }).unique().notNull(),
})

export const employeesJobTitlesRelations = relations(
  employeesJobTitles,
  ({ many }) => ({
    employees: many(employees),
  })
)

export type EmployeesJobTitles = typeof employeesJobTitles.$inferSelect
export type NewEmployeesJobTitles = typeof employeesJobTitles.$inferInsert
