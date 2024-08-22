import { Hono } from "hono"

import currencies from "./currencies"
import doners from "./doners"
import expensesCategories from "./expense-categories"
import funds from "./funds"
import projects from "./projects"
import proposalsExpenses from "./proposal-expenses"
import proposals from "./proposals"
import users from "./users"

const app = new Hono()

const routes = app
  .route("/users", users)
  .route("/expenses-categories", expensesCategories)
  .route("/currencies", currencies)
  .route("/projects", projects)
  .route("/proposals-expenses", proposalsExpenses)
  .route("/funds", funds)
  .route("/doners", doners)
  .route("/proposals", proposals)
export default routes
