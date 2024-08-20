import app from "@/server"
import { handle } from "hono/vercel"

// todo fix runtime see https://github.com/mo-hassann/social-app/blob/main/app/api/%5B%5B...route%5D%5D/route.ts
// export const runtime = "edge";
export const GET = handle(app)
