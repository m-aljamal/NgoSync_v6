import { env } from "@/env.js"
import { type Config } from "drizzle-kit"
import * as dotenv from "dotenv";
import { databasePrefix } from "@/lib/constants"
dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: [`${databasePrefix}_*`],
} satisfies Config
