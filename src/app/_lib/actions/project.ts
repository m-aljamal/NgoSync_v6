"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { projects } from "@/db/schema"

import { getErrorMessage } from "@/lib/handle-error"

import { type CreateProjectSchema } from "../validations"

export async function createProject(input: CreateProjectSchema) {
  noStore()
  try {
    await db
      .insert(projects)
      .values({ ...input

        
       })
    revalidatePath("/projects")
    return {
      error: null,
      data: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
