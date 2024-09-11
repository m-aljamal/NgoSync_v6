"use server"

import {
  unstable_noStore as noStore,
  revalidatePath,
  revalidateTag,
} from "next/cache"
import { db } from "@/db"
import { projects, type Project } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { flattenValidationErrors } from "next-safe-action"

import { generateId } from "@/lib/id"

import { actionClient } from "../safe-action"
import {
  createProjectSchema,
  deleteArraySchema,
  deleteSchema,
} from "../validations"

function generateProjects(): Project {
  return {
    id: generateId(),
    name: `مشروع ${Math.floor(Math.random() * 10)}`,
    nameTr: `Project ${Math.floor(Math.random() * 10)}`,
    status: Math.random() > 0.5 ? "in-progress" : "done",
    system: Math.random() > 0.5 ? "school" : "cultural_center",
    userId: "501415e3-3df8-47f9-aee0-1ad90b258d40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Lorem ipsum dolor sit amet",
  }
}

export async function seedProjects() {
  try {
    const allProjects: Project[] = []
    for (let i = 0; i < 10; i++) {
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
    revalidateTag("projects")
    const protocol = process.env.NODE_ENV === "production" ? "https:" : "http:"
    const host = process.env.WEB_URL || "localhost:3000"
    await fetch(`${protocol}//${host}/api/sse`, { method: "POST" })
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
