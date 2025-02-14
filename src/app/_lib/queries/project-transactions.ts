import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  expensesCategories,
  funds,
  projects,
  projectsTransactions,
  type ExpensesCategory,
  type ProjectTransaction,
} from "@/db/schemas"
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

export async function getExpenses(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to, amount } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ProjectTransaction | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      amount
        ? filterColumn({
            column: projectsTransactions.amount,
            value: amount.toString(),
          })
        : undefined,

      fromDay && toDay
        ? and(
            gte(projectsTransactions.createdAt, fromDay),
            lte(projectsTransactions.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<ProjectTransaction> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: projectsTransactions.id,
          amount: sql<number>`ABS(${projectsTransactions.amount})`,
          currencyCode: currencies.code,
          date: projectsTransactions.date,
          description: projectsTransactions.description,
        })
        .from(projectsTransactions)
        .limit(per_page)
        .offset(offset)
        .where(
          or(
            where,
            and(
              eq(projectsTransactions.type, "outcome"),
              eq(projectsTransactions.category, "expense")
            )
          )
        )
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
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
    return { data: [], pageCount: 0 }
  }
}

export async function getExpensesCategories(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ExpensesCategory | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: funds.name,
            value: name,
          })
        : undefined,

      fromDay && toDay
        ? and(gte(funds.createdAt, fromDay), lte(funds.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<ExpensesCategory> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: expensesCategories.id,
          name: expensesCategories.name,
          projectName: projects.name,
          createdAt: expensesCategories.createdAt,
          updatedAt: expensesCategories.updatedAt,
          projectId: expensesCategories.projectId,
        })
        .from(expensesCategories)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(projects, eq(projects.id, expensesCategories.projectId))
        .orderBy(
          column && column in expensesCategories
            ? order === "asc"
              ? asc(expensesCategories[column])
              : desc(expensesCategories[column])
            : desc(expensesCategories.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(expensesCategories)
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
    return { data: [], pageCount: 0 }
  }
}

export async function getProjectIncome(
  input: GetSearchSchema,
  projectId: string
) {
  noStore()

  const { page, per_page, sort, operator, from, to, amount } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ProjectTransaction | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      amount
        ? filterColumn({
            column: projectsTransactions.amount,
            value: amount.toString(),
          })
        : undefined,

      fromDay && toDay
        ? and(
            gte(projectsTransactions.date, fromDay),
            lte(projectsTransactions.date, toDay)
          )
        : undefined,
      eq(projectsTransactions.type, "income"),
      eq(projectsTransactions.projectId, projectId),
    ]

    const where: DrizzleWhere<ProjectTransaction> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          date: projectsTransactions.date,
          amount: projectsTransactions.amount,
          currencyCode: currencies.code,
          category: projectsTransactions.category,
          description: projectsTransactions.description,
          transactionStatus: projectsTransactions.transactionStatus,
          id: projectsTransactions.id,
        })
        .from(projectsTransactions)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
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
    return { data: [], pageCount: 0 }
  }
}
