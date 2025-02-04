"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { fundTransactions, projectsTransactions } from "@/db/schemas"
import {
  transferBetweenFunds,
  transferBetweenProjects,
  transferFundToProject,
  transferProjectToFund,
} from "@/db/schemas/transfer"
import { format } from "date-fns"
import { eq, inArray, sql } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { calculateAmounts } from "../queries/utils"
import { actionClient } from "../safe-action"
import { toDecimalFixed } from "../utils"
import { createTransferSchema, deleteArraySchema } from "../validations"

export const createTransferBetweenFunds = actionClient
  .schema(createTransferSchema, {
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

      const amount = toDecimalFixed(transferAmount)
      const date = format(transferDate, "dd-MM-yyyy")

      const { amountInUSD, proposalAmount } = await calculateAmounts({
        amount: transferAmount,
        currencyId,
        date: transferDate,
      })

      await db.transaction(async (tx) => {
        const [sender] = await tx
          .insert(fundTransactions)
          .values({
            fundId: senderId,
            currencyId,
            amount: sql`${-amount}`,
            proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
            amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
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
            proposalAmount,
            amountInUSD,
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
          date,
        })
      })
      revalidatePath("/transfers-from-fund-to-fund")
    }
  )

export const updateTransferBetweenFunds = actionClient
  .schema(createTransferSchema, {
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

      if (!id) throw new Error("id is required")

      const { amountInUSD, proposalAmount } = await calculateAmounts({
        amount: transferAmount,
        currencyId,
        date: transferDate,
      })
      const [transfer] = await db
        .select({
          id: transferBetweenFunds.id,
          senderId: transferBetweenFunds.sender,
          receiverId: transferBetweenFunds.receiver,
        })
        .from(transferBetweenFunds)
        .where(eq(transferBetweenFunds.id, id))

      if (!transfer) throw new Error("transfer not found")
      const amount = toDecimalFixed(transferAmount)
      const date = format(transferDate, "dd-MM-yyyy")
      await db.transaction(async (tx) => {
        await tx
          .update(fundTransactions)
          .set({
            fundId: senderId,
            currencyId,
            amount: sql`${-amount}`,
            proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
            amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
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
            proposalAmount,
            amountInUSD,
            date,
            description,
          })
          .where(eq(fundTransactions.id, transfer?.receiverId))

        await tx
          .update(transferBetweenFunds)
          .set({ date })
          .where(eq(transferBetweenFunds.id, id))
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

// Transfer Between Projects
export const createTransferBetweenProjects = actionClient
  .schema(createTransferSchema, {
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

      const amount = toDecimalFixed(transferAmount)

      const { amountInUSD, proposalAmount } = await calculateAmounts({
        amount: transferAmount,
        currencyId,
        date: transferDate,
      })

      const date = format(transferDate, "dd-MM-yyyy")
      // todo the transfer is not appear in the project becase there is no expenseCategory
      await db.transaction(async (tx) => {
        const [sender] = await tx
          .insert(projectsTransactions)
          .values({
            projectId: senderId,
            currencyId,
            amount: sql`${-amount}`,
            proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
            amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
            transactionStatus: "approved",
            date,
            type: "outcome",
            description,
            category: "transfer_between_projects",
          })
          .returning({ id: projectsTransactions.id })

        const [receiver] = await tx
          .insert(projectsTransactions)
          .values({
            projectId: receiverId,
            currencyId,
            amount: amount,
            proposalAmount,
            amountInUSD,
            transactionStatus: "approved",
            date,
            type: "income",
            description,
            category: "transfer_between_projects",
          })
          .returning({ id: projectsTransactions.id })

        if (!sender || !receiver)
          throw new Error("sender or receiver is not created")

        await tx.insert(transferBetweenProjects).values({
          sender: sender?.id,
          receiver: receiver?.id,
          date,
        })
      })
      revalidatePath("/transfers-from-project-to-project")
    }
  )

export const updateTransferBetweenProjects = actionClient
  .schema(createTransferSchema, {
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
        isOfficial,
      },
    }) => {
      noStore()

      if (!id) throw new Error("id is required")

      const [transfer] = await db
        .select({
          id: transferBetweenProjects.id,
          senderId: transferBetweenProjects.sender,
          receiverId: transferBetweenProjects.receiver,
        })
        .from(transferBetweenProjects)
        .where(eq(transferBetweenProjects.id, id))

      if (!transfer) throw new Error("transfer not found")

      const amount = toDecimalFixed(transferAmount)

      const date = format(transferDate, "dd-MM-yyyy")

      const { amountInUSD, proposalAmount } = await calculateAmounts({
        amount: transferAmount,
        currencyId,
        date: transferDate,
      })

      await db.transaction(async (tx) => {
        await tx
          .update(projectsTransactions)
          .set({
            projectId: senderId,
            currencyId,
            amount: sql`${-amount}`,
            proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
            amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
            date,
            description,
            isOfficial,
          })
          .where(eq(projectsTransactions.id, transfer?.senderId))

        await tx
          .update(projectsTransactions)
          .set({
            projectId: receiverId,
            currencyId,
            amount: amount,
            proposalAmount,
            amountInUSD,
            date,
            description,
            isOfficial,
          })
          .where(eq(projectsTransactions.id, transfer?.receiverId))

        await tx
          .update(transferBetweenProjects)
          .set({ date })
          .where(eq(transferBetweenProjects.id, id))
      })
      revalidatePath("/transfers-from-project-to-project")
    }
  )

export const deleteTransferBetweenProjects = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()

    await db.transaction(async (ex) => {
      await ex
        .delete(transferBetweenProjects)
        .where(inArray(transferBetweenProjects.id, ids))
      await ex
        .delete(projectsTransactions)
        .where(inArray(projectsTransactions.id, ids))
    })
    revalidatePath("/transfers-from-project-to-project")
  })

// Transfer From Fund To Project

export const createTransferFundToProject = actionClient
  .schema(createTransferSchema, {
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
        isOfficial,
      },
    }) => {
      noStore()

      const amount = toDecimalFixed(transferAmount)
      const date = format(transferDate, "dd-MM-yyyy")

      const { amountInUSD, proposalAmount, officialAmount } =
        await calculateAmounts({
          amount: transferAmount,
          currencyId,
          date: transferDate,
          isOfficial,
        })

      await db.transaction(async (tx) => {
        const [sender] = await tx
          .insert(fundTransactions)
          .values({
            fundId: senderId,
            currencyId,
            amount: sql`${-amount}`,
            proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
            amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
            officialAmount: officialAmount ? sql`${-officialAmount}` : "0",
            date,
            type: "outcome",
            description,
            category: "transfer_to_project",
          })
          .returning({ id: fundTransactions.id })

        const [receiver] = await tx
          .insert(projectsTransactions)
          .values({
            projectId: receiverId,
            currencyId,
            amount: amount,
            proposalAmount,
            amountInUSD,
            officialAmount,
            transactionStatus: "pending",
            date,
            type: "income",
            description,
            category: "transfer_from_fund",
            isOfficial,
          })
          .returning({ id: projectsTransactions.id })

        if (!sender || !receiver)
          throw new Error("sender or receiver is not created")

        await tx.insert(transferFundToProject).values({
          sender: sender?.id,
          receiver: receiver?.id,
          date,
        })
      })
      revalidatePath("/transfers-from-fund-to-project")
    }
  )

export const updateTransferFundToProject = actionClient
  .schema(createTransferSchema, {
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
        isOfficial,
      },
    }) => {
      noStore()
      if (!id) throw new Error("id is required")

      const [transfer] = await db
        .select({
          id: transferFundToProject.id,
          senderId: transferFundToProject.sender,
          receiverId: transferFundToProject.receiver,
        })
        .from(transferFundToProject)
        .where(eq(transferFundToProject.id, id))

      if (!transfer) throw new Error("transfer not found")

      const amount = toDecimalFixed(transferAmount)

      const { amountInUSD, proposalAmount, officialAmount } =
        await calculateAmounts({
          amount: transferAmount,
          currencyId,
          date: transferDate,
          isOfficial,
        })

      const date = format(transferDate, "dd-MM-yyyy")
      await db.transaction(async (tx) => {
        await tx
          .update(fundTransactions)
          .set({
            fundId: senderId,
            currencyId,
            amount: sql`${-amount}`,
            proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
            amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
            officialAmount: officialAmount ? sql`${-officialAmount}` : "0",
            date,
            description,
            isOfficial,
          })
          .where(eq(fundTransactions.id, transfer?.senderId))

        await tx
          .update(projectsTransactions)
          .set({
            projectId: receiverId,
            currencyId,
            amount: amount,
            proposalAmount,
            amountInUSD,
            officialAmount,
            date,
            description,
            isOfficial,
          })
          .where(eq(projectsTransactions.id, transfer?.receiverId))

        await tx
          .update(transferFundToProject)
          .set({ date })
          .where(eq(transferFundToProject.id, id))
      })
      revalidatePath("/transfers-from-fund-to-project")
    }
  )

export const deleteTransferFundToProject = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()

    await db.transaction(async (ex) => {
      await ex
        .delete(transferFundToProject)
        .where(inArray(transferFundToProject.id, ids))
      await ex
        .delete(projectsTransactions)
        .where(inArray(projectsTransactions.id, ids))
      await ex.delete(fundTransactions).where(inArray(fundTransactions.id, ids))
    })
    revalidatePath("/transfers-from-fund-to-project")
  })
// Transfer From  Project to fund

export const createTransferProjectToFund = actionClient
  .schema(createTransferSchema, {
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
        isOfficial,
      },
    }) => {
      noStore()

      const amount = toDecimalFixed(transferAmount)
      const date = format(transferDate, "dd-MM-yyyy")

      const { amountInUSD, proposalAmount, officialAmount } =
        await calculateAmounts({
          amount: transferAmount,
          currencyId,
          date: transferDate,
          isOfficial,
        })

      await db.transaction(async (tx) => {
        const [sender] = await tx
          .insert(projectsTransactions)
          .values({
            projectId: senderId,
            currencyId,
            amount: sql`${-amount}`,
            proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
            amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
            officialAmount: officialAmount ? sql`${-officialAmount}` : "0",
            date,
            type: "outcome",
            isOfficial,
            description,
            category: "transfer_to_fund",
            transactionStatus: "approved",
          })
          .returning({ id: projectsTransactions.id })

        const [receiver] = await tx
          .insert(fundTransactions)
          .values({
            fundId: receiverId,
            currencyId,
            amount: amount,
            proposalAmount,
            amountInUSD,
            officialAmount,
            date,
            type: "income",
            description,
            category: "transfer_from_project",
            isOfficial,
          })
          .returning({ id: fundTransactions.id })

        if (!sender || !receiver)
          throw new Error("sender or receiver is not created")

        await tx.insert(transferProjectToFund).values({
          sender: sender?.id,
          receiver: receiver?.id,
          date,
        })
      })
      revalidatePath("/transfers-from-project-to-fund")
    }
  )

export const updateTransferProjectToFund = actionClient
  .schema(createTransferSchema, {
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
        isOfficial,
      },
    }) => {
      noStore()

      if (!id) throw new Error("id is required")

      const [transfer] = await db
        .select({
          id: transferProjectToFund.id,
          senderId: transferProjectToFund.sender,
          receiverId: transferProjectToFund.receiver,
        })
        .from(transferProjectToFund)
        .where(eq(transferProjectToFund.id, id))

      if (!transfer) throw new Error("transfer not found")
      const amount = toDecimalFixed(transferAmount)

      const { amountInUSD, proposalAmount, officialAmount } =
        await calculateAmounts({
          amount: transferAmount,
          currencyId,
          date: transferDate,
          isOfficial,
        })

      const date = format(transferDate, "dd-MM-yyyy")
      await db.transaction(async (tx) => {
        await tx
          .update(projectsTransactions)
          .set({
            projectId: senderId,
            currencyId,
            amount: sql`${-amount}`,
            proposalAmount: proposalAmount ? sql`${-proposalAmount}` : "0",
            amountInUSD: amountInUSD ? sql`${-amountInUSD}` : "0",
            officialAmount: officialAmount ? sql`${-officialAmount}` : "0",
            date,
            description,
            isOfficial,
          })
          .where(eq(projectsTransactions.id, transfer?.senderId))

        await tx
          .update(fundTransactions)
          .set({
            fundId: receiverId,
            currencyId,
            amount: amount,
            proposalAmount,
            amountInUSD,
            officialAmount,
            date,
            description,
            isOfficial,
          })
          .where(eq(fundTransactions.id, transfer?.receiverId))

        await tx
          .update(transferProjectToFund)
          .set({ date })
          .where(eq(transferProjectToFund.id, id))
      })
      revalidatePath("/transfers-from-project-to-fund")
    }
  )

export const deleteTransferProjectToFund = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()

    await db.transaction(async (ex) => {
      await ex
        .delete(transferProjectToFund)
        .where(inArray(transferProjectToFund.id, ids))
      await ex
        .delete(projectsTransactions)
        .where(inArray(projectsTransactions.id, ids))
      await ex.delete(fundTransactions).where(inArray(fundTransactions.id, ids))
    })
    revalidatePath("/transfers-from-project-to-fund")
  })
