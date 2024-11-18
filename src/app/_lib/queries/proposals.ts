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
  proposalsExpenses,
  type Proposal,
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
import { alias } from "drizzle-orm/pg-core"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getProposals(input: GetSearchSchema, projectId?: string) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Proposal | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      projectId ? eq(proposals.projectId, projectId) : undefined,
      name
        ? filterColumn({
            column: proposals.name,
            value: name,
          })
        : undefined,

      fromDay && toDay
        ? and(
            gte(proposals.createdAt, fromDay),
            lte(proposals.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<Proposal> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: proposals.id,
          name: proposals.name,
          createdAt: proposals.createdAt,
          projectId: proposals.projectId,
          projectName: projects.name,
          amount: proposals.amount,
          currencyCode: currencies.code,
          currencyId: proposals.currencyId,
          updatedAt: proposals.updatedAt,
        })
        .from(proposals)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(projects, eq(proposals.projectId, projects.id))
        .innerJoin(currencies, eq(proposals.currencyId, currencies.id))
        .orderBy(
          column && column in proposals
            ? order === "asc"
              ? asc(proposals[column])
              : desc(proposals[column])
            : desc(proposals.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(proposals)
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

export const getProposal = cache(async ({ id }: { id: string }) => {
  try {
    const [proposal] = await db
      .select({
        id: proposals.id,
        name: proposals.name,
        createdAt: proposals.createdAt,
        projectId: proposals.projectId,
        currencyCode: currencies.code,
        currencyId: proposals.currencyId,
        updatedAt: proposals.updatedAt,
      })
      .from(proposals)
      .where(eq(proposals.id, id))
      .innerJoin(currencies, eq(proposals.currencyId, currencies.id))

    return proposal
  } catch (error) {
    return null
  }
})

export const getProposalStatistics = cache(async (proposalId: string) => {
  const proposalCurrency = alias(currencies, "proposalCurrency")

  try {
    return await db
      .select({
        expensesCategory: expensesCategories.name,
        paidAmount: sql<number>`COALESCE(SUM(ABS(${projectsTransactions.proposalAmount})),0)`,
        expenseTotal: sql<number>`${proposalsExpenses.amount}`,
        remainingAmount: sql<number>`${proposalsExpenses.amount} - COALESCE(SUM(ABS(${projectsTransactions.proposalAmount})),0)`,
        proposalCurrency: proposalCurrency.code,
      })
      .from(proposalsExpenses)
      .where(eq(proposalsExpenses.proposalId, proposalId))
      .innerJoin(
        expensesCategories,
        eq(proposalsExpenses.expensesCategoryId, expensesCategories.id)
      )
      .leftJoin(
        projectsTransactions,
        and(
          eq(projectsTransactions.proposalId, proposalId),
          eq(
            proposalsExpenses.expensesCategoryId,
            projectsTransactions.expensesCategoryId
          )
        )
      )
      .innerJoin(
        proposalCurrency,
        eq(proposalsExpenses.currencyId, proposalCurrency.id)
      )
      .groupBy(
        projectsTransactions.expensesCategoryId,
        expensesCategories.name,
        proposalCurrency.code,
        proposalsExpenses.amount
      )
  } catch (error) {
    return []
  }
})
