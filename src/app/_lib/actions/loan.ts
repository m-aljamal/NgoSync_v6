"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { projectsTransactions } from "@/db/schemas"
import { loans } from "@/db/schemas/loan"
import { format } from "date-fns"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { convertAmountToMiliunits } from "@/lib/utils"

import { actionClient } from "../safe-action"
import { createLoanSchema, deleteArraySchema } from "../validations"

export const createLoan = actionClient
  .schema(createLoanSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        projectId,
        date: loanDate,
        amount: loanAmount,
        employeeId,
        type,
        currencyId,
        description,
      },
    }) => {
      noStore()
      // todo add the amounts
      const amount = convertAmountToMiliunits(loanAmount)
      const date = format(loanDate, "yyyy-MM-dd")
      await db.transaction(async (tx) => {
        const [transaction] = await tx
          .insert(projectsTransactions)
          .values({
            projectId,
            currencyId,
            amount: type === "loan" ? -amount : amount,
            proposalAmount: 0,
            amountInUSD: 0,
            officialAmount: 0,
            date,
            type: type === "loan" ? "outcome" : "income",
            description,
            category: "loan",
            transactionStatus: "approved",
          })
          .returning({ id: projectsTransactions.id })
        if (!transaction) throw new Error("project transaction not created")
        await tx.insert(loans).values({
          employeeId,
          type,
          projectTransactionId: transaction?.id,
        })
      })
      revalidatePath("/loans")
    }
  )

export const updateLoans = actionClient
  .schema(createLoanSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        projectId,
        date: loanDate,
        amount: loanAmount,
        employeeId,
        type,
        currencyId,
        description,
        id,
      },
    }) => {
      noStore()
      if (!id) throw new Error("id is required")
      const [loanInDb] = await db.select().from(loans).where(eq(loans.id, id))
      if (!loanInDb?.projectTransactionId) throw new Error("loan not found")
      const amount = convertAmountToMiliunits(loanAmount)
      const date = format(loanDate, "yyyy-MM-dd")

      await db.transaction(async (tx) => {
        await tx
          .update(projectsTransactions)
          .set({
            projectId,
            currencyId,
            amount: type === "loan" ? -amount : amount,
            proposalAmount: 0,
            amountInUSD: 0,
            officialAmount: 0,
            date,
            type: type === "loan" ? "outcome" : "income",
            description,
          })
          .where(eq(projectsTransactions.id, id))

        await tx
          .update(loans)
          .set({
            employeeId,
            type,
          })
          .where(eq(loans.id, loanInDb?.projectTransactionId))
      })

      revalidatePath("/loans")
    }
  )

export const deleteLoans = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()

    await db.transaction(async (ex) => {
      await ex
        .delete(projectsTransactions)
        .where(inArray(projectsTransactions.id, ids))
      await ex.delete(loans).where(inArray(loans.projectTransactionId, ids))
    })
    revalidatePath("/loans")
  })
