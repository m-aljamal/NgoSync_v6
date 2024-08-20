import { hc } from "hono/client"

import { type AppType } from "./"
import { env } from "@/env"

const client = hc<AppType>(env.NEXT_PUBLIC_API_URL)
export default client
