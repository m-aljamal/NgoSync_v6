import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  expensesCategories,
  projects,
  projectsTransactions,
  type ProjectTransaction,
} from "@/db/schemas"
import { type DrizzleWhere } from "@/types"
import Decimal from "decimal.js"
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, convertToDate } from "./utils"

export async function getExpenses(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, amount, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ProjectTransaction | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      amount
        ? eq(projectsTransactions.amount, new Decimal(amount).toFixed(4))
        : undefined,

      fromDay && toDay
        ? and(
            gte(projectsTransactions.date, fromDay),
            lte(projectsTransactions.date, toDay)
          )
        : undefined,
      eq(projectsTransactions.category, "expense"),
    ]

    const where: DrizzleWhere<ProjectTransaction> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: projectsTransactions.id,
          currencyCode: currencies.code,
          type: projectsTransactions.type,
          description: projectsTransactions.description,
          isOfficial: projectsTransactions.isOfficial,
          date: projectsTransactions.date,
          amount: sql<number>`ABS(${projectsTransactions.amount})`,
          projectName: projects.name,
          expenseCategoryName: expensesCategories.name,
          transactionStatus: projectsTransactions.transactionStatus,
        })
        .from(projectsTransactions)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )
        .innerJoin(projects, eq(projectsTransactions.projectId, projects.id))
        .innerJoin(
          expensesCategories,
          eq(projectsTransactions.expensesCategoryId, expensesCategories.id)
        )
        .orderBy(
          column && column in projectsTransactions
            ? order === "asc"
              ? asc(projectsTransactions[column])
              : desc(projectsTransactions[column])
            : desc(projectsTransactions.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(projectsTransactions)
        .where(where)
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )
        .innerJoin(projects, eq(projectsTransactions.projectId, projects.id))
        .innerJoin(
          expensesCategories,
          eq(projectsTransactions.expensesCategoryId, expensesCategories.id)
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}
