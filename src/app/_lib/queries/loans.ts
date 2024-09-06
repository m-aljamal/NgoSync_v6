import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { projectsTransactions } from "@/db/schemas"
import { loans, type Loan } from "@/db/schemas/loan"
import { type DrizzleWhere } from "@/types"
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getLoans(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Loan | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      //   name
      //     ? filterColumn({
      //         column: doners.name,
      //         value: name,
      //       })
      //     : undefined,

      // Filter by createdAt
      fromDay && toDay
        ? and(gte(loans.createdAt, fromDay), lte(loans.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<Loan> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          date: projectsTransactions.date,
          id: loans.id,
          projectTransactionId: loans.projectTransactionId,
          amount: sql<number>`${projectsTransactions.amount}/1000`,
          projectId: projectsTransactions.projectId,
          description: projectsTransactions.description,
          currencyId: projectsTransactions.currencyId,
          employeeId: loans.employeeId,
          createdAt: loans.createdAt,
          updatedAt: loans.updatedAt,
        })
        .from(loans)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          projectsTransactions,
          eq(loans.projectTransactionId, projectsTransactions.id)
        )
        .orderBy(
          column && column in loans
            ? order === "asc"
              ? asc(loans[column])
              : desc(loans[column])
            : desc(loans.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(loans)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = calculatePageCount(total, per_page)

    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}
