"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { currencies, doners, exchangeRates } from "@/db/schemas"
import { format } from "date-fns"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { convertAmountToMiliunits } from "@/lib/utils"
import { currencyList } from "@/app/(dashboard)/currencies/_components/currency-list"

import { actionClient } from "../safe-action"
import {
  createCurrencySchema,
  createExchangeRateSchema,
  deleteArraySchema,
} from "../validations"

export const createCurrency = actionClient
  .schema(createCurrencySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { code, official } }) => {
    noStore()
    const currencyToAdd = currencyList.find(
      (currency) => currency.code === code
    )
    if (!currencyToAdd) {
      throw new Error("العملة غير موجودة")
    }
    await db.insert(currencies).values({
      name: currencyToAdd.name,
      code: currencyToAdd.code,
      locale: currencyToAdd.locale,
      official,
    })
    revalidatePath("/currencies")
  })

export const deleteCurrencies = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(currencies).where(inArray(currencies.id, ids))
    revalidatePath("/currencies")
  })

export const updateCurrency = actionClient
  .schema(createCurrencySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: data }) => {
    console.log(data)

    noStore()
    if (!data.id) throw new Error("id is required")
    const currencyToAdd = currencyList.find(
      (currency) => currency.code === data.code
    )
    if (!currencyToAdd) {
      throw new Error("العملة غير موجودة")
    }

    const officialCurrency = await db.query.currencies.findFirst({
      where: eq(currencies.official, true),
    })

    if (officialCurrency && officialCurrency.id !== data.id) {
      await db
        .update(currencies)
        .set({ official: false })
        .where(eq(currencies.id, officialCurrency.id))
    }
    await db.update(currencies).set(data).where(eq(currencies.id, data.id))

    await db.update(doners).set(data).where(eq(doners.id, data.id))
    revalidatePath("/currencies")
  })

// exchange Rates

export const createExchangeRate = actionClient
  .schema(createExchangeRateSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        toCurrencyId,
        fromCurrencyId,
        rate: rateAmount,
        date: rateDate,
      },
    }) => {
      noStore()
      const rate = rateAmount * 1000
      const reverseRate = 1 / rateAmount

      const date = format(rateDate, "yyyy-MM-dd")

      await db.transaction(async (tx) => {
        await tx.insert(exchangeRates).values({
          toCurrencyId,
          fromCurrencyId,
          rate,
          date,
        })
        await tx.insert(exchangeRates).values({
          toCurrencyId,
          fromCurrencyId,
          rate: Math.round(reverseRate * 1000),
          date,
        })
      })
      revalidatePath("/exchange-rates")
    }
  )

export const updateExchangeRate = actionClient
  .schema(createExchangeRateSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        toCurrencyId,
        fromCurrencyId,
        rate: rateAmount,
        date: rateDate,
        id,
      },
    }) => {
      if (!id) throw new Error("id is required")
      noStore()
      const rate = convertAmountToMiliunits(rateAmount)
      const date = format(rateDate, "yyyy-MM-dd")

      await db
        .update(exchangeRates)
        .set({
          toCurrencyId,
          fromCurrencyId,
          rate,
          date,
        })
        .where(eq(exchangeRates.id, id))

      revalidatePath("/exchange-rates")
    }
  )

export const deleteExchangeRates = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(exchangeRates).where(inArray(exchangeRates.id, ids))
    revalidatePath("/exchange-rates")
  })
