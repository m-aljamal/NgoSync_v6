import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const ngosyncTasks = sqliteTable("ngosync_tasks", {
	id: text("id").primaryKey().notNull(),
	code: text("code", { length: 128 }).notNull(),
	title: text("title", { length: 128 }),
	status: text("status", { length: 30 }).default("todo").notNull(),
	label: text("label", { length: 30 }).default("bug").notNull(),
	priority: text("priority", { length: 30 }).default("low").notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
(table) => {
	return {
		codeUnique: uniqueIndex("ngosync_tasks_code_unique").on(table.code),
	}
});