import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { projectsTransactions, ProjectTransaction, tasks } from "@/db/schema"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, gte, lte, or, sql, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"

export async function getexpenses(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, amount, status, priority, operator, from, to } =
    input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ProjectTransaction | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    // const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined
    // const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined

    const fromDay = from ? sql`${projectsTransactions.createdAt} >= ${from}` : undefined
const toDay = to ? sql`${projectsTransactions.createdAt} <= ${to}` : undefined

     
    const expressions: (SQL<unknown> | undefined)[] = [
      amount
        ? filterColumn({
            column: projectsTransactions.amount,
            value: amount.toString(),
          })
        : undefined,
      // Filter tasks by status
      !!status
        ? filterColumn({
            column: tasks.status,
            value: status,
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by priority
      !!priority
        ? filterColumn({
            column: tasks.priority,
            value: priority,
            isSelectable: true,
          })
        : undefined,
      // Filter by createdAt
      fromDay && toDay
    ? and(
        sql`${projectsTransactions.createdAt} >= ${from}`,
        sql`${projectsTransactions.createdAt} <= ${to}`
      )
    : undefined,
    ]

    const where: DrizzleWhere<ProjectTransaction> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          amount: sql<number>`${projectsTransactions.amount}/1000`,
          createdAt: projectsTransactions.createdAt,
        })
        .from(projectsTransactions)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in projectsTransactions
            ? order === "asc"
              ? asc(projectsTransactions[column])
              : desc(projectsTransactions[column])
            : desc(projectsTransactions.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(projectsTransactions)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}
