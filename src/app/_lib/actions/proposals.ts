"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  doners,
  projects,
  proposals,
  type Proposal,
} from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"
import { convertAmountToMiliunits } from "@/lib/utils"

import { actionClient } from "../safe-action"
import { createDonerSchema, deleteArraySchema } from "../validations"

function generateProposal(): Omit<Proposal, "currencyId" | "projectId"> {
  return {
    id: generateId(),
    name: `proposla ${Math.floor(Math.random() * 1000)}`,
    amount: convertAmountToMiliunits(Math.floor(Math.random() * 1000)),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function seedDoners() {
  try {
    const currenciesInDb = await db.select().from(currencies)
    if (currenciesInDb.length === 0) {
      throw new Error("Currencies are not seeded")
    }
    const projectsInDb = await db.select().from(projects)
    if (projectsInDb.length === 0) {
      throw new Error("Projects are not seeded")
    }

    const allProposals: Proposal[] = []
    for (let i = 0; i < 100; i++) {
      allProposals.push({
        ...generateProposal(),
        currencyId:
          currenciesInDb[Math.floor(Math.random() * currenciesInDb.length)]
            ?.id || "",
        projectId:
          projectsInDb[Math.floor(Math.random() * projectsInDb.length)]?.id ||
          "",
      })
    }
    await db.delete(doners)
    console.log("📝 Inserting Proposals", allProposals.length)
    await db.insert(proposals).values(allProposals).onConflictDoNothing()
  } catch (error) {
    console.error(error)
  }
}

export const createDoner = actionClient
  .schema(createDonerSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        name,
        status,
        gender,
        email,
        phone,
        type,
        description,
        address,
      },
    }) => {
      noStore()
      await db.insert(doners).values({
        name,
        gender,
        email,
        phone,
        type,
        description,
        address,
        status,
      })
      revalidatePath("/doners")
    }
  )

export const deleteDoners = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(doners).where(inArray(doners.id, ids))
    revalidatePath("/doners")
  })

export const updateDoner = actionClient
  .schema(createDonerSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: data }) => {
    noStore()
    if (!data.id) throw new Error("id is required")
    await db.update(doners).set(data).where(eq(doners.id, data.id))
    revalidatePath("/doners")
  })
