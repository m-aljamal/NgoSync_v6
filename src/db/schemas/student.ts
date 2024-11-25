import { pgTable } from "@/db/utils"
import { generateId } from "@/lib/id"
import { varchar } from "drizzle-orm/pg-core"

export const students = pgTable("students", {
    id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
    
})