"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { donations, fundTransactions } from "@/db/schemas"
import { format } from "date-fns"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { convertAmountToMiliunits } from "@/lib/utils"

import { actionClient } from "../safe-action"
import { createDonationSchema, deleteArraySchema } from "../validations"

export const createDonation = actionClient
  .schema(createDonationSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        donerId,
        fundId,
        proposalId,
        amount: donationAmount,
        paymentType,
        projectId,
        date: donationDate,
        isOfficial,
        receiptDescription,
        amountInText,
        currencyId,
        description,
      },
    }) => {
      noStore()

      const amount = convertAmountToMiliunits(donationAmount)
      const date = format(donationDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        const [transaction] = await tx
          .insert(fundTransactions)
          .values({
            fundId,
            currencyId,
            amount: paymentType === "debt" ? 0 : amount,
            proposalAmount: 0,
            amountInUSD: 0,
            officialAmount: 0,
            date,
            type: "income",
            description,
            category: "donation",
            isOfficial,
          })
          .returning({ id: fundTransactions.id })
        if (!transaction) throw new Error("fund transaction not created")
        await tx.insert(donations).values({
          amount,
          paymentType,
          isOfficial,
          receiptDescription,
          amountInText,
          donerId,
          projectId,
          proposalId,
          fundTransactionId: transaction?.id,
          date,
        })
      })
      revalidatePath("/donations")
    }
  )

export const updateDonation = actionClient
  .schema(createDonationSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        donerId,
        fundId,
        proposalId,
        amount: donationAmount,
        paymentType,
        projectId,
        date: donationDate,
        isOfficial,
        receiptDescription,
        amountInText,
        currencyId,
        description,
        id,
        fundTransactionId,
      },
    }) => {
      noStore()
      if (!id || !fundTransactionId)
        throw new Error("id and fundTransactionId is required")

      const amount = convertAmountToMiliunits(donationAmount)
      const date = format(donationDate, "yyyy-MM-dd")

      await db.transaction(async (tx) => {
        await tx
          .update(fundTransactions)
          .set({
            fundId,
            currencyId,
            amount: paymentType === "debt" ? 0 : amount,
            proposalAmount: 0,
            amountInUSD: 0,
            officialAmount: 0,
            date,
            description,
            isOfficial,
          })
          .where(eq(fundTransactions.id, fundTransactionId))

        await tx
          .update(donations)
          .set({
            amount,
            paymentType,
            isOfficial,
            receiptDescription,
            amountInText,
            donerId,
            projectId,
            proposalId,
            date,
          })
          .where(eq(donations.id, id))
      })

      revalidatePath("/donations")
    }
  )

export const deleteDonations = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.transaction(async (ex) => {
      await ex.delete(fundTransactions).where(inArray(fundTransactions.id, ids))
      await ex
        .delete(donations)
        .where(inArray(donations.fundTransactionId, ids))
    })
    revalidatePath("/donations")
  })
