import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { fundTransactions } from "@/db/schemas"
import { donations, doners, type Donation } from "@/db/schemas/donation"
import { Loan, loans } from "@/db/schemas/loan"
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

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getLoans(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

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

    const where: DrizzleWhere<Donation> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          date: donations.date,
          id: donations.id,
          fundTransactionId: donations.fundTransactionId,
          amount: sql<number>`${donations.amount}/1000`,
          proposalId: donations.proposalId,
          paymentType: donations.paymentType,
          isOfficial: donations.isOfficial,
          receiptDescription: donations.receiptDescription,
          amountInText: donations.amountInText,
          projectId: donations.projectId,
          donerId: donations.donerId,
          description: fundTransactions.description,
          fundId: fundTransactions.fundId,
          currencyId: fundTransactions.currencyId,
        })
        .from(donations)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          fundTransactions,
          eq(donations.fundTransactionId, fundTransactions.id)
        )
        .orderBy(
          column && column in donations
            ? order === "asc"
              ? asc(donations[column])
              : desc(donations[column])
            : desc(donations.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(donations)
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
