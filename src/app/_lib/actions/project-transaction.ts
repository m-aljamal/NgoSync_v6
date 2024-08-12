"use server"

import { db } from "@/db"
import { projectsTransactions, type ProjectTransaction } from "@/db/schema"
import { format } from "date-fns"

import { generateId } from "@/lib/id"

function generateRandomTransaction(): ProjectTransaction {
  return {
    id: generateId(),
    amount: Math.floor(Math.random() * 1000) * 1000,
    amountInUSD: Math.floor(Math.random() * 1000) * 1000,
    officialAmount: Math.floor(Math.random() * 1000) * 1000,
    proposalAmount: Math.floor(Math.random() * 1000) * 1000,
    type: "outcome",
    description: "Lorem ipsum dolor sit amet",
    isOfficial: false,
    date: format(new Date(), "yyyy-MM-dd"),
    createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"), // Add this
    updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"), // Add this
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
