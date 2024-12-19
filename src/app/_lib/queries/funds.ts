import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  fundTransactions,
  type FundTransaction,
} from "@/db/schemas"
import { funds, type Fund } from "@/db/schemas/fund"
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

export async function getFunds(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Fund | undefined, "asc" | "desc" | undefined]

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

    const where: DrizzleWhere<Fund> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(funds)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in funds
            ? order === "asc"
              ? asc(funds[column])
              : desc(funds[column])
            : desc(funds.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(funds)
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

export const getFund = cache(async ({ id }: { id: string }) => {
  if (!id) return null

  try {
    const data = await db.query.funds.findFirst({
      where: eq(funds.id, id),
    })
    return data
  } catch (error) {
    throw new Error("Failed to get fund")
  }
})

interface TransactionSchema {
  searchInput: GetSearchSchema
  id: string
  type: typeof fundTransactions.$inferSelect.type
}

export const getFundPageTransactions = cache(
  async (input: TransactionSchema) => {
    noStore()
    const { page, per_page, sort, operator, from, to } = input.searchInput
    try {
      const offset = calculateOffset(page, per_page)

      const [column, order] = (sort?.split(".").filter(Boolean) ?? [
        "createdAt",
        "desc",
      ]) as [keyof FundTransaction | undefined, "asc" | "desc" | undefined]

      const { fromDay, toDay } = convertToDate(from, to)

      const expressions: (SQL<unknown> | undefined)[] = [
        eq(fundTransactions.fundId, input.id),
        eq(fundTransactions.type, input.type),
        fromDay && toDay
          ? and(
              gte(fundTransactions.date, fromDay),
              lte(fundTransactions.date, toDay)
            )
          : undefined,
      ]

      const where: DrizzleWhere<FundTransaction> =
        !operator || operator === "and"
          ? and(...expressions)
          : or(...expressions)

      const { data, total } = await db.transaction(async (tx) => {
        const data = await tx
          .select({
            date: fundTransactions.date,
            amount: fundTransactions.amount,
            category: fundTransactions.category,
            description: fundTransactions.description,
            id: fundTransactions.id,
            currencyCode: currencies.code,
            isOfficial: fundTransactions.isOfficial,
            createdAt: fundTransactions.createdAt,
          })
          .from(fundTransactions)
          .limit(per_page)
          .offset(offset)
          .where(where)
          .innerJoin(currencies, eq(fundTransactions.currencyId, currencies.id))
          .orderBy(
            column && column in fundTransactions
              ? order === "asc"
                ? asc(fundTransactions[column])
                : desc(fundTransactions[column])
              : desc(fundTransactions.id)
          )

        const total = await tx
          .select({
            count: count(),
          })
          .from(fundTransactions)
          .where(where)
          .innerJoin(currencies, eq(fundTransactions.currencyId, currencies.id))
          .execute()
          .then((res) => res[0]?.count ?? 0)

        return {
          data,
          total,
        }
      })

      const pageCount = calculatePageCount(total, per_page)

      return { data, pageCount }
    } catch (error) {
      return { data: [], pageCount: 0 }
    }
  }
)

export const getFundAccountSummary = cache(async (fundId: string) => {
  // noStore()
  try {
    return await db
      .select({
        id: currencies.id,
        currency: currencies.code,
        currencyName: currencies.name,
        totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${fundTransactions.type} = 'income' THEN ${fundTransactions.amount} ELSE 0 END), 0)`,
        totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${fundTransactions.type} = 'outcome' THEN ABS(${fundTransactions.amount}) ELSE 0 END), 0)`,
        difference: sql<number>`COALESCE(SUM(${fundTransactions.amount}), 0)`,
      })
      .from(fundTransactions)
      .where(eq(fundTransactions.fundId, fundId))
      .innerJoin(currencies, eq(fundTransactions.currencyId, currencies.id))
      .groupBy(currencies.code, currencies.id)
  } catch (error) {
    console.log(error)
    throw new Error("Error fetching fund account summary")
  }
})
