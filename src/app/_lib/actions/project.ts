"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { projects } from "@/db/schema"
import { flattenValidationErrors } from "next-safe-action"

import { actionClient } from "../safe-action"
import { createProjectSchema } from "../validations"

export const createProject = actionClient
  .schema(createProjectSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { name, nameTr, status, system, userId } }) => {
    noStore()
    setTimeout(() => {}, 10000)
    await db.insert(projects).values({
      name,
      nameTr,
      status,
      system,
      userId,
    })
    revalidatePath("/projects")
  })
