import { pgEnum } from "drizzle-orm/pg-core"

export const genders = pgEnum("genders", ["male", "female"])
