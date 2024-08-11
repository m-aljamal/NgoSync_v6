import { seedTasks } from "@/app/_lib/actions"
import { seedProjectTransactions } from "@/app/_lib/actions/project-transaction"

async function runSeed() {
  console.log("⏳ Running seed...")

  const start = Date.now()

  await seedProjectTransactions()
  // await seedTasks({ count: 100 })

  const end = Date.now()

  console.log(`✅ Seed completed in ${end - start}ms`)

  process.exit(0)
}

runSeed().catch((err) => {
  console.error("❌ Seed failed")
  console.error(err)
  process.exit(1)
})
