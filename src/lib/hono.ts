import { env } from "@/env"
import { hc } from "hono/client"

import { type AppType } from "@/app/(dashboard)/api/[[...route]]/route"

export const client = hc<AppType>(env.NEXT_PUBLIC_API_URL)
