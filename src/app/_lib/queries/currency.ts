import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  exchangeRates,
  type Currency,
  type ExchangeRate,
} from "@/db/schemas/currency"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, gte, lte, or, sql, type SQL } from "drizzle-orm"
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

    // Transaction is used to ensure both queries are executed in a single transaction
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
          rate: sql<number>`CAST(${exchangeRates.rate} AS FLOAT)/1000`,
          date: exchangeRates.date,
          fromCurrencyId: exchangeRates.fromCurrencyId,
          toCurrencyId: exchangeRates.toCurrencyId,
          createdAt: exchangeRates.createdAt,
          updatedAt: exchangeRates.updatedAt,
        })
        .from(exchangeRates)
        .limit(per_page)
        .offset(offset)
        .where(where)
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
