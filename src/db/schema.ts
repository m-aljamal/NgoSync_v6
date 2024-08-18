import { pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  integer,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

import { generateId } from "@/lib/id"

export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  code: varchar("code", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 128 }),
  status: varchar("status", {
    length: 30,
    enum: ["todo", "in-progress", "done", "canceled"],
  })
    .notNull()
    .default("todo"),
  label: varchar("label", {
    length: 30,
    enum: ["bug", "feature", "enhancement", "documentation"],
  })
    .notNull()
    .default("bug"),
  priority: varchar("priority", {
    length: 30,
    enum: ["low", "medium", "high"],
  })
    .notNull()
    .default("low"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

export const statusEnum = pgEnum("status_enum", [
  "in-progress",
  "done",
  "canceled",
])

export const systemsEnum = pgEnum("systems_enum", [
  "school",
  "cultural_center",
  "relief",
  "office",
  "health",
])

export const projects = pgTable("projects", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 128 }).unique(),
  nameTr: varchar("nameTr", { length: 128 }),
  description: varchar("description", { length: 200 }),
  status: statusEnum("status_enum").notNull().default("in-progress"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
  system: systemsEnum("systems_enum").notNull(),
  userId: varchar("user_id").notNull(),
})

export const projectRelations = relations(projects, ({ one, many }) => ({
  projectsTransactions: many(projectsTransactions),
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

export const funds = pgTable("funds", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: varchar("name", { length: 128 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export type Fund = typeof funds.$inferSelect
export type NewFund = typeof funds.$inferInsert

export const fundTransactions = pgTable("fund_transactions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export type FundTransaction = typeof fundTransactions.$inferSelect
export type NewFundTransaction = typeof fundTransactions.$inferInsert

export const transactionType = pgEnum("transaction_type", ["income", "outcome"])
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
    // proposal: one(proposals, {
    //   fields: [projectsTransactions.proposalId],
    //   references: [proposals.id],
    // }),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export type ExpensesCategory = typeof expensesCategories.$inferSelect
export type NewExpensesCategory = typeof expensesCategories.$inferInsert

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
  donerId: varchar("doner_id").notNull(),
  amount: integer("amount").notNull(),
  paymentType: donationPaymentTypes("donation_payment_types").notNull(),
  isOfficial: boolean("is_offical").notNull().default(false),
  receiptDescription: varchar("receipt_description", { length: 300 }),
  amountInText: varchar("amount_in_text", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
})

export const donationRelations = relations(donations, ({ one }) => ({
  doner: one(doners, {
    fields: [donations.donerId],
    references: [doners.id],
  }),
  // fundTransaction: one(fundTransactions, {
  //   fields: [donations.fundTransactionId],
  //   references: [fundTransactions.id],
  // }),
  // project: one(projects, {
  //   fields: [donations.projectId],
  //   references: [projects.id],
  // }),
  // proposal: one(proposals, {
  //   fields: [donations.proposalId],
  //   references: [proposals.id],
  // }),
}))

export type Donation = typeof donations.$inferSelect
export type NewDonation = typeof donations.$inferInsert

export const roleEnum = pgEnum("role_enum", [
  "admin",
  "project_manager",
  "viewer",
])

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().default(""),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: roleEnum("role_enum").notNull().default("viewer"),
})

export const userRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}))

export const accounts = pgTable(
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

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const authenticators = pgTable(
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
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)
