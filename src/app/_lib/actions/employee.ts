"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { doners, type Doner } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"

import { actionClient } from "../safe-action"
import { createDonerSchema, deleteArraySchema } from "../validations"

export const createEmployee = actionClient
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
