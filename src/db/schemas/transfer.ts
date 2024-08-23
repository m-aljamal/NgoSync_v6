import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { fundTransactions } from "./transactions"

export const transferBetweenFunds = pgTable("transfer_between_funds", {
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
})

export const transferBetweenFundsRelations = relations(
  transferBetweenFunds,
  ({ one }) => ({
    sender: one(fundTransactions, {
      fields: [transferBetweenFunds.sender],
      references: [fundTransactions.id],
      relationName: "sender",
    }),
    recipient: one(fundTransactions, {
      fields: [transferBetweenFunds.receiver],
      references: [fundTransactions.id],
      relationName: "receiver",
    }),
  })
)

export type TransferBetweenFunds = typeof transferBetweenFunds.$inferSelect
export type NewTransferBetweenFunds = typeof transferBetweenFunds.$inferInsert
export type TransferBetweenFundsWithRelations =
  typeof transferBetweenFunds.$inferSelect & {
    description?: string | null
    senderFundId: string
    receiverFundId: string
    date: string
    amount: number
    currencyId: string
  }
