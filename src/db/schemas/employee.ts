import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { decimal, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { currencies } from "./currency"
import { genders } from "./enums"
import { loans } from "./loan"
import { projects } from "./project"
import { projectsTransactions } from "./transactions"
import { users } from "./user"
import { teachersToCourses } from "./course"

export const employeeStatus = pgEnum("employee_status", ["active", "inactive"])
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
  userId: varchar("user_id", { length: 50 }).references(() => users.id),
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
  userId: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  salaryPayments: many(salaryPayments),
  loans: many(loans),
  teachersToCourses: many(teachersToCourses),
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

export const salaryPayments = pgTable("salary_payments", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  employeeId: varchar("employee_id", { length: 30 })
    .references(() => projects.id)
    .notNull(),
  projectTransactionId: varchar("project_transaction_id", { length: 30 })
    .references(() => projectsTransactions.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
  description: varchar("description", { length: 200 }),
  discount: decimal("discount", { precision: 19, scale: 4 }).notNull(),
  extra: decimal("extra", { precision: 19, scale: 4 }).notNull(),
  netSalary: decimal("netSalary", { precision: 19, scale: 4 }).notNull(),
})

export const salaryPaymentsRelations = relations(salaryPayments, ({ one }) => ({
  employee: one(employees, {
    fields: [salaryPayments.employeeId],
    references: [employees.id],
  }),
  projectTransaction: one(projectsTransactions, {
    fields: [salaryPayments.projectTransactionId],
    references: [projectsTransactions.id],
  }),
}))

export type SalaryPayment = typeof salaryPayments.$inferSelect
