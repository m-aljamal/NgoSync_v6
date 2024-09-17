import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { currencies, fundTransactions } from "@/db/schemas"
import { donations, doners, type Donation } from "@/db/schemas/donation"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, eq, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getDonations(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Donation | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      // name
      //   ? filterColumn({
      //       column: doners.name,
      //       value: name,
      //     })
      //   : undefined,

      // Filter by createdAt

      fromDay && toDay
        ? and(gte(donations.date, fromDay), lte(donations.date, toDay))
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
          amount: donations.amount,
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
          currencyCode: currencies.code,
          donerName: doners.name,
          createdAt: donations.createdAt,
          updatedAt: donations.updatedAt,
        })
        .from(donations)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          fundTransactions,
          eq(donations.fundTransactionId, fundTransactions.id)
        )
        .innerJoin(currencies, eq(fundTransactions.currencyId, currencies.id))
        .innerJoin(doners, eq(donations.donerId, doners.id))
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
