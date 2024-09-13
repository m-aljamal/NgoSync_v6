"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  doners,
  exchangeRates,
  exchnageBetweenFunds,
  exchnageBetweenProjects,
  fundTransactions,
  projectsTransactions,
} from "@/db/schemas"
import { format } from "date-fns"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { convertAmountToMiliunits } from "@/lib/utils"
import { currencyList } from "@/app/(dashboard)/currencies/_components/currency-list"

import { actionClient } from "../safe-action"
import {
  createCurrencySchema,
  createExchangeRateSchema,
  createExchangeSchema,
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
          toCurrencyId: fromCurrencyId,
          fromCurrencyId: toCurrencyId,
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

// exchange between funds

export const createExchangeBetweenFunds = actionClient
  .schema(createExchangeSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        senderId,
        receiverId,
        fromAmount,
        toAmount,
        rate,
        date: transferDate,
        description,
        fromCurrencyId,
        toCurrencyId,
      },
    }) => {
      noStore()
      // todo add the amounts
      const exchangeFromAmount = convertAmountToMiliunits(fromAmount)
      const exchangeToAmount = convertAmountToMiliunits(toAmount)
      const exchangeRate = convertAmountToMiliunits(rate)
      const date = format(transferDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        const [sender] = await tx
          .insert(fundTransactions)
          .values({
            fundId: senderId,
            currencyId: fromCurrencyId,
            amount: -exchangeFromAmount,
            amountInUSD: 0,
            date,
            type: "outcome",
            description,
            category: "currency_exchange",
          })
          .returning({ id: fundTransactions.id })

        const [receiver] = await tx
          .insert(fundTransactions)
          .values({
            fundId: receiverId,
            currencyId: toCurrencyId,
            amount: exchangeToAmount,
            amountInUSD: 0,
            date,
            type: "income",
            description,
            category: "currency_exchange",
          })
          .returning({ id: fundTransactions.id })

        if (!sender || !receiver)
          throw new Error("sender or receiver is not created")

        await tx.insert(exchnageBetweenFunds).values({
          sender: sender?.id,
          receiver: receiver?.id,
          rate: exchangeRate,
        })
      })
      revalidatePath("/exchange-between-funds")
    }
  )

export const updateExchangeBetweenFunds = actionClient
  .schema(createExchangeSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        senderId,
        receiverId,
        fromAmount,
        toAmount,
        rate,
        date: transferDate,
        description,
        fromCurrencyId,
        toCurrencyId,
        id,
      },
    }) => {
      noStore()
      // todo add the amounts
      if (!id) throw new Error("id is required")

      const [transfer] = await db
        .select({
          id: exchnageBetweenFunds.id,
          senderId: exchnageBetweenFunds.sender,
          receiverId: exchnageBetweenFunds.receiver,
          rate: exchnageBetweenFunds.rate,
        })
        .from(exchnageBetweenFunds)
        .where(eq(exchnageBetweenFunds.id, id))

      if (!transfer) throw new Error("transfer not found")
      const exchangeFromAmount = convertAmountToMiliunits(fromAmount)
      const exchangeToAmount = convertAmountToMiliunits(toAmount)
      const exchangeRate = convertAmountToMiliunits(rate)
      const date = format(transferDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        await tx
          .update(fundTransactions)
          .set({
            fundId: senderId,
            currencyId: fromCurrencyId,
            amount: -exchangeFromAmount,
            amountInUSD: 0,
            date,
            description,
          })
          .where(eq(fundTransactions.id, transfer?.senderId))

        await tx
          .update(fundTransactions)
          .set({
            fundId: receiverId,
            currencyId: toCurrencyId,
            amount: exchangeToAmount,
            amountInUSD: 0,
            date,
            description,
          })
          .where(eq(fundTransactions.id, transfer?.receiverId))

        await tx
          .update(exchnageBetweenFunds)
          .set({
            rate: exchangeRate,
          })
          .where(eq(exchnageBetweenFunds.id, id))
      })
      revalidatePath("/exchange-between-funds")
    }
  )

export const deleteExchangeBetweenFunds = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()

    await db.transaction(async (ex) => {
      await ex
        .delete(exchnageBetweenFunds)
        .where(inArray(exchnageBetweenFunds.id, ids))
      await ex.delete(fundTransactions).where(inArray(fundTransactions.id, ids))
    })
    revalidatePath("/exchange-between-funds")
  })

// exchange between projects

export const createExchangeBetweenProjects = actionClient
  .schema(createExchangeSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        senderId,
        receiverId,
        fromAmount,
        toAmount,
        rate,
        date: transferDate,
        description,
        fromCurrencyId,
        toCurrencyId,
      },
    }) => {
      noStore()
      // todo add the amounts
      const exchangeFromAmount = convertAmountToMiliunits(fromAmount)
      const exchangeToAmount = convertAmountToMiliunits(toAmount)
      const exchangeRate = convertAmountToMiliunits(rate)
      const date = format(transferDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        const [sender] = await tx
          .insert(projectsTransactions)
          .values({
            projectId: senderId,
            currencyId: fromCurrencyId,
            amount: -exchangeFromAmount,
            amountInUSD: 0,
            date,
            type: "outcome",
            description,
            category: "currency_exchange",
            transactionStatus: "approved",
          })
          .returning({ id: projectsTransactions.id })

        const [receiver] = await tx
          .insert(projectsTransactions)
          .values({
            projectId: receiverId,
            currencyId: toCurrencyId,
            amount: exchangeToAmount,
            amountInUSD: 0,
            date,
            type: "income",
            description,
            category: "currency_exchange",
            transactionStatus: "approved",
          })
          .returning({ id: projectsTransactions.id })

        if (!sender || !receiver)
          throw new Error("sender or receiver is not created")

        await tx.insert(exchnageBetweenProjects).values({
          sender: sender?.id,
          receiver: receiver?.id,
          rate: exchangeRate,
        })
      })
      revalidatePath("/exchange-between-projects")
    }
  )

export const updateExchangeBetweenProjects = actionClient
  .schema(createExchangeSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        senderId,
        receiverId,
        fromAmount,
        toAmount,
        rate,
        date: transferDate,
        description,
        fromCurrencyId,
        toCurrencyId,
        id,
      },
    }) => {
      noStore()
      // todo add the amounts
      if (!id) throw new Error("id is required")

      const [transfer] = await db
        .select({
          id: exchnageBetweenProjects.id,
          senderId: exchnageBetweenProjects.sender,
          receiverId: exchnageBetweenProjects.receiver,
          rate: exchnageBetweenProjects.rate,
        })
        .from(exchnageBetweenProjects)
        .where(eq(exchnageBetweenProjects.id, id))

      if (!transfer) throw new Error("transfer not found")
      const exchangeFromAmount = convertAmountToMiliunits(fromAmount)
      const exchangeToAmount = convertAmountToMiliunits(toAmount)
      const exchangeRate = convertAmountToMiliunits(rate)
      const date = format(transferDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        await tx
          .update(projectsTransactions)
          .set({
            projectId: senderId,
            currencyId: fromCurrencyId,
            amount: -exchangeFromAmount,
            amountInUSD: 0,
            date,
            description,
          })
          .where(eq(projectsTransactions.id, transfer?.senderId))

        await tx
          .update(projectsTransactions)
          .set({
            projectId: receiverId,
            currencyId: toCurrencyId,
            amount: exchangeToAmount,
            amountInUSD: 0,
            date,
            description,
          })
          .where(eq(projectsTransactions.id, transfer?.receiverId))

        await tx
          .update(exchnageBetweenProjects)
          .set({
            rate: exchangeRate,
          })
          .where(eq(exchnageBetweenProjects.id, id))
      })
      revalidatePath("/exchange-between-projects")
    }
  )

export const deleteExchangeBetweenProjects = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()

    await db.transaction(async (ex) => {
      await ex
        .delete(exchnageBetweenProjects)
        .where(inArray(exchnageBetweenProjects.id, ids))
      await ex
        .delete(projectsTransactions)
        .where(inArray(projectsTransactions.id, ids))
    })
    revalidatePath("/exchange-between-projects")
  })
