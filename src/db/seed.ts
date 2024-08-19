import { seedTasks } from "@/app/_lib/actions"
import { seedDoners } from "@/app/_lib/actions/doner"
import { seedFunds } from "@/app/_lib/actions/fund"
import { seedProjects } from "@/app/_lib/actions/project"
import { seedProjectTransactions } from "@/app/_lib/actions/project-transaction"

async function runSeed() {
  console.log("⏳ Running seed...")

  const start = Date.now()

  await seedTasks({ count: 100 })
  await seedProjects()
  await seedDoners()
  await seedFunds()

  const end = Date.now()

  console.log(`✅ Seed completed in ${end - start}ms`)

  process.exit(0)
}

runSeed().catch((err) => {
  console.error("❌ Seed failed")
  console.error(err)
  process.exit(1)
})
