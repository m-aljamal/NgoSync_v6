import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  integer,
  pgEnum,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { currencies } from "./currency"
import { donations } from "./donation"
import { funds } from "./fund"
import { projects } from "./project"
import { proposals, proposalsExpenses } from "./proposal"

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
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
  fundId: varchar("fund_id")
    .references(() => funds.id)
    .notNull(),
  currencyId: varchar("currency_id")
    .references(() => currencies.id)
    .notNull(),
  amount: integer("amount").notNull(),
  amountInUSD: integer("amount_in_usd").notNull(),
  proposalAmount: integer("proposal_amount"),
  officialAmount: integer("official_amount"),
  date: timestamp("date", { mode: "string", withTimezone: true })
    .notNull()
    .defaultNow(),
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
    // transfersFromFundToProject: many(transfersFromFundToProject),
    // transfersFromProjectToFund: many(transfersFromProjectToFund),
    // transfersFromFundToFund: many(transfersFromFundToFund),
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
  projectId: varchar("project_id").notNull(),
  currencyId: varchar("currency_id").notNull(),
  amount: integer("amount").notNull(),
  amountInUSD: integer("amount_in_usd").notNull(),
  officialAmount: integer("official_amount"),
  proposalAmount: integer("proposal_amount"),
  type: transactionType("transaction_type").notNull(),
  category: transactionCategory("transaction_category").notNull(),
  transactionStatus: transactionStatus("transaction_status").notNull(),
  description: varchar("description", { length: 200 }),
  isOfficial: boolean("is_offical").notNull().default(false),
  expensesCategoryId: varchar("expenses_category_id"),
  date: timestamp("date").defaultNow().notNull(),
  proposalId: varchar("proposal_id"),
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
    // currency: one(currencies, {
    //   fields: [projectsTransactions.currencyId],
    //   references: [currencies.id],
    // }),
    expensesCategory: one(expensesCategories, {
      fields: [projectsTransactions.expensesCategoryId],
      references: [expensesCategories.id],
    }),
    // transfersFromFundToProject: many(transfersFromFundToProject),
    // transfersFromProjectToFund: many(transfersFromProjectToFund),
    // transferFromProjectToProject: many(transfersFromProjectToProject),
    // currencyExchangesBetweenProjects: many(currencyExchangesBetweenProjects),
    // salaryPayments: many(salaryPayments),
    // loans: many(loans),
  })
)

export type ProjectTransaction = typeof projectsTransactions.$inferSelect
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
  })
)

export type ExpensesCategory = typeof expensesCategories.$inferSelect
export type NewExpensesCategory = typeof expensesCategories.$inferInsert
