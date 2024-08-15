"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { projects } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { actionClient } from "../safe-action"
import {
  createProjectSchema,
  deleteArraySchema,
  deleteSchema,
} from "../validations"

export const createProject = actionClient
  .schema(createProjectSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { name, nameTr, status, system, userId } }) => {
    noStore()
    await db.insert(projects).values({
      name,
      nameTr,
      status,
      system,
      userId,
    })
    revalidatePath("/projects")
  })

export const updateProject = actionClient
  .schema(createProjectSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: { name, nameTr, status, system, userId, id } }) => {
      console.log({
        name,
        nameTr,
        status,
        system,
        userId,
        id,
      })

      noStore()
      if (!id) throw new Error("id is required")
      await db
        .update(projects)
        .set({
          name,
          nameTr,
          status,
          system,
          userId,
        })
        .where(eq(projects.id, id))
      revalidatePath("/projects")
    }
  )

export const deleteProject = actionClient
  .schema(deleteSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    console.log({ id });
    console.log("deleteProject");
    
    
    noStore()
    if (!id) throw new Error("id is required")
    await db.delete(projects).where(eq(projects.id, id))
    revalidatePath("/projects")
  })

export const deleteProjects = actionClient
  .schema(deleteArraySchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { ids } }) => {
    noStore()
    await db.delete(projects).where(inArray(projects.id, ids))
    revalidatePath("/projects")
  })
