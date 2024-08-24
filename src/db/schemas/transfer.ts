import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { fundTransactions, projectsTransactions } from "./transactions"

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

export const transferBetweenProjects = pgTable("transfer_between_projects", {
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
})

export const transferBetweenProjectsRelations = relations(
  transferBetweenProjects,
  ({ one }) => ({
    sender: one(projectsTransactions, {
      fields: [transferBetweenProjects.sender],
      references: [projectsTransactions.id],
      relationName: "sender",
    }),
    recipient: one(projectsTransactions, {
      fields: [transferBetweenProjects.receiver],
      references: [projectsTransactions.id],
      relationName: "receiver",
    }),
  })
)

export type TransferBetweenProjects =
  typeof transferBetweenProjects.$inferSelect
export type NewTransferBetweenProjects =
  typeof transferBetweenProjects.$inferInsert
export type TransferBetweenProjectsWithRelations =
  typeof transferBetweenProjects.$inferSelect & {
    description?: string | null
    senderProjectId: string
    receiverProjectId: string
    date: string
    amount: number
    currencyId: string
  }

export const transferFundToProject = pgTable("transfer_fund_to_project", {
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
    .references(() => projectsTransactions.id),
})

export const transferFundToProjectRelations = relations(
  transferFundToProject,
  ({ one }) => ({
    sender: one(fundTransactions, {
      fields: [transferFundToProject.sender],
      references: [fundTransactions.id],
      relationName: "sender",
    }),
    recipient: one(projectsTransactions, {
      fields: [transferFundToProject.receiver],
      references: [projectsTransactions.id],
      relationName: "receiver",
    }),
  })
)

export type TransferFundToProject = typeof transferFundToProject.$inferSelect
export type NewTransferFundToProject = typeof transferFundToProject.$inferInsert
export type TransferFundToProjectWithRelations =
  typeof transferFundToProject.$inferSelect & {
    description?: string | null
    senderFundId: string
    receiverProjectId: string
    date: string
    amount: number
    currencyId: string
    isOfficial?: boolean
  }


export const transferProjectToFund = pgTable("transfer_project_to_fund", {
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
    .references(() => fundTransactions.id),
})

export const transferProjectToFundRelations = relations(
  transferProjectToFund,
  ({ one }) => ({
    sender: one(projectsTransactions, {
      fields: [transferProjectToFund.sender],
      references: [projectsTransactions.id],
      relationName: "sender",
    }),
    recipient: one(fundTransactions, {
      fields: [transferProjectToFund.receiver],
      references: [fundTransactions.id],
      relationName: "receiver",
    }),
  })
)

export type TransferProjectToFund = typeof transferProjectToFund.$inferSelect
export type NewTransferProjectToFund = typeof transferProjectToFund.$inferInsert
export type TransferProjectToFundWithRelations =
  typeof transferProjectToFund.$inferSelect & {
    description?: string | null
    senderProjectId: string
    receiverFundId: string
    date: string
    amount: number
    currencyId: string
    isOfficial?: boolean
  }
