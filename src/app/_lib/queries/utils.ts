import { db } from "@/db"
import { currencies, exchangeRates } from "@/db/schemas"
import Decimal from "decimal.js"
import { and, eq, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import { cache } from "react"

import { toDecimalFixed } from "../utils"
import { getCurrency } from "./currency"
import { getProposal } from "./proposals"

export function calculateOffset(page: number, perPage: number): number {
  return (page - 1) * perPage
}

export function convertToDate(
  from: string | undefined,
  to: string | undefined
) {
  const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined
  const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined
  return { fromDay, toDay }
}

export function calculatePageCount(total: number, per_page: number): number {
  return Math.ceil(total / per_page)
}

export function getPaginationAndSorting<T>(
  page: number,
  per_page: number,
  sort?: string
): { offset: number; column: keyof T | undefined; order: "asc" | "desc" } {
  const offset = calculateOffset(page, per_page)
  const [column, order] = (sort?.split(".").filter(Boolean) ?? [
    "createdAt",
    "desc",
  ]) as [keyof T | undefined, "asc" | "desc" | undefined]

  return { offset, column, order: order ?? "desc" }
}

export const getCloseExchangeRate = cache(
  async ({
    date,
    fromCurrencyId,
    toCurrencyId,
  }: {
    date?: Date
    fromCurrencyId?: string
    toCurrencyId?: string
  }) => {
    const fromCurrency = alias(currencies, "fromCurrency")
    const toCurrency = alias(currencies, "toCurrency")

    try {
      const [data] = await db
        .select({
          id: exchangeRates.id,
          rate: exchangeRates.rate,
          date: exchangeRates.date,
          fromCurrencyId: exchangeRates.fromCurrencyId,
          toCurrencyId: exchangeRates.toCurrencyId,
        })
        .from(exchangeRates)
        .leftJoin(
          fromCurrency,
          eq(exchangeRates.fromCurrencyId, fromCurrency.id)
        )
        .leftJoin(toCurrency, eq(exchangeRates.toCurrencyId, toCurrency.id))
        .where(
          and(
            fromCurrencyId
              ? eq(exchangeRates.fromCurrencyId, fromCurrencyId)
              : undefined,
            toCurrencyId
              ? eq(exchangeRates.toCurrencyId, toCurrencyId)
              : undefined
          )
        )

        .orderBy(
          sql`ABS(EXTRACT(EPOCH FROM (${exchangeRates.date}::timestamp - ${date}::timestamp)))`
        )

        // .orderBy(sql`ABS(EXTRACT(EPOCH FROM ${exchangeRates.date} - ${date}))`)

        .limit(1)

      return data
    } catch (error) {
      console.error("Error fetching close exchange rate:", error)
      throw new Error("Failed to fetch close exchange rate")
    }
  }
)
// todo optimize this function in update
export const calculateAmounts = cache(
  async ({
    amount,
    currencyId,
    date,
    isOfficial = false,
    proposalId,
  }: {
    amount: Decimal
    currencyId: string
    date: Date
    isOfficial?: boolean
    proposalId?: string | null
  }) => {
    try {
      const [currency, usdCurrency, officialCurrency, proposal] =
        await Promise.all([
          getCurrency({ id: currencyId }),
          getCurrency({ code: "USD" }),
          isOfficial ? getCurrency({ official: true }) : null,
          proposalId ? getProposal({ id: proposalId }) : null,
        ])

      if (!currency) throw new Error("Invalid currency")

      const exchangeRates = await Promise.all([
        usdCurrency && usdCurrency.id !== currency.id
          ? getCloseExchangeRate({
              date,
              fromCurrencyId: currency.id,
              toCurrencyId: usdCurrency.id,
            })
          : null,
        officialCurrency && officialCurrency.id !== currency.id
          ? getCloseExchangeRate({
              date,
              fromCurrencyId: currency.id,
              toCurrencyId: officialCurrency.id,
            })
          : null,
        proposalId
          ? getCloseExchangeRate({
              date,
              fromCurrencyId: currency.id,
              toCurrencyId: proposal?.currencyId,
            })
          : null,
      ])

      const [usdRate, officialRate, proposalRate] = exchangeRates

      const result: {
        amountInUSD?: Decimal
        officialAmount?: Decimal
        proposalAmount?: Decimal
      } = {}
      if (currency.id !== usdCurrency?.id && !usdRate) {
        throw new Error(
          `لم يتم العثور على سعر صرف من ${currency.code} إلى ${usdCurrency?.code}`
        )
      }
      if (usdRate) {
        result.amountInUSD = amount.mul(new Decimal(usdRate.rate)).round()
      } else if (usdCurrency && usdCurrency.id === currency.id) {
        result.amountInUSD = amount
      }

      if (
        officialCurrency &&
        officialCurrency.id !== currency.id &&
        !officialRate
      ) {
        throw new Error(
          `لم يتم العثور على سعر صرف من ${currency.code} إلى ${officialCurrency?.code}`
        )
      }

      if (isOfficial) {
        if (officialRate) {
          result.officialAmount = amount
            .mul(new Decimal(officialRate.rate))
            .round()
        } else if (officialCurrency && officialCurrency.id === currency.id) {
          result.officialAmount = amount
        }
      }

      if (proposalId && !proposalRate && proposal?.currencyId !== currency.id) {
        throw new Error(
          `لم يتم العثور على سعر صرف من ${currency.code} إلى ${
            proposal?.currencyCode
          }`
        )
      }

      if (proposalId) {
        if (proposalRate) {
          result.proposalAmount = amount
            .mul(new Decimal(proposalRate.rate))
            .round()
        } else if (
          proposalId &&
          proposal &&
          proposal.currencyId === currency.id
        ) {
          result.proposalAmount = amount
        } else {
          throw new Error(
            `لم يتم العثور على سعر صرف من ${currency.code} إلى ${
              proposal?.currencyCode
            }`
          )
        }
      }

      // Convert Decimal to string with fixed decimal places
      return {
        amountInUSD: result.amountInUSD
          ? toDecimalFixed(result.amountInUSD)
          : "0",
        officialAmount: result.officialAmount
          ? toDecimalFixed(result.officialAmount)
          : "0",
        proposalAmount: result.proposalAmount
          ? toDecimalFixed(result.proposalAmount)
          : "0",
      }
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)

      console.error("Error calculating amounts:", error)
      throw new Error("Failed to calculate amount")
    }
  }
)
