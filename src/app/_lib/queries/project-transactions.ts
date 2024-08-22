import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { expensesCategories, funds, type ExpensesCategory } from "@/db/schemas"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getExpensesCategories(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ExpensesCategory | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: funds.name,
            value: name,
          })
        : undefined,

      fromDay && toDay
        ? and(gte(funds.createdAt, fromDay), lte(funds.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<ExpensesCategory> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(expensesCategories)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in expensesCategories
            ? order === "asc"
              ? asc(expensesCategories[column])
              : desc(expensesCategories[column])
            : desc(expensesCategories.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(expensesCategories)
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
