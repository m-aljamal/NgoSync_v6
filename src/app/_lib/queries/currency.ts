import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { funds, fundTransactions, projectsTransactions } from "@/db/schemas"
import {
  currencies,
  exchangeRates,
  exchnageBetweenFunds,
  exchnageBetweenProjects,
  type Currency,
  type ExchangeBetweenFunds,
  type ExchangeBetweenProjects,
  type ExchangeRate,
} from "@/db/schemas/currency"
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

export async function getCurrencies(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Currency | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: currencies.name,
            value: name,
          })
        : undefined,

      fromDay && toDay
        ? and(
            gte(currencies.createdAt, fromDay),
            lte(currencies.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<Currency> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(currencies)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in currencies
            ? order === "asc"
              ? asc(currencies[column])
              : desc(currencies[column])
            : desc(currencies.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(currencies)
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

export async function getOfficialCurrency() {
  noStore()
  try {
    const data = await db.query.currencies.findFirst({
      where: eq(currencies.isOfficial, true),
    })
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getExchangeRates(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ExchangeRate | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      fromDay && toDay
        ? and(
            gte(exchangeRates.createdAt, fromDay),
            lte(exchangeRates.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<Currency> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)
    const fromCurrency = alias(currencies, "fromCurrency")
    const toCurrency = alias(currencies, "toCurrency")
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: exchangeRates.id,
          rate: exchangeRates.rate,
          date: exchangeRates.date,
          fromCurrencyId: exchangeRates.fromCurrencyId,
          toCurrencyId: exchangeRates.toCurrencyId,
          createdAt: exchangeRates.createdAt,
          updatedAt: exchangeRates.updatedAt,
          fromCurrencyCode: fromCurrency.code,
          toCurrencyCode: toCurrency.code,
        })
        .from(exchangeRates)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          fromCurrency,
          eq(exchangeRates.fromCurrencyId, fromCurrency.id)
        )
        .innerJoin(toCurrency, eq(exchangeRates.toCurrencyId, toCurrency.id))
        .orderBy(
          column && column in exchangeRates
            ? order === "asc"
              ? asc(exchangeRates[column])
              : desc(exchangeRates[column])
            : desc(exchangeRates.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(exchangeRates)
        .where(where)
        .innerJoin(
          fromCurrency,
          eq(exchangeRates.fromCurrencyId, fromCurrency.id)
        )
        .innerJoin(toCurrency, eq(exchangeRates.toCurrencyId, toCurrency.id))
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

// exchange between funds

export async function getExchangeBetweenFunds(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    const offset = (page - 1) * per_page

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ExchangeBetweenFunds | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      fromDay && toDay
        ? and(
            gte(exchnageBetweenFunds.createdAt, fromDay),
            lte(exchnageBetweenFunds.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<ExchangeBetweenFunds> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const senderTransaction = alias(fundTransactions, "senderTransaction")
    const recipientTransaction = alias(fundTransactions, "recipientTransaction")
    const fromCurrency = alias(currencies, "fromCurrency")
    const toCurrency = alias(currencies, "toCurrency")
    const recipientFund = alias(funds, "recipientFund")
    const senderFund = alias(funds, "senderFund")

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: exchnageBetweenFunds.id,
          sender: exchnageBetweenFunds.sender,
          receiver: exchnageBetweenFunds.receiver,
          updatedAt: exchnageBetweenFunds.updatedAt,
          rate: exchnageBetweenFunds.rate,
          createdAt: exchnageBetweenFunds.createdAt,
          description: senderTransaction.description,
          senderFundId: senderTransaction.fundId,
          receiverFundId: recipientTransaction.fundId,
          date: senderTransaction.date,
          fromAmount: sql<string>`ABS(${senderTransaction.amount})`,
          toAmount: recipientTransaction.amount,
          fromCurrencyId: senderTransaction.currencyId,
          toCurrencyId: recipientTransaction.currencyId,
          fromCurrencyCode: fromCurrency.code,
          toCurrencyCode: toCurrency.code,
          senderName: recipientFund.name,
          receiverName: senderFund.name,
        })
        .from(exchnageBetweenFunds)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          senderTransaction,
          eq(exchnageBetweenFunds.sender, senderTransaction.id)
        )
        .innerJoin(
          recipientTransaction,
          eq(exchnageBetweenFunds.receiver, recipientTransaction.id)
        )

        .innerJoin(
          fromCurrency,
          eq(senderTransaction.currencyId, fromCurrency.id)
        )
        .innerJoin(
          toCurrency,
          eq(recipientTransaction.currencyId, toCurrency.id)
        )
        .innerJoin(senderFund, eq(senderTransaction.fundId, senderFund.id))
        .innerJoin(
          recipientFund,
          eq(recipientTransaction.fundId, recipientFund.id)
        )

        .orderBy(
          column && column in exchnageBetweenFunds
            ? order === "asc"
              ? asc(exchnageBetweenFunds[column])
              : desc(exchnageBetweenFunds[column])
            : desc(exchnageBetweenFunds.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(exchnageBetweenFunds)
        .where(where)
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

// exchange between projects

export async function getExchangeBetweenProjects(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    const offset = (page - 1) * per_page

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [
      keyof ExchangeBetweenProjects | undefined,
      "asc" | "desc" | undefined,
    ]
    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      fromDay && toDay
        ? and(
            gte(exchnageBetweenProjects.createdAt, fromDay),
            lte(exchnageBetweenProjects.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<ExchangeBetweenProjects> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const senderTransaction = alias(projectsTransactions, "senderTransaction")
    const recipientTransaction = alias(
      projectsTransactions,
      "recipientTransaction"
    )

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: exchnageBetweenProjects.id,
          sender: exchnageBetweenProjects.sender,
          receiver: exchnageBetweenProjects.receiver,
          updatedAt: exchnageBetweenProjects.updatedAt,
          createdAt: exchnageBetweenProjects.createdAt,
          description: senderTransaction.description,
          senderProjectId: senderTransaction.projectId,
          receiverProjectId: recipientTransaction.projectId,
          date: senderTransaction.date,
          fromAmount: senderTransaction.amount,
          toAmount: recipientTransaction.amount,
          fromCurrencyId: senderTransaction.currencyId,
          toCurrencyId: recipientTransaction.currencyId,
          rate: exchnageBetweenProjects.rate,
        })
        .from(exchnageBetweenProjects)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          senderTransaction,
          eq(exchnageBetweenProjects.sender, senderTransaction.id)
        )
        .innerJoin(
          recipientTransaction,
          eq(exchnageBetweenProjects.receiver, recipientTransaction.id)
        )
        .orderBy(
          column && column in exchnageBetweenProjects
            ? order === "asc"
              ? asc(exchnageBetweenProjects[column])
              : desc(exchnageBetweenProjects[column])
            : desc(exchnageBetweenProjects.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(exchnageBetweenProjects)
        .where(where)
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

export const getCurrency = cache(
  async ({
    name,
    id,
    code,
    official,
  }: {
    name?: string
    id?: string
    code?: string
    official?: boolean
  }) => {
    if (!name && !id && !code && !official) return
    try {
      const data = await db.query.currencies.findFirst({
        where: name
          ? eq(currencies.name, name)
          : id
            ? eq(currencies.id, id)
            : code
              ? eq(currencies.code, code)
              : official
                ? eq(currencies.isOfficial, official)
                : undefined,
      })

      return data
    } catch (error) {
      console.error(error)
    }
  }
)
