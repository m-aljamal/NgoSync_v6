"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { funds, type Fund } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"

import { actionClient } from "../safe-action"
import { createFundSchema, deleteArraySchema } from "../validations"

function generateFunds(): Fund {
  return {
    id: generateId(),
    name: `fund ${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date(),
  }
}

export async function seedFunds() {
  try {
    const allFunds: Fund[] = []
    for (let i = 0; i < 100; i++) {
      allFunds.push(generateFunds())
    }
    await db.delete(funds)
    console.log("📝 Inserting funds", allFunds.length)
    await db.insert(funds).values(allFunds).onConflictDoNothing()
  } catch (error) {
    console.error(error)
  }
}

export const createFund = actionClient
  .schema(createFundSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { name } }) => {
    noStore()
    await db.insert(funds).values({
      name,
    })
    revalidatePath("/funds")
  })

export const deleteFunds = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(funds).where(inArray(funds.id, ids))
    revalidatePath("/funds")
  })

export const updateFund = actionClient
  .schema(createFundSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: data }) => {
    noStore()
    if (!data.id) throw new Error("id is required")
    await db.update(funds).set(data).where(eq(funds.id, data.id))
    revalidatePath("/funds")
  })
