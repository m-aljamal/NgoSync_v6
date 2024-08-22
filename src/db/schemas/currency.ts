import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { boolean, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

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
  official: boolean("official").default(false),
})

export type Currency = typeof currencies.$inferSelect
export type NewCurrency = typeof currencies.$inferInsert

export const currencyRelations = relations(currencies, ({ many }) => ({
  fundTransactions: many(fundTransactions),
  proposals: many(proposals),
  proposalsExpenses: many(proposalsExpenses),
  projectsTransactions: many(projectsTransactions),
  // employees: many(employees),
  // currencyExchageRate: many(currencyExchageRate),
}))
