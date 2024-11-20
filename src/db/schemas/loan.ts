import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { employees } from "./employee"
import { projectsTransactions } from "./transactions"

export const type = pgEnum("type", ["loan", "repayment"])

export const loans = pgTable("loans", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
  projectTransactionId: varchar("project_transaction_id")
    .references(() => projectsTransactions.id, { onDelete: "cascade" })
    .notNull(),
  employeeId: varchar("employee_id")
    .references(() => employees.id)
    .notNull(),
  type: type("type").notNull(),
})

export const loansRelations = relations(loans, ({ one }) => ({
  projectTransaction: one(projectsTransactions, {
    fields: [loans.projectTransactionId],
    references: [projectsTransactions.id],
  }),
  employee: one(employees, {
    fields: [loans.employeeId],
    references: [employees.id],
  }),
}))

export type Loan = typeof loans.$inferSelect
export type NewLoan = typeof loans.$inferInsert
export type LoanWithRelations = {
  id: string
  employeeId: string
  type: "loan" | "repayment"
  projectTransactionId: string
  amount: number
  date: string
  projectId: string
  description: string | null
  currencyId: string
  currencyCode: string
  projectName: string
  employeeName: string
}
