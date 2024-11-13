import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  expensesCategories,
  projects,
  projectsTransactions,
  proposals,
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
import { alias } from "drizzle-orm/pg-core"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, convertToDate } from "./utils"

type GetExpensesProps = {
  input: GetSearchSchema
  proposalId?: string
  projectId?: string
}

export async function getExpenses({
  input,
  proposalId,
  projectId,
}: GetExpensesProps) {
  noStore()
  const { page, per_page, sort, amount, operator, from, to, currencyCode } =
    input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ProjectTransaction | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      proposalId ? eq(projectsTransactions.proposalId, proposalId) : undefined,
      projectId ? eq(projectsTransactions.projectId, projectId) : undefined,
      amount
        ? or(
            eq(projectsTransactions.amount, new Decimal(amount).toFixed(4)),
            eq(
              sql`CASE WHEN ${projectsTransactions.amount} < 0 THEN ${projectsTransactions.amount} * -1 ELSE ${projectsTransactions.amount} END`,
              new Decimal(amount).toFixed(4)
            )
          )
        : undefined,

      !!currencyCode
        ? filterColumn({
            column: currencies.code,
            value: currencyCode,
            isSelectable: true,
          })
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
          currencyId: projectsTransactions.currencyId,
          type: projectsTransactions.type,
          projectId: projectsTransactions.projectId,
          proposalId: projectsTransactions.proposalId,
          expensesCategoryId: projectsTransactions.expensesCategoryId,
          description: projectsTransactions.description,
          isOfficial: projectsTransactions.isOfficial,
          date: projectsTransactions.date,
          amount: sql<string>`ABS(${projectsTransactions.amount})`,
          projectName: projects.name,
          expenseCategoryName: expensesCategories.name,
          transactionStatus: projectsTransactions.transactionStatus,
          createdAt: projectsTransactions.createdAt,
          updatedAt: projectsTransactions.updatedAt,
          amountInUSD: projectsTransactions.amountInUSD,
          officialAmount: projectsTransactions.officialAmount,
          proposalAmount: projectsTransactions.proposalAmount,
          category: projectsTransactions.category,
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

export const getExpense = cache(async (id: string) => {
  const officialCurrency = alias(currencies, "officialCurrency")
  const proposalCurrency = alias(currencies, "proposalCurrency")
  try {
    const [expense] = await db
      .select({
        id: projectsTransactions.id,
        date: projectsTransactions.date,
        amount: sql`ABS(${projectsTransactions.amount})`,
        currency: currencies.code,
        amountInUSD: sql`ABS(${projectsTransactions.amountInUSD})`,
        officialAmount: sql`ABS(${projectsTransactions.officialAmount})`,
        officialAmountCurrency: officialCurrency.code,
        proposalAmount: sql`ABS(${projectsTransactions.proposalAmount})`,
        proposalCurrency: proposalCurrency.code,
        isOfficial: projectsTransactions.isOfficial,
        project: projects.name,
        proposal: proposals.name,
        currencyName: currencies.name,
        description: projectsTransactions.description,
        transactionStatus: projectsTransactions.transactionStatus,
        expensesCategory: expensesCategories.name,
      })
      .from(projectsTransactions)
      .where(eq(projectsTransactions.id, id))
      .innerJoin(currencies, eq(projectsTransactions.currencyId, currencies.id))
      .innerJoin(projects, eq(projectsTransactions.projectId, projects.id))
      .leftJoin(proposals, eq(projectsTransactions.proposalId, proposals.id))
      .leftJoin(officialCurrency, eq(officialCurrency.isOfficial, true))
      .leftJoin(proposalCurrency, eq(proposalCurrency.id, proposals.currencyId))
      .innerJoin(
        expensesCategories,
        eq(projectsTransactions.expensesCategoryId, expensesCategories.id)
      )

    return expense
  } catch (error) {
    console.log(error)

    throw new Error("Error in getting expense")
  }
})
