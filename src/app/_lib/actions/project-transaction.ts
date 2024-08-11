"use server"

import { db } from "@/db"
import { projectsTransactions, type ProjectTransaction } from "@/db/schema"

import { generateId } from "@/lib/id"

function generateRandomTransaction() {
  return {
    id: generateId(),
    amount: Math.floor(Math.random() * 1000),
  }
}

export async function seedProjectTransactions() {
  try {
    const allTransactions: ProjectTransaction[] = []
    for (let i = 0; i < 100; i++) {
      allTransactions.push(generateRandomTransaction())
    }
    await db.delete(projectsTransactions)
    console.log("📝 Inserting prject transactions", allTransactions.length)
    await db
      .insert(projectsTransactions)
      .values(allTransactions)
      .onConflictDoNothing()
  } catch (error) {
    console.error(error)
  }
}
