import app from "@/server"
import { handle } from "hono/vercel"

 
export const runtime = 'nodejs'
export const GET = handle(app)
