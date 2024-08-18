import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { Doner, doners, projects, type Project } from "@/db/schema"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, or, sql, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, convertToDate } from "./utils"

export async function getDoners(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, status, operator, from, to, system } =
    input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Doner | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: doners.name,
            value: name,
          })
        : undefined,
      // Filter tasks by status
      !!status
        ? filterColumn({
            column: projects.status,
            value: status,
            isSelectable: true,
          })
        : undefined,
      !!system
        ? filterColumn({
            column: projects.system,
            value: system,
            isSelectable: true,
          })
        : undefined,

      // Filter by createdAt
      fromDay && toDay
        ? and(
            sql`${projects.createdAt} >= ${from}`,
            sql`${projects.createdAt} <= ${to}`
          )
        : undefined,
    ]

    const where: DrizzleWhere<Project> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(projects)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in projects
            ? order === "asc"
              ? asc(projects[column])
              : desc(projects[column])
            : desc(projects.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(projects)
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
