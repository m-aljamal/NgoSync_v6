"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { donations, fundTransactions } from "@/db/schemas"
import { format } from "date-fns"
import { flattenValidationErrors } from "next-safe-action"

import { convertAmountToMiliunits } from "@/lib/utils"

import { actionClient } from "../safe-action"
import { createDonationSchema } from "../validations"

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
