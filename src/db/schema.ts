import { sqTable } from "@/db/utils"
import { sql } from "drizzle-orm"
import { integer, text } from "drizzle-orm/sqlite-core"

import { generateId } from "@/lib/id"

export const tasks = sqTable("tasks", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title"),
  status: text("status", {
    length: 30,
    enum: ["todo", "in-progress", "done", "canceled"],
  })
    .notNull()
    .default("todo"),
  label: text("label", {
    length: 30,
    enum: ["bug", "feature", "enhancement", "documentation"],
  })
    .notNull()
    .default("bug"),
  priority: text("priority", {
    length: 30,
    enum: ["low", "medium", "high"],
  })
    .notNull()
    .default("low"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

export const projects = sqTable("projects", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: text("name").notNull().unique(),
  nameTr: text("name_tr"),
  description: text("description"),
  status: text("status", { enum: ["in-progress", "done", "canceled"] })
    .notNull()
    .default("in-progress"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  system: text("system", {
    enum: ["school", "cultural_center", "relief", "office", "health"],
  }).notNull(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export const funds = sqTable("funds", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export const fundTransactions = sqTable("fund_transactions", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
})

export const projectsTransactions = sqTable("projects_transactions", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
  // projectId: text("project_id").notNull(),
  amount: integer("amount").notNull(),
  amountInUSD: integer("amount_in_usd").notNull(),
  officialAmount: integer("official_amount"),
  proposalAmount: integer("proposal_amount"),
  type: text("type", { enum: ["income", "outcome"] }).notNull(),
  description: text("description"),
  isOfficial: integer("is_offical", { mode: "boolean" })
    .notNull()
    .default(false),
  date: text("date")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type ProjectTransaction = typeof projectsTransactions.$inferSelect
export type NewProjectTransaction = typeof projectsTransactions.$inferInsert

export const expensesCategories = sqTable("expenses_categories", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type ExpensesCategory = typeof expensesCategories.$inferSelect
export type NewExpensesCategory = typeof expensesCategories.$inferInsert

export const doners = sqTable("doners", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: text("name").notNull(),
  gender: text("gender", { enum: ["male", "female"] }).notNull(),
  email: text("email"),
  phone: text("phone"),
  type: text("type", { enum: ["individual", "orgnization"] }).notNull(),
  status: text("status", { enum: ["active", "inactive"] }).notNull(),
  description: text("description"),
  address: text("address"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type Doner = typeof doners.$inferSelect
export type NewDoner = typeof doners.$inferInsert

export const donations = sqTable("donations", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
  amount: integer("amount").notNull(),
  paymentType: text("payment_type", {
    enum: ["cash", "debt"],
  }).notNull(),
  isOfficial: integer("is_offical", { mode: "boolean" })
    .notNull()
    .default(false),
  receiptDescription: text("receipt_description"),
  amountInText: text("amount_in_text"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type Donation = typeof donations.$inferSelect
export type NewDonation = typeof donations.$inferInsert
