import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  expensesCategories,
  projectsTransactions,
} from "@/db/schemas"
import { projects, type Project } from "@/db/schemas/project"
import { type DrizzleWhere } from "@/types"
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

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export const getProjects = cache(async (input: GetSearchSchema) => {
  noStore()
  const { page, per_page, sort, name, status, operator, from, to, system } =
    input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Project | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: projects.name,
            value: name,
          })
        : undefined,

      !!status
        ? filterColumn({
            column: projects.status,
            value: status,
            isSelectable: true,
          })
        : undefined,
      !!system
        ? filterColumn({
            column: projects.system,
            value: system,
            isSelectable: true,
          })
        : undefined,

      fromDay && toDay
        ? and(gte(projects.createdAt, fromDay), lte(projects.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<Project> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(projects)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in projects
            ? order === "asc"
              ? asc(projects[column])
              : desc(projects[column])
            : desc(projects.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(projects)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = calculatePageCount(total, per_page)

    return { data, pageCount }
  } catch (err) {
    console.log({
      err,
    })

    return { data: [], pageCount: 0 }
  }
})

export const getProject = cache(async ({ id }: { id: string }) => {
  noStore()
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))

    return project
  } catch (err) {
    console.log({
      err,
    })

    return null
  }
})

export const getProjectRemainingBudget = cache(async (projectId: string) => {
  if (!projectId) return undefined
  try {
    return await db
      .select({
        amount: sql<number>`SUM(${projectsTransactions.amount})`,
        currency: currencies.code,
      })
      .from(projectsTransactions)
      .where(eq(projectsTransactions.projectId, projectId))
      .innerJoin(currencies, eq(projectsTransactions.currencyId, currencies.id))
      .groupBy(currencies.code)
  } catch (error) {
    throw new Error("Error fetching project remaining budget")
  }
})

interface ProjectExpensesByMonth {
  projectId: string
  currencyCode?: string
  month: string | undefined
}

export const getProjectExpensesByMonth = cache(
  async ({ projectId, currencyCode, month }: ProjectExpensesByMonth) => {
    if (!projectId) return undefined
    try {
      return await db
        .select({
          month: sql<number>`EXTRACT(MONTH FROM ${projectsTransactions.date})::integer`,
          amount: sql<number>`SUM(ABS(${projectsTransactions.amount}))`,
          amountInUSD: sql<number>`SUM(ABS(${projectsTransactions.amountInUSD}))`,
          currency: currencies.code,
          expensesCategory: expensesCategories.name,
        })
        .from(projectsTransactions)
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )
        .leftJoin(
          expensesCategories,
          eq(projectsTransactions.expensesCategoryId, expensesCategories.id)
        )
        .groupBy(
          sql`EXTRACT(MONTH FROM ${projectsTransactions.date})::integer`,
          currencies.code,
          expensesCategories.name
        )
        .where(
          and(
            eq(projectsTransactions.projectId, projectId),
            eq(projectsTransactions.type, "outcome"),
            month
              ? sql`EXTRACT(MONTH FROM ${projectsTransactions.date})::integer = ${parseInt(month, 10)}`
              : undefined,
            currencyCode ? eq(currencies.code, currencyCode) : undefined
          )
        )
    } catch (error) {
      console.log(error)
      throw new Error("Error fetching project expenses by month")
    }
  }
)
