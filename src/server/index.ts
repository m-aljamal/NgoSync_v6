import provider from "@/auth.config"
import { AuthConfig, initAuthConfig } from "@hono/auth-js"
import { Context, Hono } from "hono"
import { logger } from "hono/logger"

import donation from "./donation"
import form from "./form"

const app = new Hono().basePath("/api")
// todo add auth
// app.all("*", logger());
// app.use("*", initAuthConfig(getAuthConfig));
// protect all routes
// app.use("/*", verifyAuth());

const routes = app.route("/form", form).route("/donation", donation)

export type AppType = typeof routes
export default app

// function getAuthConfig(c: Context): AuthConfig {
//   return {
//     secret: c.env.AUTH_SECRET,
//     ...provider,
//   };
// }
