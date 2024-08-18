"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { doners, type Doner } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"

import { actionClient } from "../safe-action"
import { createDonerSchema, deleteArraySchema } from "../validations"

function generateDoners(): Doner {
  return {
    id: generateId(),
    name: `Doner ${Math.floor(Math.random() * 1000)}`,
    gender: Math.random() > 0.5 ? "female" : "male",
    email: `doner${Math.floor(Math.random() * 1000)}@example.com`,
    phone: `+90${Math.floor(Math.random() * 100000000)}`,
    type: Math.random() > 0.5 ? "individual" : "orgnization",
    status: Math.random() > 0.5 ? "active" : "inactive",
    address: `Address ${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Lorem ipsum dolor sit amet",
  }
}

export async function seedDoners() {
  try {
    const allDoners: Doner[] = []
    for (let i = 0; i < 100; i++) {
      allDoners.push(generateDoners())
    }
    await db.delete(doners)
    console.log("📝 Inserting Doenrs", allDoners.length)
    await db.insert(doners).values(allDoners).onConflictDoNothing()
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
