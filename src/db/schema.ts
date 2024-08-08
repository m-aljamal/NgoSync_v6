import { sqTable } from "@/db/utils"
import { sql } from "drizzle-orm"
import { text } from "drizzle-orm/sqlite-core"

import { generateId } from "@/lib/id"

export const tasks = sqTable("tasks", {
  id: text("id")
    .$defaultFn(() => generateId())
    .primaryKey(),
  code: text("code", { length: 128 }).notNull().unique(),
  title: text("title", { length: 128 }),
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
  name: text("name", { length: 128 }).notNull().unique(),
  nameTr: text("name_tr", { length: 128 }),
  description: text("description", { length: 128 }),
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
