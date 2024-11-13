import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { boolean, date, decimal, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { employees } from "./employee"
import { proposals, proposalsExpenses } from "./proposal"
import { fundTransactions, projectsTransactions } from "./transactions"

export const currencies = pgTable("currencies", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  locale: varchar("locale").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
  isOfficial: boolean("isOfficial").default(false),
})

export type Currency = typeof currencies.$inferSelect
export type NewCurrency = typeof currencies.$inferInsert

export const currencyRelations = relations(currencies, ({ many }) => ({
  fundTransactions: many(fundTransactions),
  proposals: many(proposals),
  proposalsExpenses: many(proposalsExpenses),
  projectsTransactions: many(projectsTransactions),
  employees: many(employees),
  // currencyExchageRate: many(currencyExchageRate),
}))

export const exchangeRates = pgTable("exchange_rates", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  rate: decimal("rate").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),

    date: date("date")
    .notNull()
    .default(sql`CURRENT_DATE`),

  fromCurrencyId: varchar("from_currency_id")
    .references(() => currencies.id)
    .notNull(),
  toCurrencyId: varchar("to_currency_id")
    .references(() => currencies.id)
    .notNull(),
})

export type ExchangeRate = typeof exchangeRates.$inferSelect
export type NewExchangeRate = typeof exchangeRates.$inferInsert
export type ExchangeRateWithRelations = typeof exchangeRates.$inferSelect & {
  fromCurrencyCode: string
  toCurrencyCode: string
}

export const exchangeRatesRelations = relations(exchangeRates, ({ one }) => ({
  fromCurrency: one(currencies, {
    fields: [exchangeRates.fromCurrencyId],
    references: [currencies.id],
    relationName: "fromCurrency",
  }),
  toCurrency: one(currencies, {
    fields: [exchangeRates.toCurrencyId],
    references: [currencies.id],
    relationName: "toCurrency",
  }),
}))

export const exchnageBetweenFunds = pgTable("exchnage_between_funds", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),

  sender: varchar("sender")
    .notNull()
    .references(() => fundTransactions.id),

  receiver: varchar("receiver")
    .notNull()
    .references(() => fundTransactions.id),
  rate: decimal("rate", { precision: 19, scale: 4 }).notNull(),
})

export const exchnageBetweenFundsRelations = relations(
  exchnageBetweenFunds,
  ({ one }) => ({
    sender: one(fundTransactions, {
      fields: [exchnageBetweenFunds.sender],
      references: [fundTransactions.id],
      relationName: "sender",
    }),
    recipient: one(fundTransactions, {
      fields: [exchnageBetweenFunds.receiver],
      references: [fundTransactions.id],
      relationName: "receiver",
    }),
  })
)

export type ExchangeBetweenFunds = typeof exchnageBetweenFunds.$inferSelect
export type NewExchangeBetweenFunds = typeof exchnageBetweenFunds.$inferInsert
export type ExchangeBetweenFundsWithRelations =
  typeof exchnageBetweenFunds.$inferSelect & {
    description?: string | null
    senderFundId: string
    receiverFundId: string
    date: string
    fromCurrencyId: string
    toCurrencyId: string
    fromAmount: string
    toAmount: string
    fromCurrencyCode: string
    toCurrencyCode: string
    senderName: string
    receiverName: string
  }

export const exchnageBetweenProjects = pgTable("exchnage_between_projects", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),

  sender: varchar("sender")
    .notNull()
    .references(() => projectsTransactions.id),

  receiver: varchar("receiver")
    .notNull()
    .references(() => projectsTransactions.id),
  rate: decimal("amount", { precision: 19, scale: 4 }).notNull(),
})

export const exchnageBetweenProjectsRelations = relations(
  exchnageBetweenProjects,
  ({ one }) => ({
    sender: one(projectsTransactions, {
      fields: [exchnageBetweenProjects.sender],
      references: [projectsTransactions.id],
      relationName: "sender",
    }),
    recipient: one(projectsTransactions, {
      fields: [exchnageBetweenProjects.receiver],
      references: [projectsTransactions.id],
      relationName: "receiver",
    }),
  })
)

export type ExchangeBetweenProjects =
  typeof exchnageBetweenProjects.$inferSelect
export type NewExchangeBetweenProjects =
  typeof exchnageBetweenProjects.$inferInsert
export type ExchangeBetweenProjectsWithRelations =
  typeof exchnageBetweenProjects.$inferSelect & {
    description?: string | null
    senderProjectId: string
    receiverProjectId: string
    date: string
    fromCurrencyId: string
    toCurrencyId: string
    fromAmount: string
    toAmount: string
    fromCurrencyCode: string
    toCurrencyCode: string
    senderName: string
    receiverName: string
  }
