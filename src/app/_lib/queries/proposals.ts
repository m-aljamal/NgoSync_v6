import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  donations,
  expensesCategories,
  fundTransactions,
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
  noStore()
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

export const getProposalRemainingStatistics = cache(
  async (proposalId: string) => {
    noStore()
    try {
      // Calculate total donations
      const totalDonationsResult = await db
        .select({
          totalDonations: sql<number>`COALESCE(SUM(${fundTransactions.proposalAmount}), 0)`,
        })
        .from(donations)
        .leftJoin(
          fundTransactions,
          eq(fundTransactions.id, donations.fundTransactionId)
        )
        .where(eq(donations.proposalId, proposalId))

      const totalDonations = totalDonationsResult[0]?.totalDonations || 0

      // Calculate total expenses
      const totalExpensesResult = await db
        .select({
          totalExpenses: sql<number>`COALESCE(SUM(ABS(${projectsTransactions.proposalAmount})), 0)`,
        })
        .from(projectsTransactions)
        .where(eq(projectsTransactions.proposalId, proposalId))

      const totalExpenses = totalExpensesResult[0]?.totalExpenses || 0

      // Fetch the proposal and currency details
      const proposalResult = await db
        .select({
          proposalAmount: sql<number>`${proposals.amount}`,
          proposalCurrency: currencies.code,
        })
        .from(proposals)
        .innerJoin(currencies, eq(proposals.currencyId, currencies.id))
        .where(eq(proposals.id, proposalId))

      const proposalData = proposalResult[0]

      // Ensure proposalAmount is treated as a number
      const proposalAmount = parseFloat(
        proposalData?.proposalAmount as unknown as string
      )

      // Calculate remaining amounts
      const remainingDonationAmount =
        totalDonations === 0 ? 0 : totalDonations - totalExpenses
      const remainingProposalAmount = proposalAmount - totalExpenses

      return {
        proposalAmount,
        proposalCurrency: proposalData?.proposalCurrency,
        totalDonations,
        totalExpenses,
        remainingDonationAmount,
        remainingProposalAmount,
      }
    } catch (error) {
      return {
        proposalAmount: 0,
        proposalCurrency: "",
        totalDonations: 0,
        totalExpenses: 0,
        remainingDonationAmount: 0,
        remainingProposalAmount: 0,
      }
    }
  }
)

export const getProposalExpenses = cache(async (proposalId: string) => {
  if (!proposalId) return undefined
  noStore()
  try {
    return await db
      .select({
        id: proposalsExpenses.id,
        amount: sql<number>`${proposalsExpenses.amount}`,
        currency: currencies.code,
        expensesCategory: expensesCategories.name,
      })
      .from(proposalsExpenses)
      .where(eq(proposalsExpenses.proposalId, proposalId))
      .innerJoin(currencies, eq(proposalsExpenses.currencyId, currencies.id))
      .innerJoin(
        expensesCategories,
        eq(proposalsExpenses.expensesCategoryId, expensesCategories.id)
      )
  } catch (error) {
    return []
  }
})
