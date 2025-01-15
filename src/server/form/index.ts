import { Hono } from "hono"

import currencies from "./currencies"
import doners from "./doners"
import employees from "./employees"
import expensesCategories from "./expense-categories"
import funds from "./funds"
import jobTitles from "./job-titles"
import projects from "./projects"
import proposalsExpenses from "./proposal-expenses"
import proposals from "./proposals"
import users from "./users"
import students from "./students"

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
  .route("/job-titles", jobTitles)
  .route("/employees", employees)
  .route("/students", students)
export default routes
