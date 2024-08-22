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

import { projects } from "./project"
import { proposals } from "./proposal"
import { fundTransactions } from "./transactions"

export const genders = pgEnum("genders", ["male", "female"])
export const donerTypes = pgEnum("doner_types", ["individual", "orgnization"])
export const donerStatus = pgEnum("doner_status", ["active", "inactive"])

export const doners = pgTable("doners", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  gender: genders("genders").notNull(),
  email: varchar("email", { length: 120 }).unique(),
  phone: varchar("phone", { length: 20 }),
  type: donerTypes("doner_types").notNull(),
  status: donerStatus("doner_status").notNull(),
  description: varchar("description", { length: 200 }),
  address: varchar("address", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const donerRelations = relations(doners, ({ many }) => ({
  donations: many(donations),
}))

export type Doner = typeof doners.$inferSelect
export type NewDoner = typeof doners.$inferInsert

export const donationPaymentTypes = pgEnum("donation_payment_types", [
  "cash",
  "debt",
])
export const donations = pgTable("donations", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  amount: integer("amount").notNull(),
  paymentType: donationPaymentTypes("donation_payment_types").notNull(),
  isOfficial: boolean("is_offical").notNull().default(false),
  receiptDescription: varchar("receipt_description", { length: 300 }),
  amountInText: varchar("amount_in_text", { length: 200 }),
  donerId: varchar("doner_id")
    .references(() => doners.id)
    .notNull(),
  projectId: varchar("project_id", { length: 30 }).references(
    () => projects.id
  ),
  proposalId: varchar("proposal_id", { length: 30 }).references(
    () => proposals.id
  ),
  fundTransactionId: varchar("fund_transaction_id", { length: 30 }).references(
    () => fundTransactions.id
  ),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),

  date: timestamp("created_at", { mode: "string", withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const donationRelations = relations(donations, ({ one }) => ({
  doner: one(doners, {
    fields: [donations.donerId],
    references: [doners.id],
  }),
  fundTransaction: one(fundTransactions, {
    fields: [donations.fundTransactionId],
    references: [fundTransactions.id],
  }),
  project: one(projects, {
    fields: [donations.projectId],
    references: [projects.id],
  }),
  proposal: one(proposals, {
    fields: [donations.proposalId],
    references: [proposals.id],
  }),
}))

export type Donation = typeof donations.$inferSelect
export type NewDonation = typeof donations.$inferInsert
