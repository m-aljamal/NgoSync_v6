import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { proposals, type Proposal } from "@/db/schema"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getProposals(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Proposal | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: proposals.name,
            value: name,
          })
        : undefined,

      fromDay && toDay
        ? and(
            gte(proposals.createdAt, fromDay),
            lte(proposals.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<Proposal> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(proposals)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in proposals
            ? order === "asc"
              ? asc(proposals[column])
              : desc(proposals[column])
            : desc(proposals.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(proposals)
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
