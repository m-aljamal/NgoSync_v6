import { sqTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { integer, primaryKey, text } from "drizzle-orm/sqlite-core"
import type { AdapterAccountType } from "next-auth/adapters"

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
  userId: text("user_id").notNull(),
})

export const projectRelations = relations(projects, ({ one, many }) => ({
  // projectsTransactions: many(projectsTransactions),
  // donations: many(donations),
  // representative: one(representatives, {
  //   fields: [projects.representativeId],
  //   references: [representatives.id],
  // }),
  users: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  // proposals: many(proposals),
  // expensesCategories: many(expensesCategories),
  // employees: many(employees),
  // courses: many(courses),
  // students: many(students),
}))

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

export const users = sqTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  password: text("password"),
  role: text("userRole", { enum: ["admin", "project_manager", "viewer"] })
    .notNull()
    .default("viewer"),
})

export const userRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}))

export const accounts = sqTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = sqTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const authenticators = sqTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)
