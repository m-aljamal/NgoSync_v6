import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { integer, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { currencies } from "./currency"
import { donations } from "./donation"
import { projects } from "./project"
import { expensesCategories, projectsTransactions } from "./transactions"

export const proposals = pgTable("proposals", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(),
  projectId: varchar("project_id", { length: 30 }).notNull(),
  amount: integer("amount").notNull(),
  currencyId: varchar("currency_id", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export type Proposal = typeof proposals.$inferSelect

export type NewProposal = typeof proposals.$inferInsert

export const proposalRelations = relations(proposals, ({ one, many }) => ({
  project: one(projects, {
    fields: [proposals.projectId],
    references: [projects.id],
  }),
  currency: one(currencies, {
    fields: [proposals.currencyId],
    references: [currencies.id],
  }),
  donations: many(donations),
  proposalsExpenses: many(proposalsExpenses),
  projectsTransactions: many(projectsTransactions),
}))
export type ProposalWithRelations = Proposal & {
  projectName: string
  currencyCode: string
}

export const proposalsExpenses = pgTable("proposals_expenses", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  proposalId: varchar("proposal_id", { length: 30 }).notNull(),
  amount: integer("amount").notNull(),
  currencyId: varchar("currency_id", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }),
  expensesCategoryId: varchar("expenses_category_id", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export type ProposalExpense = typeof proposalsExpenses.$inferSelect
export type NewProposalExpense = typeof proposalsExpenses.$inferInsert

export const proposalsExpensesRelations = relations(
  proposalsExpenses,
  ({ one }) => ({
    proposal: one(proposals, {
      fields: [proposalsExpenses.proposalId],
      references: [proposals.id],
    }),
    currency: one(currencies, {
      fields: [proposalsExpenses.currencyId],
      references: [currencies.id],
    }),
    expensesCategory: one(expensesCategories, {
      fields: [proposalsExpenses.expensesCategoryId],
      references: [expensesCategories.id],
    }),
  })
)
