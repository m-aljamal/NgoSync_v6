"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { Project, projects } from "@/db/schema"
import { format } from "date-fns"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"

import { getUsers } from "../queries/user"
import { actionClient } from "../safe-action"
import {
  createProjectSchema,
  deleteArraySchema,
  deleteSchema,
} from "../validations"

function generateProjects(): Project {
  return {
    id: generateId(),
    name: `Project ${Math.floor(Math.random() * 1000)}`,
    nameTr: `Project ${Math.floor(Math.random() * 1000)}`,
    status: Math.random() > 0.5 ? "in-progress" : "done",
    system: Math.random() > 0.5 ? "school" : "cultural_center",
    userId: "24bf9749-d56a-487d-a938-1e0593624b5e",
    createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"), // Add this
    updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"), // Add this
    description: "Lorem ipsum dolor sit amet",
  }
}

export async function seedProjects() {
  try {
    const allProjects: Project[] = []
    for (let i = 0; i < 100; i++) {
      allProjects.push(generateProjects())
    }
    await db.delete(projects)
    console.log("📝 Inserting projects", allProjects.length)
    await db.insert(projects).values(allProjects).onConflictDoNothing()
  } catch (error) {
    console.error(error)
  }
}

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
    console.log({ id })
    console.log("deleteProject")

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
