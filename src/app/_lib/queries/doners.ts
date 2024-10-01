import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { doners, type Doner } from "@/db/schemas/donation"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, eq, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getDoners(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to, type, status } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Doner | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: doners.name,
            value: name,
          })
        : undefined,

      !!type
        ? filterColumn({
            column: doners.type,
            value: type,
            isSelectable: true,
          })
        : undefined,

      !!status
        ? filterColumn({
            column: doners.status,
            value: status,
            isSelectable: true,
          })
        : undefined,

      fromDay && toDay
        ? and(gte(doners.createdAt, fromDay), lte(doners.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<Doner> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(doners)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in doners
            ? order === "asc"
              ? asc(doners[column])
              : desc(doners[column])
            : desc(doners.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(doners)
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

export const getDoner = cache(
  async ({ id, name }: { id?: string; name?: string }) => {
    if (!id && !name) return
    try {
      const data = await db.query.doners.findFirst({
        where: id
          ? eq(doners.id, id)
          : name
            ? eq(doners.name, name)
            : undefined,
      })
      return data
    } catch (error) {
      throw new Error("Error fetching doner")
    }
  }
)
