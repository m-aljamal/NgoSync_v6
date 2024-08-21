"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import {
  proposals,
  proposalsExpenses,
  type Proposal,
  type ProposalExpense,
} from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"
import { convertAmountToMiliunits } from "@/lib/utils"

import { actionClient } from "../safe-action"
import { createProposalSchema, deleteArraySchema } from "../validations"

function generateProposal(): Omit<Proposal, "projectId" | "currencyId"> {
  return {
    id: generateId(),
    name: `proposal ${Math.floor(Math.random() * 1000)}`,
    amount: convertAmountToMiliunits(Math.floor(Math.random() * 10000)),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function generateProposalExpense(): Omit<
  ProposalExpense,
  "proposalId" | "currencyId" | "expensesCategoryId"
> {
  return {
    id: generateId(),
    amount: convertAmountToMiliunits(Math.floor(Math.random() * 10000)),
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "",
  }
}

export async function seedProposals() {
  try {
    const projects = await db.query.projects.findMany()
    const currencies = await db.query.currencies.findMany()
    const expensesCategories = await db.query.expensesCategories.findMany()
    if (
      projects.length === 0 &&
      currencies.length === 0 &&
      expensesCategories.length === 0
    ) {
      console.log(
        "🚨 Skipping seeding proposals, no projects or currencies found"
      )
      return
    }

    const allProposals: Proposal[] = []
    const allProposalsExpenses: ProposalExpense[] = []
    for (let i = 0; i < 100; i++) {
      const currencyId =
        currencies[Math.floor(Math.random() * currencies.length)]?.id || ""

      allProposals.push({
        ...generateProposal(),
        projectId:
          projects[Math.floor(Math.random() * projects.length)]?.id || "",
        currencyId,
      })
      allProposalsExpenses.push({
        ...generateProposalExpense(),
        proposalId: generateProposal().id,
        currencyId,
        expensesCategoryId:
          expensesCategories[
            Math.floor(Math.random() * expensesCategories.length)
          ]?.id || "",
      })
    }
    await db.delete(proposals)
    console.log("📝 Inserting proposals", allProposals.length)
    await db.insert(proposals).values(allProposals).onConflictDoNothing()
    await db.delete(proposalsExpenses)
    console.log("📝 Inserting proposals expenses", allProposalsExpenses.length)
    await db
      .insert(proposalsExpenses)
      .values(allProposalsExpenses)
      .onConflictDoNothing()
  } catch (error) {
    console.error(error)
  }
}

export const createProposal = actionClient
  .schema(createProposalSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: data }) => {
    noStore()

    const totalExpenses = data.proposalExpenseCategories?.reduce(
      (acc, expense) => acc + Number(expense.amount),
      0
    )
    if (totalExpenses !== Number(data.amount)) {
      throw new Error("مجموع المصاريف يجب ان يساوي المبلغ الدراسة")
    }
    await db.transaction(async (ex) => {
      const [proposal] = await ex
        .insert(proposals)
        .values({
          ...data,
          amount: convertAmountToMiliunits(data.amount),
        })
        .returning({ proposalId: proposals.id })

      if (!proposal) throw new Error("Failed to create proposal")

      const allProposalsExpenses: Omit<
        ProposalExpense,
        "id" | "createdAt" | "updatedAt"
      >[] = []

      for (const expense of data.proposalExpenseCategories) {
        allProposalsExpenses.push({
          currencyId: data.currencyId,
          description: "",
          expensesCategoryId: expense.expensesCategoryId,
          amount: convertAmountToMiliunits(expense.amount),
          proposalId: proposal.proposalId,
        })
      }

      await ex.insert(proposalsExpenses).values(allProposalsExpenses)
    })
    revalidatePath("/proposals")
  })

export const deleteProposals = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.transaction(async (ex) => {
      await ex.delete(proposals).where(inArray(proposals.id, ids))
      await ex
        .delete(proposalsExpenses)
        .where(inArray(proposalsExpenses.proposalId, ids))
    })
    revalidatePath("/proposals")
  })

export const updateProposal = actionClient
  .schema(createProposalSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        id,
        proposalExpenseCategories,
        amount,
        name,
        projectId,
        currencyId,
      },
    }) => {
      noStore()
      if (!id) throw new Error("id is required")
      const totalExpenses = proposalExpenseCategories?.reduce(
        (acc, expense) => acc + Number(expense.amount),
        0
      )
      if (totalExpenses !== Number(amount)) {
        throw new Error("مجموع المصاريف يجب ان يساوي المبلغ الدراسة")
      }

      const proposalInDb = await db.query.proposals.findFirst({
        where: eq(proposals.id, id),
        with: {
          proposalsExpenses: true,
        },
      })
      if (!proposalInDb) throw new Error("Proposal not found")

      await db.transaction(async (ex) => {
        await ex
          .update(proposals)
          .set({
            name,
            projectId,
            currencyId,
            amount: convertAmountToMiliunits(amount),
          })
          .where(eq(proposals.id, proposalInDb.id))

        for (const expense of proposalInDb.proposalsExpenses) {
          await ex
            .delete(proposalsExpenses)
            .where(eq(proposalsExpenses.id, expense.id))
        }

        const allProposalsExpenses: Omit<
          ProposalExpense,
          "id" | "createdAt" | "updatedAt"
        >[] = []

        for (const expense of proposalExpenseCategories) {
          allProposalsExpenses.push({
            currencyId: currencyId,
            description: "",
            expensesCategoryId: expense.expensesCategoryId,
            amount: convertAmountToMiliunits(expense.amount),
            proposalId: id,
          })
        }

        await ex.insert(proposalsExpenses).values(allProposalsExpenses)
      })
      revalidatePath("/proposals")
    }
  )
