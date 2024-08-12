"use server"

import { db } from "@/db"
import { projectsTransactions, type ProjectTransaction } from "@/db/schema"

import { generateId } from "@/lib/id"

function generateRandomTransaction() {
  return {
    id: generateId(),
    amount: Math.floor(Math.random() * 1000),
    amountInUSD: Math.floor(Math.random() * 1000),
    officialAmount: Math.floor(Math.random() * 1000),
    proposalAmount: Math.floor(Math.random() * 1000),
    type: "outcome",
    description: "Lorem ipsum dolor sit amet",
    isOfficial: false,
    date: "2021-01-01",
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
