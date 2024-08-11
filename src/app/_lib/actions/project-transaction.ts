"use server"

import { db } from "@/db"
import { projectsTransactions, type ProjectTransaction } from "@/db/schema"

import { generateId } from "@/lib/id"

function generateRandomTransaction() {
    // Generate a random integer amount between 0 and 99999 cents (e.g., $0.00 to $999.99)
    const wholePart = Math.floor(Math.random() * 1000); // Whole dollars
    const decimalPart = Math.floor(Math.random() * 100); // Cents
  
    // Convert the whole part and decimal part to cents and combine
    const amountInCents = BigInt(wholePart * 100 + decimalPart);
  
    return {
      id: generateId(),
      amount: amountInCents,
    };
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
