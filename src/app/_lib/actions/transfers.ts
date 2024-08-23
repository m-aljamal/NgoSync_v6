"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { donations, fundTransactions } from "@/db/schemas"
import { transferBetweenFunds } from "@/db/schemas/transfer"
import { format } from "date-fns"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { convertAmountToMiliunits } from "@/lib/utils"

import { actionClient } from "../safe-action"
import {
  createDonationSchema,
  createTransferBetweenFundsSchema,
  deleteArraySchema,
} from "../validations"

export const createTransferBetweenFunds = actionClient
  .schema(createTransferBetweenFundsSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        senderId,
        receiverId,
        amount: transferAmount,
        date: transferDate,
        currencyId,
        description,
      },
    }) => {
      noStore()
      // todo add the amounts
      const amount = convertAmountToMiliunits(transferAmount)
      const date = format(transferDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        const [sender] = await tx
          .insert(fundTransactions)
          .values({
            fundId: senderId,
            currencyId,
            amount: -amount,
            proposalAmount: 0,
            amountInUSD: 0,
            officialAmount: 0,
            date,
            type: "outcome",
            description,
            category: "transfer_between_funds",
          })
          .returning({ id: fundTransactions.id })

        const [receiver] = await tx
          .insert(fundTransactions)
          .values({
            fundId: receiverId,
            currencyId,
            amount: amount,
            proposalAmount: 0,
            amountInUSD: 0,
            officialAmount: 0,
            date,
            type: "income",
            description,
            category: "transfer_between_funds",
          })
          .returning({ id: fundTransactions.id })

        if (!sender || !receiver)
          throw new Error("sender or receiver is not created")

        await tx.insert(transferBetweenFunds).values({
          sender: sender?.id,
          receiver: receiver?.id,
        })
      })
      revalidatePath("/transfers-from-fund-to-fund")
    }
  )

export const updateTransferBetweenFunds = actionClient
  .schema(createTransferBetweenFundsSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        id,
        senderId,
        receiverId,
        amount: transferAmount,
        date: transferDate,
        currencyId,
        description,
      },
    }) => {
      noStore()
      // todo add the amounts
      if (!id) throw new Error("id is required")

      const [transfer] = await db
        .select({
          id: transferBetweenFunds.id,
          senderId: transferBetweenFunds.sender,
          receiverId: transferBetweenFunds.receiver,
        })
        .from(transferBetweenFunds)
        .where(eq(transferBetweenFunds.id, id))

      if (!transfer) throw new Error("transfer not found")
      const amount = convertAmountToMiliunits(transferAmount)
      const date = format(transferDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        await tx
          .update(fundTransactions)
          .set({
            fundId: senderId,
            currencyId,
            amount: -amount,
            proposalAmount: 0,
            amountInUSD: 0,
            officialAmount: 0,
            date,
            description,
          })
          .where(eq(fundTransactions.id, transfer?.senderId))

        await tx
          .update(fundTransactions)
          .set({
            fundId: receiverId,
            currencyId,
            amount: amount,
            proposalAmount: 0,
            amountInUSD: 0,
            officialAmount: 0,
            date,
            description,
          })
          .where(eq(fundTransactions.id, transfer?.receiverId))
      })
      revalidatePath("/transfers-from-fund-to-fund")
    }
  )

export const deleteTransferBetweenFunds = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()

    await db.transaction(async (ex) => {
      await ex
        .delete(transferBetweenFunds)
        .where(inArray(transferBetweenFunds.id, ids))
      await ex.delete(fundTransactions).where(inArray(fundTransactions.id, ids))
    })
    revalidatePath("/transfers-from-fund-to-fund")
  })
