import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  date,
  decimal,
  pgEnum,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { currencies, exchnageBetweenProjects } from "./currency"
import { donations } from "./donation"
import { funds } from "./fund"
import { loans } from "./loan"
import { projects } from "./project"
import { proposals, proposalsExpenses } from "./proposal"
import {
  transferBetweenFunds,
  transferBetweenProjects,
  transferFundToProject,
  transferProjectToFund,
} from "./transfer"

export const transactionType = pgEnum("transaction_type", ["income", "outcome"])

export const fundTransactionCategoryEnum = pgEnum("transaction_category_enum", [
  "donation",
  "fund_transaction",
  "transfer_between_funds",
  "transfer_to_project",
  "transfer_from_project",
  "currency_exchange",
])

export const fundTransactions = pgTable("fund_transactions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  date: date("date")
    .notNull()
    .default(sql`CURRENT_DATE`),
  fundId: varchar("fund_id")
    .references(() => funds.id)
    .notNull(),
  currencyId: varchar("currency_id")
    .references(() => currencies.id)
    .notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  amountInUSD: decimal("amount_in_usd", { precision: 19, scale: 4 }).notNull(),
  proposalAmount: decimal("proposal_amount", { precision: 19, scale: 4 }),
  officialAmount: decimal("official_amount", { precision: 19, scale: 4 }),

  type: transactionType("transaction_type").notNull(),
  description: varchar("description", { length: 200 }),
  category: fundTransactionCategoryEnum("transaction_category_enum").notNull(),
  isOfficial: boolean("is_offical").notNull().default(false),
})

export type FundTransaction = typeof fundTransactions.$inferSelect
export type NewFundTransaction = typeof fundTransactions.$inferInsert

export const fundTransactionRelations = relations(
  fundTransactions,
  ({ one, many }) => ({
    fund: one(funds, {
      fields: [fundTransactions.fundId],
      references: [funds.id],
    }),
    currency: one(currencies, {
      fields: [fundTransactions.currencyId],
      references: [currencies.id],
    }),
    donations: many(donations),
    transferFundToProject: many(transferFundToProject),
    transferProjectToFund: many(transferProjectToFund),
    transferBetweenFunds: many(transferBetweenFunds),
    // currencyExchangesBetweenFunds: many(currencyExchangesBetweenFunds),
  })
)
export const transactionStatus = pgEnum("transaction_status", [
  "pending",
  "approved",
  "rejected",
])
export const transactionCategory = pgEnum("transaction_category", [
  "transfer_between_projects",
  "expense",
  "transfer_from_fund",
  "transfer_to_fund",
  "currency_exchange",
  "loan",
])

export const projectsTransactions = pgTable("projects_transactions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  projectId: varchar("project_id")
    .references(() => projects.id)
    .notNull(),
  currencyId: varchar("currency_id")
    .references(() => currencies.id)
    .notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  amountInUSD: decimal("amountInUSD", { precision: 19, scale: 4 }).notNull(),
  officialAmount: decimal("officialAmount", {
    precision: 19,
    scale: 4,
  }),
  proposalAmount: decimal("proposalAmount", {
    precision: 19,
    scale: 4,
  }).notNull(),
  type: transactionType("transaction_type").notNull(),
  category: transactionCategory("transaction_category").notNull(),
  transactionStatus: transactionStatus("transaction_status").notNull(),
  description: varchar("description", { length: 200 }),
  isOfficial: boolean("is_offical").notNull().default(false),
  expensesCategoryId: varchar("expenses_category_id").references(
    () => expensesCategories.id
  ),
  date: timestamp("date", { mode: "string", withTimezone: true })
    .notNull()
    .defaultNow(),
  proposalId: varchar("proposal_id").references(() => proposals.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const projectsTransactionsRelations = relations(
  projectsTransactions,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [projectsTransactions.projectId],
      references: [projects.id],
    }),
    proposal: one(proposals, {
      fields: [projectsTransactions.proposalId],
      references: [proposals.id],
    }),
    currency: one(currencies, {
      fields: [projectsTransactions.currencyId],
      references: [currencies.id],
    }),
    expensesCategory: one(expensesCategories, {
      fields: [projectsTransactions.expensesCategoryId],
      references: [expensesCategories.id],
    }),
    transferFundToProject: many(transferFundToProject),
    transferProjectToFund: many(transferProjectToFund),
    transferbetweenProject: many(transferBetweenProjects),
    exchnageBetweenProjects: many(exchnageBetweenProjects),
    loans: many(loans),
    // salaryPayments: many(salaryPayments),
    // loans: many(loans),
  })
)

export type ProjectTransaction = typeof projectsTransactions.$inferSelect
export type ProjectTransactionWithRelations =
  typeof projectsTransactions.$inferSelect & {
    currencyCode: string
    projectName: string
    expenseCategoryName: string
  }
export type NewProjectTransaction = typeof projectsTransactions.$inferInsert

export const expensesCategories = pgTable("expenses_categories", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name").notNull(),
  projectId: varchar("project_id", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const expensesCategoriesRelations = relations(
  expensesCategories,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [expensesCategories.projectId],
      references: [projects.id],
    }),
    proposalsExpenses: many(proposalsExpenses),
    projectsTransactions: many(projectsTransactions),
  })
)

export type ExpensesCategory = typeof expensesCategories.$inferSelect
export type NewExpensesCategory = typeof expensesCategories.$inferInsert
