import { Hono } from "hono"

import currencies from "./currencies"
import expensesCategories from "./expense-categories"
import users from "./users"
import projects from "./projects"
const app = new Hono()

const routes = app
  .route("/users", users)
  .route("/expenses-categories", expensesCategories)
  .route("/currencies", currencies)
  .route("/projects", projects)

export default routes
